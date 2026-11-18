import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { faqItemSchema } from "@/lib/validators";

export type FaqItem = { question: string; answer: string };

export type SelfDriveContent = {
  key: string;
  title: string;
  intro: string;
  requirements: string[];
  foreignNotes: string;
  pricingNotes: string;
  insuranceNotes: string;
  pickupInfo: string;
  faq: FaqItem[];
};

export const SELF_DRIVE_FALLBACK: SelfDriveContent = {
  key: "self-drive",
  title: "Self-drive car rental in Sri Lanka",
  intro:
    "Take the vehicle yourself. Mahawaththa rents complete cars to local drivers and visitors, with daily rates in Sri Lankan rupees and WhatsApp booking. The figures below are placeholders until the business confirms them.",
  requirements: [
    "A valid driving licence for the rental period.",
    "National identity card or passport.",
    "Minimum age: 23 years (placeholder — please confirm).",
    "A refundable security deposit, confirmed before handover.",
  ],
  foreignNotes:
    "Visitors can rent with a passport and a licence from their home country. An international driving permit is recommended. These notes are placeholders.",
  pricingNotes:
    "The daily rate covers the vehicle for 24 hours. A daily distance allowance and the extra-kilometre rate are confirmed at booking. Fuel is not included: please return the car with the same fuel level.",
  insuranceNotes:
    "Each self-drive rental includes the cover explained at pickup. Roadside assistance contact details are given with the keys. Exact policy wording is a placeholder.",
  pickupInfo:
    "Pickup and return are arranged in Colombo (exact branch to be confirmed). Airport handover can be requested on WhatsApp.",
  faq: [
    {
      question: "Can a visitor drive the rental car in Sri Lanka?",
      answer:
        "Yes. Bring your passport and home driving licence. An international driving permit is recommended. This answer is placeholder text.",
    },
    {
      question: "Is fuel included in the daily rate?",
      answer: "No. Return the vehicle with the same fuel level you received.",
    },
  ],
};

function asStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = faqItemSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

async function readSelfDriveContent() {
  "use cache";
  cacheTag("page:self-drive");
  cacheLife("hours");
  return prisma.pageContent.findUnique({ where: { key: "self-drive" } });
}

export async function getSelfDriveContent(): Promise<SelfDriveContent> {
  try {
    const row = await readSelfDriveContent();
    if (!row) return SELF_DRIVE_FALLBACK;
    const requirements = asStringList(row.requirements);
    return {
      key: row.key,
      title: row.title,
      intro: row.intro,
      requirements: requirements.length > 0 ? requirements : SELF_DRIVE_FALLBACK.requirements,
      foreignNotes: row.foreignNotes,
      pricingNotes: row.pricingNotes,
      insuranceNotes: row.insuranceNotes,
      pickupInfo: row.pickupInfo,
      faq: asFaq(row.faq),
    };
  } catch (error) {
    console.error("content_load_failed", error);
    return SELF_DRIVE_FALLBACK;
  }
}
