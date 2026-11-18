"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { settingsSchema } from "@/lib/validators";
import { DEFAULT_SETTINGS, SETTING_KEYS } from "@/lib/constants";
import { revalidateSettings } from "@/lib/revalidate";
import { prisma } from "@/lib/prisma";

export async function saveSettings(_prev: unknown, formData: FormData) {
  try {
    const admin = await requireAdmin();
    if (!admin) return { ok: false, error: "Not authenticated." };
    const existingRows = await prisma.siteSetting.findMany({
      where: { key: { in: SETTING_KEYS } },
    });
    const existing = Object.fromEntries(existingRows.map((row) => [row.key, row.value])) as Record<string, string>;
    const defaults = DEFAULT_SETTINGS as unknown as Record<string, string>;
    const raw: Record<string, string> = {};
    for (const key of SETTING_KEYS) {
      raw[key] = formData.has(key)
        ? String(formData.get(key) ?? "").trim()
        : existing[key] ?? defaults[key] ?? "";
    }
    const result = settingsSchema.safeParse(raw);
    if (!result.success) {
      const first = result.error.issues[0];
      return { ok: false, error: `${first.path.join(".")}: ${first.message}` };
    }
    const data = result.data as Record<string, string>;
    // Upsert only fields submitted by the current form or image uploader.
    const operations = SETTING_KEYS
      .filter((key) => formData.has(key))
      .map((key) => prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(data[key]) },
        create: { key, value: String(data[key]) },
      }));
    await Promise.all(operations);
    revalidateSettings();
    return { ok: true };
  } catch (err: unknown) {
    console.error("[saveSettings]", err);
    return { ok: false, error: "Failed to save settings." };
  }
}
