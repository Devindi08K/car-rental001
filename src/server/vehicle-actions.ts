"use server";

import { redirect } from "next/navigation";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import { MAX_VEHICLE_PHOTOS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { revalidateVehicles } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth-guard";
import { vehicleSchema } from "@/lib/validators";
import { slugify } from "@/lib/format";

export type FormState = { ok?: boolean; error?: string } | undefined;

function readVehicleForm(formData: FormData) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    images = [];
  }
  return vehicleSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    rentalType: formData.get("rentalType"),
    status: formData.get("status"),
    pricePerDay: formData.get("pricePerDay"),
    seats: formData.get("seats"),
    transmission: formData.get("transmission"),
    fuelType: formData.get("fuelType"),
    description: formData.get("description"),
    images,
    isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") || 0,
  });
}

async function rejectExtraImages(images: string[], existing: string[]) {
  if (images.length <= MAX_VEHICLE_PHOTOS) return null;
  const kept = new Set(existing);
  await Promise.all(images.filter((url) => !kept.has(url)).map((url) => destroyCloudinaryImage(url)));
  return "A vehicle can have at most 5 photos.";
}

async function uniqueVehicleSlug(name: string, currentId?: string) {
  const base = slugify(name) || "vehicle";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.vehicle.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function saveVehicle(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Please sign in again." };

  const parsed = readVehicleForm(formData);
  if (!parsed.success) return { error: "Check the vehicle details and try again." };

  const id = String(formData.get("id") ?? "");
  const slug = await uniqueVehicleSlug(parsed.data.name, id || undefined);
  const data = { ...parsed.data, slug };

  try {
    if (id) {
      const current = await prisma.vehicle.findUnique({ where: { id } });
      if (!current) return { error: "That vehicle could not be found." };
      const extra = await rejectExtraImages(parsed.data.images, current.images);
      if (extra) return { error: extra };
      const removed = current.images.filter((url) => !parsed.data.images.includes(url));
      await prisma.vehicle.update({ where: { id }, data });
      await Promise.all(removed.map((url) => destroyCloudinaryImage(url)));
      revalidateVehicles([current.slug, slug]);
    } else {
      const extra = await rejectExtraImages(parsed.data.images, []);
      if (extra) return { error: extra };
      await prisma.vehicle.create({ data });
      revalidateVehicles([slug]);
    }
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "That slug is already used by another vehicle. Choose a different one." };
    }
    console.error("save_vehicle_failed", error);
    return { error: "The vehicle could not be saved." };
  }

  redirect("/admin/vehicles?notice=saved");
}

export async function deleteVehicle(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) redirect("/admin/vehicles");
  await prisma.vehicle.delete({ where: { id } });
  await Promise.all(vehicle.images.map((url) => destroyCloudinaryImage(url)));
  revalidateVehicles([vehicle.slug]);
  redirect("/admin/vehicles?notice=deleted");
}

export async function toggleVehicleStatus(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) redirect("/admin/vehicles");
  await prisma.vehicle.update({
    where: { id },
    data: { status: vehicle.status === "AVAILABLE" ? "RENTED" : "AVAILABLE" },
  });
  revalidateVehicles([vehicle.slug]);
  redirect("/admin/vehicles?notice=status");
}

export async function moveVehicle(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const index = vehicles.findIndex((vehicle) => vehicle.id === id);
  const other = vehicles[index + direction];
  const current = vehicles[index];
  if (!current || !other) redirect("/admin/vehicles");
  const currentOrder = current.sortOrder === other.sortOrder ? index : current.sortOrder;
  const otherOrder = current.sortOrder === other.sortOrder ? index + direction : other.sortOrder;
  await prisma.$transaction([
    prisma.vehicle.update({ where: { id: current.id }, data: { sortOrder: otherOrder } }),
    prisma.vehicle.update({ where: { id: other.id }, data: { sortOrder: currentOrder } }),
  ]);
  revalidateVehicles([current.slug, other.slug]);
  redirect("/admin/vehicles?notice=saved");
}

export async function discardUploadedImage(url: string, vehicleId?: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Please sign in again." };
  if (!url.startsWith("https://res.cloudinary.com/")) return { error: "That photo could not be removed." };

  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (vehicle?.images.includes(url)) {
      const images = vehicle.images.filter((item) => item !== url);
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { images } });
      revalidateVehicles([vehicle.slug]);
    }
  }
  await destroyCloudinaryImage(url);
  return { ok: true };
}
