"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { gallerySchema } from "@/lib/validators";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import { revalidateGallery } from "@/lib/revalidate";
import { prisma } from "@/lib/prisma";

export async function addGalleryImage(_prev: unknown, formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Not authenticated." };
  const raw = {
    url: formData.get("url"),
    alt: formData.get("alt"),
    section: formData.get("section"),
    sortOrder: formData.get("sortOrder") ?? 0,
  };
  const result = gallerySchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    return { ok: false, error: first.message };
  }
  try {
    await prisma.galleryImage.create({ data: result.data });
    revalidateGallery();
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to add image." };
  }
}

export async function deleteGalleryImage(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Not authenticated." };
  try {
    const img = await prisma.galleryImage.findUnique({ where: { id } });
    if (!img) return { ok: false, error: "Not found." };
    await prisma.galleryImage.delete({ where: { id } });
    await destroyCloudinaryImage(img.url);
    revalidateGallery();
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete image." };
  }
}
