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
      settings[row.key as SettingKey] = row.value;
    }
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
