import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_SETTINGS, type SettingKey } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export type SiteSettings = Record<SettingKey, string>;

async function readSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("settings");
  cacheLife("hours");

  const rows = await prisma.siteSetting.findMany();
  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in settings) {
      const key = row.key as SettingKey;
      const previousPlaceholder =
        (key === "phone" && row.value === "+94 XX XXX XXXX") ||
        (key === "whatsappNumber" && row.value === "94XXXXXXXXX");
      settings[key] = previousPlaceholder ? DEFAULT_SETTINGS[key] : row.value;
    }
  }
  const phoneDigits = settings.phone.replace(/\D/g, "");
  const whatsappDigits = settings.whatsappNumber.replace(/\D/g, "");
  if (phoneDigits === "0706465477" && whatsappDigits === "0770341970") {
    settings.phone = DEFAULT_SETTINGS.phone;
    settings.whatsappNumber = DEFAULT_SETTINGS.whatsappNumber;
  }
  return settings;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    return await readSettings();
  } catch (error) {
    console.error("settings_load_failed", error);
    return { ...DEFAULT_SETTINGS };
  }
}
