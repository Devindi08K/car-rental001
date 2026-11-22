import { z } from "zod";
import { MAX_VEHICLE_PHOTOS } from "@/lib/constants";
import { sanitizeMultiline, sanitizeText } from "@/lib/sanitize";

const text = (min: number, max: number) =>
  z
    .string()
    .max(max)
    .transform((value) => sanitizeText(value))
    .refine((value) => value.length >= min, `Enter at least ${min} characters.`);

const multiline = (min: number, max: number) =>
  z
    .string()
    .max(max)
    .transform((value) => sanitizeMultiline(value))
    .refine((value) => value.length >= min, `Enter at least ${min} characters.`);

export const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        (url.hostname === "res.cloudinary.com" || url.hostname === "images.unsplash.com")
      );
    } catch {
      return false;
    }
  }, "Use an approved image address.");

export const vehicleSchema = z.object({
  name: text(2, 120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  category: z.enum(["LUXURY", "SEDAN", "SUV", "VAN", "WEDDING", "ECONOMY"]),
  rentalType: z.enum(["SELF_DRIVE", "WITH_DRIVER", "BOTH"]),
  status: z.enum(["AVAILABLE", "RENTED"]),
  pricePerDay: z.coerce.number().int().min(0).max(10_000_000),
  seats: z.coerce.number().int().min(1).max(30),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]),
  description: multiline(10, 5000),
  images: z.array(imageUrlSchema).max(MAX_VEHICLE_PHOTOS),
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const faqItemSchema = z.object({
  question: text(3, 200),
  answer: multiline(3, 2000),
});

export const pageContentSchema = z.object({
  key: z.literal("self-drive"),
  title: text(3, 160),
  intro: multiline(10, 4000),
  requirements: z.array(text(2, 300)).min(1).max(20),
  foreignNotes: multiline(10, 4000),
  pricingNotes: multiline(10, 4000),
  insuranceNotes: multiline(10, 4000),
  pickupInfo: multiline(10, 4000),
  faq: z.array(faqItemSchema).max(20),
});

const optionalHttps = z
  .string()
  .trim()
  .max(300)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a full https link, or leave the field empty.");

const optionalPageImage = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith("/")) return true;
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        (url.hostname === "res.cloudinary.com" || url.hostname === "images.unsplash.com")
      );
    } catch {
      return false;
    }
  }, "Use an approved uploaded image or leave the field empty.");

const mapEmbedUrl = z
  .string()
  .trim()
  .max(600)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        ["www.google.com", "maps.google.com", "www.google.lk"].includes(url.hostname)
      );
    } catch {
      return false;
    }
  }, "Use a Google Maps embed link.");

export const settingsSchema = z.object({
  phone: text(3, 40),
  whatsappNumber: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[0-9+X\s-]+$/, "Use digits, or the placeholder 94XXXXXXXXX."),
  email: z.string().trim().email().max(200),
  address: text(3, 300),
  openingHours: text(3, 200),
  facebookUrl: optionalHttps,
  instagramUrl: optionalHttps,
  tiktokUrl: optionalHttps,
  mapEmbedUrl,
  logoUrl: optionalPageImage,
  heroImageUrl: optionalPageImage,
  airportImageUrl: optionalPageImage,
  chauffeurImageUrl: optionalPageImage,
  selfDriveImageUrl: optionalPageImage,
  islandTourImageUrl: optionalPageImage,
  weddingHeroImageUrl: optionalPageImage,
  promotionAirportImageUrl: optionalPageImage,
  promotionWeddingImageUrl: optionalPageImage,
  promotionLongTermImageUrl: optionalPageImage,
});

export const enquirySchema = z.object({
  name: text(2, 80),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9][0-9\s()-]{6,20}$/, "Enter a valid phone number."),
  email: z
    .string()
    .trim()
    .max(200)
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Enter a valid email, or leave it blank.",
    )
    .transform((value) => (value === "" ? undefined : value)),
  message: multiline(10, 2000),
  vehicleId: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : undefined)),
  companyWebsite: z.string().max(200).optional(),
  turnstileToken: z.string().max(4000).optional(),
});

export const customerReviewSchema = z.object({
  name: text(2, 80),
  review: multiline(10, 1200),
  rating: z.coerce.number().int().min(1).max(5),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
});

export const gallerySchema = z.object({
  url: imageUrlSchema,
  alt: text(2, 160),
  section: z.enum(["WEDDING", "GENERAL"]),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type PageContentInput = z.infer<typeof pageContentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
