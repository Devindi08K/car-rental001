"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { settingsSchema } from "@/lib/validators";
import { SETTING_KEYS } from "@/lib/constants";
import { revalidateSettings } from "@/lib/revalidate";
import { prisma } from "@/lib/prisma";

export async function saveSettings(_prev: unknown, formData: FormData) {
  try {
    const admin = await requireAdmin();
    if (!admin) return { ok: false, error: "Not authenticated." };
    const raw: Record<string, string> = {};
    for (const key of SETTING_KEYS) {
      raw[key] = String(formData.get(key) ?? "").trim();
    }
    const result = settingsSchema.safeParse(raw);
    if (!result.success) {
      const first = result.error.issues[0];
      return { ok: false, error: `${first.path.join(".")}: ${first.message}` };
    }
    const data = result.data;
    // upsert each setting
    await Promise.all(
      SETTING_KEYS.map((key) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(data[key]) },
          create: { key, value: String(data[key]) },
        })
      )
    );
    revalidateSettings();
    return { ok: true };
  } catch (err: unknown) {
    console.error("[saveSettings]", err);
    return { ok: false, error: "Failed to save settings." };
  }
}
