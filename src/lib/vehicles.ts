import { cacheLife, cacheTag } from "next/cache";
import type { Prisma, RentalType, Transmission, VehicleCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type VehicleFilters = {
  category?: VehicleCategory;
  rentalType?: RentalType;
  transmission?: Transmission;
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
};

const categories = new Set(["LUXURY", "SEDAN", "SUV", "VAN", "WEDDING", "ECONOMY"]);
const rentalTypes = new Set(["SELF_DRIVE", "WITH_DRIVER", "BOTH"]);
const transmissions = new Set(["AUTOMATIC", "MANUAL"]);

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numberOrUndefined(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.round(parsed);
}

export function parseVehicleFilters(params: {
  [key: string]: string | string[] | undefined;
}): VehicleFilters {
  const category = one(params.category);
  const rentalType = one(params.rentalType);
  const transmission = one(params.transmission);
  const seats = numberOrUndefined(one(params.seats));
  return {
    category: category && categories.has(category) ? (category as VehicleCategory) : undefined,
    rentalType: rentalType && rentalTypes.has(rentalType) ? (rentalType as RentalType) : undefined,
    transmission:
      transmission && transmissions.has(transmission) ? (transmission as Transmission) : undefined,
    seats,
    minPrice: numberOrUndefined(one(params.minPrice)),
    maxPrice: numberOrUndefined(one(params.maxPrice)),
  };
}

async function readVehicles(filters: VehicleFilters) {
  "use cache";
  cacheTag("vehicles");
  cacheLife("hours");

  const where: Prisma.VehicleWhereInput = {};
  if (filters.category) where.category = filters.category;
  if (filters.rentalType) {
    if (filters.rentalType === "SELF_DRIVE" || filters.rentalType === "WITH_DRIVER") {
      where.rentalType = { in: [filters.rentalType, "BOTH"] };
    } else {
      where.rentalType = "BOTH";
    }
  }
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.seats) {
    where.seats = filters.seats >= 8 ? { gte: 8 } : filters.seats;
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.pricePerDay = {};
    if (filters.minPrice != null) where.pricePerDay.gte = filters.minPrice;
    if (filters.maxPrice != null) where.pricePerDay.lte = filters.maxPrice;
  }

  return prisma.vehicle.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getVehicles(filters: VehicleFilters = {}) {
  try {
    return await readVehicles(filters);
  } catch (error) {
    console.error("vehicles_load_failed", error);
    return [];
  }
}

async function readVehicle(slug: string) {
  "use cache";
  cacheTag("vehicles");
  cacheLife("hours");
  return prisma.vehicle.findUnique({ where: { slug } });
}

export async function getVehicleBySlug(slug: string) {
  try {
    return await readVehicle(slug);
  } catch (error) {
    console.error("vehicle_load_failed", error);
    return null;
  }
}

async function readSelfDrive() {
  "use cache";
  cacheTag("vehicles");
  cacheLife("hours");
  return prisma.vehicle.findMany({
    where: { rentalType: { in: ["SELF_DRIVE", "BOTH"] } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getSelfDriveVehicles() {
  try {
    return await readSelfDrive();
  } catch (error) {
    console.error("self_drive_load_failed", error);
    return [];
  }
}

async function readFeatured() {
  "use cache";
  cacheTag("vehicles");
  cacheLife("hours");
  return prisma.vehicle.findMany({
    where: { isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: 6,
  });
}

export async function getFeaturedVehicles() {
  try {
    return await readFeatured();
  } catch (error) {
    console.error("featured_load_failed", error);
    return [];
  }
}
