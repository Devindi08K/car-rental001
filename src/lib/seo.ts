import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/constants";

export function siteUrl() {
  const fallback = "http://localhost:3000";
    const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");;
  if (!configured) return fallback;

  try {
    return new URL(configured).origin;
  } catch {
    return fallback;
  }
}

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  const url = new URL(input.path, siteUrl()).toString();
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: "website",
      locale: "en_LK",
      siteName: BUSINESS_NAME,
    },
  };
}
