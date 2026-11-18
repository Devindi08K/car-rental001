import type { FuelType, RentalType, Transmission, VehicleCategory, VehicleStatus } from "@prisma/client";

const labels: Record<string, string> = {
  LUXURY: "Luxury",
  SEDAN: "Sedan",
  SUV: "SUV",
  VAN: "Van",
  WEDDING: "Wedding",
  ECONOMY: "Economy",
  SELF_DRIVE: "Self-drive",
  WITH_DRIVER: "With driver",
  BOTH: "Self-drive or chauffeur",
  AVAILABLE: "Available",
  RENTED: "Rented",
  AUTOMATIC: "Automatic",
  MANUAL: "Manual",
  PETROL: "Petrol",
  DIESEL: "Diesel",
  HYBRID: "Hybrid",
  ELECTRIC: "Electric",
  NEW: "New",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
  WEDDING_SECTION: "Wedding",
  GENERAL: "General",
};

export function label(value: string) {
  return labels[value] ?? value;
}

export function formatLkr(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function rentalLabel(value: RentalType) {
  return label(value);
}

export function statusLabel(value: VehicleStatus) {
  return label(value);
}

export function categoryLabel(value: VehicleCategory) {
  return label(value);
}

export function transmissionLabel(value: Transmission) {
  return label(value);
}

export function fuelLabel(value: FuelType) {
  return label(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}
