import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ─── Admin user ────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Seeding stopped: ADMIN_EMAIL and ADMIN_PASSWORD must both be set.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Seeding stopped: ADMIN_EMAIL is not a valid email address.");
  }
  if (password.length < 12) {
    throw new Error("Seeding stopped: ADMIN_PASSWORD must contain at least 12 characters.");
  }
  const hashed = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hashed },
    create: { email, passwordHash: hashed },
  });
  console.log(`✅ Admin user: ${email}`);

  // ─── Site settings ─────────────────────────────────────────────────────────
  const defaultSettings: Record<string, string> = {
    phone: "+94 77 123 4567",
    whatsappNumber: "94771234567",
    email: "enquiries@mahawaththa.lk",
    address: "No. 123, Mahawaththa Road, Colombo 05, Sri Lanka",
    openingHours: "Open daily, 7:00 AM – 10:00 PM",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    mapEmbedUrl: "https://maps.google.com/maps?q=Colombo+Sri+Lanka&z=12&output=embed",
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("✅ Site settings");

  // ─── Self-drive page content ────────────────────────────────────────────────
  await prisma.pageContent.upsert({
    where: { key: "self-drive" },
    update: {},
    create: {
      key: "self-drive",
      title: "Self-Drive Car Rental in Sri Lanka",
      intro: "Take the wheel yourself and explore Sri Lanka at your own pace.\n\nWe offer a range of well-maintained vehicles for self-drive rental, from compact sedans to spacious SUVs. All our self-drive vehicles come with comprehensive insurance and 24/7 roadside support.",
      requirements: JSON.parse(JSON.stringify([
        "A valid driving licence (Sri Lankan or international)",
        "National identity card or valid passport",
        "Minimum age: 23 years",
        "A refundable security deposit (confirmed at booking)",
        "Credit or debit card for deposit authorisation",
      ])),
      foreignNotes: "Foreign visitors are welcome to rent with a valid passport and home-country driving licence. We strongly recommend obtaining an International Driving Permit (IDP) before travelling.\n\nYour IDP must be presented alongside your original licence at pickup.",
      pricingNotes: "Daily rates cover a 24-hour period from time of pickup.\n\nFuel is not included — please return the vehicle with the same fuel level as received.\n\nExtra kilometre charges and daily distance allowances are confirmed at the time of booking.",
      insuranceNotes: "Every self-drive rental includes third-party insurance as required by Sri Lankan law.\n\nComprehensive collision cover is available as an optional add-on.\n\nRoadside assistance contact details are provided with the keys.",
      pickupInfo: "Vehicles are collected from our Colombo depot.\n\nAirport handover (BIA / Katunayake) can be arranged — please request via WhatsApp at least 24 hours in advance.\n\nReturn outside of business hours is possible with prior arrangement.",
      faq: JSON.parse(JSON.stringify([
        {
          question: "Can a foreign visitor drive the rental car?",
          answer: "Yes. Bring your passport, home-country driving licence, and ideally an International Driving Permit. The IDP should be obtained in your home country before travel.",
        },
        {
          question: "Is fuel included in the daily rate?",
          answer: "No. Vehicles are handed over with a specified fuel level and must be returned at the same level. We recommend topping up before return.",
        },
        {
          question: "What happens if there is an accident?",
          answer: "Contact us immediately on WhatsApp or phone. Do not leave the scene before filing a police report. Full instructions are provided in the vehicle folder.",
        },
      ])),
    },
  });
  console.log("✅ Self-drive page content");

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
