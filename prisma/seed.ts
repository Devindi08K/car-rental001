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

  // ─── Sample vehicles ────────────────────────────────────────────────────────
  const vehicles = [
    {
      name: "Toyota Corolla 2023",
      slug: "toyota-corolla-2023",
      category: "SEDAN" as const,
      rentalType: "BOTH" as const,
      status: "AVAILABLE" as const,
      pricePerDay: 12000,
      seats: 5,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      description:
        "The Toyota Corolla is Sri Lanka's most trusted family sedan. Comfortable for long drives, fuel-efficient in city traffic, and equipped with modern safety features.\n\nIdeal for airport transfers, upcountry tours, and daily commutes. Available with or without a driver.",
      images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
      ],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "Mercedes-Benz E-Class",
      slug: "mercedes-benz-e-class",
      category: "LUXURY" as const,
      rentalType: "WITH_DRIVER" as const,
      status: "AVAILABLE" as const,
      pricePerDay: 45000,
      seats: 5,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      description:
        "Experience true luxury with the Mercedes-Benz E-Class. Plush leather interior, advanced climate control, and a whisper-quiet ride make this the preferred choice for executive travel and special occasions.\n\nAll trips include a professional chauffeur dressed in formal attire.",
      images: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      ],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: "Toyota Land Cruiser Prado",
      slug: "toyota-land-cruiser-prado",
      category: "SUV" as const,
      rentalType: "BOTH" as const,
      status: "AVAILABLE" as const,
      pricePerDay: 35000,
      seats: 7,
      transmission: "AUTOMATIC" as const,
      fuelType: "DIESEL" as const,
      description:
        "The Land Cruiser Prado conquers Sri Lanka's diverse terrain — from Colombo's highways to the highland roads of Ella and Nuwara Eliya. High ground clearance, 7 seats, and powerful 4WD make it the ultimate touring vehicle.\n\nAvailable for self-drive (with appropriate licence) or with an experienced driver.",
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80",
      ],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: "Toyota KDH Van",
      slug: "toyota-kdh-van",
      category: "VAN" as const,
      rentalType: "WITH_DRIVER" as const,
      status: "AVAILABLE" as const,
      pricePerDay: 22000,
      seats: 8,
      transmission: "MANUAL" as const,
      fuelType: "DIESEL" as const,
      description:
        "The Toyota KDH Hi-Ace is the preferred van for group travel across Sri Lanka. With 8 comfortable seats and generous luggage space, it handles pilgrimages, family tours, and corporate team outings with ease.\n\nAll bookings include an experienced driver familiar with island-wide routes.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      isFeatured: false,
      sortOrder: 4,
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        ...v,
        images: v.images,
      },
    });
  }
  console.log(`✅ ${vehicles.length} sample vehicles`);

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
