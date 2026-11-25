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
    const highlights = parseJson<string[]>(formData.get("highlights"), []);
    const gallery = parseJson<string[]>(formData.get("gallery"), []);
    const itinerary = parseJson<unknown[]>(formData.get("itinerary"), []) as Prisma.InputJsonValue;
    const inclusions = parseJson<string[]>(formData.get("inclusions"), []);
    const exclusions = parseJson<string[]>(formData.get("exclusions"), []);
    const vehicles = parseJson<unknown[]>(formData.get("vehicles"), []) as Prisma.InputJsonValue;

    const title = sanitizeText(String(formData.get("title") ?? ""));
    const eyebrow = sanitizeText(String(formData.get("eyebrow") ?? ""));
    const intro = sanitizeMultiline(String(formData.get("intro") ?? ""));
    if (title.length < 3 || eyebrow.length < 3 || intro.length < 10) {
      return { error: "Complete the title, eyebrow and introduction." };
    }

    await prisma.tourPackage.upsert({
      where: { key: "royal-route" },
      create: {
        key: "royal-route",
        title,
        eyebrow,
        intro,
        duration: sanitizeText(String(formData.get("duration") ?? "")),
        destinations: sanitizeText(String(formData.get("destinations") ?? "")),
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
        duration: sanitizeText(String(formData.get("duration") ?? "")),
        destinations: sanitizeText(String(formData.get("destinations") ?? "")),
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
