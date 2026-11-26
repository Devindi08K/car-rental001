"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath, updateTag } from "next/cache";
import { sanitizeMultiline, sanitizeText } from "@/lib/sanitize";
import type { Prisma } from "@prisma/client";

export type TourFormState = { ok?: boolean; error?: string } | undefined;

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    return JSON.parse(String(value ?? "null")) as T;
  } catch {
    return fallback;
  }
}

export async function saveTourPackage(_state: TourFormState, formData: FormData): Promise<TourFormState> {
  await requireAdmin();
  try {
    const highlights = parseJson<unknown[]>(formData.get("highlights"), []).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    ).map((item) => sanitizeText(item));
    const gallery = parseJson<unknown[]>(formData.get("gallery"), []).filter(
      (item): item is string => typeof item === "string" && item.trim().startsWith("https://"),
    ).map((item) => item.trim());
    const itinerary = parseJson<unknown[]>(formData.get("itinerary"), []) as Prisma.InputJsonValue;
    const inclusions = parseJson<unknown[]>(formData.get("inclusions"), []).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    ).map((item) => sanitizeText(item));
    const exclusions = parseJson<unknown[]>(formData.get("exclusions"), []).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    ).map((item) => sanitizeText(item));
    const vehicles = parseJson<unknown[]>(formData.get("vehicles"), []) as Prisma.InputJsonValue;

    const title = sanitizeText(String(formData.get("title") ?? ""));
    const eyebrow = sanitizeText(String(formData.get("eyebrow") ?? ""));
    const intro = sanitizeMultiline(String(formData.get("intro") ?? ""));
    const duration = sanitizeText(String(formData.get("duration") ?? ""));
    const destinations = sanitizeText(String(formData.get("destinations") ?? ""));
    if (title.length < 3 || eyebrow.length < 3 || intro.length < 10 || duration.length < 3 || destinations.length < 3) {
      return { error: "Complete the tour title, eyebrow, duration, destinations and introduction." };
    }

    await prisma.tourPackage.upsert({
      where: { key: "royal-route" },
      create: {
        key: "royal-route",
        title,
        eyebrow,
        intro,
        duration,
        destinations,
        highlights,
        heroImageUrl: String(formData.get("heroImageUrl") ?? "").trim(),
        gallery,
        itinerary,
        inclusions,
        exclusions,
        vehicles,
      },
      update: {
        title,
        eyebrow,
        intro,
        duration,
        destinations,
        highlights,
        heroImageUrl: String(formData.get("heroImageUrl") ?? "").trim(),
        gallery,
        itinerary,
        inclusions,
        exclusions,
        vehicles,
      },
    });
    updateTag("tour-package");
    revalidatePath("/", "layout");
    revalidatePath("/tours");
    revalidatePath("/admin/tours");
    return { ok: true };
  } catch (error) {
    console.error("save_tour_failed", error);
    return { error: "The tour package could not be saved." };
  }
}
