"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidateContent } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth-guard";
import { pageContentSchema } from "@/lib/validators";

export type FormState = { ok?: boolean; error?: string } | undefined;

export async function savePageContent(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Please sign in again." };

  let requirements: unknown = [];
  let faq: unknown = [];
  try {
    requirements = JSON.parse(String(formData.get("requirements") ?? "[]"));
    faq = JSON.parse(String(formData.get("faq") ?? "[]"));
  } catch {
    return { error: "Check the page content and try again." };
  }

  const parsed = pageContentSchema.safeParse({
    key: "self-drive",
    title: formData.get("title"),
    intro: formData.get("intro"),
    requirements,
    foreignNotes: formData.get("foreignNotes"),
    pricingNotes: formData.get("pricingNotes"),
    insuranceNotes: formData.get("insuranceNotes"),
    pickupInfo: formData.get("pickupInfo"),
    faq,
  });
  if (!parsed.success) return { error: "Check the page content and try again." };

  try {
    await prisma.pageContent.upsert({
      where: { key: "self-drive" },
      create: parsed.data,
      update: parsed.data,
    });
    revalidateContent();
  } catch (error) {
    console.error("save_content_failed", error);
    return { error: "The page could not be saved." };
  }

  redirect("/admin/content?notice=saved");
}
