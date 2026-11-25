import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export type TourHighlight = { title: string; description: string };
export type TourVehicle = { name: string; capacity: string; features: string };
export type TourDay = {
  day: string;
  title: string;
  route: string;
  intro: string;
  stay: string;
  images: { src: string; alt: string }[];
  highlights: [string, string][];
};
export type TourPackage = {
  key: string;
  title: string;
  eyebrow: string;
  intro: string;
  duration: string;
  destinations: string;
  highlights: string[];
  heroImageUrl: string;
  gallery: string[];
  itinerary: TourDay[];
  inclusions: string[];
  exclusions: string[];
  vehicles: TourVehicle[];
};

const FALLBACK_ITINERARY: TourDay[] = [
  { day: "01", title: "Arrival, Negombo & Colombo", route: "Airport — Negombo — Colombo", intro: "Warm welcome, coastal transfer and an easy introduction to island life.", stay: "Colombo", images: [
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", alt: "Tropical coastline" },
    { src: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=85", alt: "Sri Lankan coastal village" },
  ], highlights: [["Airport welcome", "Meet and greet at arrival"], ["Private transfer", "Comfortable transfer to your hotel"], ["Negombo Fishing Village", "Explore the traditional fishing village"], ["Galle Face Green", "Evening oceanfront stroll"]] },
  { day: "02", title: "Colombo to Sigiriya", route: "Colombo — Sigiriya", intro: "Travel into Sri Lanka's cultural heart.", stay: "Sigiriya", images: [
    { src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85", alt: "Ancient rock temple" },
    { src: "https://images.unsplash.com/photo-1586798066793-64d56e0d7c6d?auto=format&fit=crop&w=1200&q=85", alt: "Rock landscape" },
  ], highlights: [["Breakfast", "Breakfast at hotel"], ["Dambulla Cave Temple", "Visit the ancient cave temple"], ["Sigiriya sunset", "Panoramic sunset viewpoint"]] },
  { day: "03", title: "Sigiriya, Matale & Kandy", route: "Sigiriya — Matale — Kandy", intro: "Explore ancient history and arrive in the cultural capital.", stay: "Kandy", images: [
    { src: "https://images.unsplash.com/photo-1588600025441-0efc29574fa2?auto=format&fit=crop&w=1200&q=85", alt: "Sigiriya fortress" },
    { src: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85", alt: "Kandy temple" },
  ], highlights: [["Sigiriya Rock Fortress", "Climb the UNESCO-listed rock fortress"], ["Spice Garden", "Visit a traditional Matale spice garden"], ["Temple of the Tooth", "Explore Kandy's sacred temple"], ["Cultural show", "Enjoy traditional Kandyan dance"]] },
  { day: "04", title: "Kandy to Nuwara Eliya", route: "Kandy — Nuwara Eliya", intro: "Cross tea plantations, waterfalls and misty mountain roads.", stay: "Nuwara Eliya", images: [
    { src: "https://images.unsplash.com/photo-1578193216685-ec853ea44a43?auto=format&fit=crop&w=1200&q=85", alt: "Botanical garden" },
    { src: "https://images.unsplash.com/photo-1562695930-bf8860c4e1e6?auto=format&fit=crop&w=1200&q=85", alt: "Tea plantations" },
  ], highlights: [["Royal Botanical Gardens", "Explore the historic gardens"], ["Tea factory", "Tour a Ceylon tea factory"], ["Ramboda Falls", "Stop at the mountain waterfall"], ["Gregory Lake", "Relax beside the lake"]] },
  { day: "05", title: "Nuwara Eliya to Ella", route: "Nuwara Eliya — Ella", intro: "Ride through the highlands on Sri Lanka's famous scenic railway.", stay: "Ella", images: [
    { src: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=85", alt: "Scenic train" },
    { src: "https://images.unsplash.com/photo-1584813910479-55fa7c63a1f5?auto=format&fit=crop&w=1200&q=85", alt: "Nine Arch Bridge" },
  ], highlights: [["Scenic train ride", "Journey through tea country"], ["Nine Arch Bridge", "Admire Ella's iconic bridge"], ["Little Adam's Peak", "Enjoy a short mountain hike"], ["Ella town", "Explore cafés and boutique shops"]] },
  { day: "06", title: "Ella, Yala & Mirissa", route: "Ella — Yala — Mirissa", intro: "Experience wildlife and finish beside the southern coast.", stay: "Mirissa", images: [
    { src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=85", alt: "Leopard" },
    { src: "https://images.unsplash.com/photo-1557050543-cc5db0e1fe73?auto=format&fit=crop&w=1200&q=85", alt: "Elephants" },
  ], highlights: [["Yala safari", "Enter Yala National Park by jeep"], ["Wildlife", "Look for elephants and leopards"], ["Beach sunset", "Continue to Mirissa"], ["Overnight", "Stay on the southern coast"]] },
  { day: "07", title: "Mirissa to Galle & Airport", route: "Mirissa — Galle — Airport", intro: "End with a beach morning and historic Galle.", stay: "Departure", images: [
    { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", alt: "Tropical beach" },
    { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85", alt: "Coastal lighthouse" },
  ], highlights: [["Mirissa beach", "Enjoy a relaxed morning"], ["Galle Dutch Fort", "Explore the UNESCO fort"], ["Lunch in Galle", "Visit a heritage restaurant"], ["Airport transfer", "Private transfer for departure"]] },
];

export const TOUR_FALLBACK: TourPackage = {
  key: "royal-route",
  title: "The Royal Route across Sri Lanka",
  eyebrow: "7 days · 6 nights",
  intro: "Ancient kingdoms, misty tea hills, wildlife parks and golden beaches in one private journey.",
  duration: "7 days / 6 nights",
  destinations: "Negombo · Sigiriya · Kandy · Ella · Yala · Galle",
  highlights: ["Private chauffeur and air-conditioned vehicle", "Daily breakfast and curated experiences", "3-star to 5-star hotel options"],
  heroImageUrl: "",
  gallery: [],
  itinerary: FALLBACK_ITINERARY,
  inclusions: ["Private air-conditioned vehicle", "English-speaking professional driver", "Hotel accommodation", "Daily breakfast", "Airport pickup and drop", "Entrance fees", "Yala jeep safari"],
  exclusions: ["Lunch and dinner", "Tips and personal expenses", "Beverages", "Travel insurance"],
  vehicles: [
    { name: "AC Sedan", capacity: "Ideal for 1–2 guests", features: "Comfortable · Compact · Air-conditioned" },
    { name: "AC Van", capacity: "Ideal for 4–6 guests", features: "Spacious · Flexible · Air-conditioned" },
  ],
};

async function readTourPackage() {
  "use cache";
  cacheTag("tour-package");
  cacheLife("hours");
  return prisma.tourPackage.findUnique({ where: { key: "royal-route" } });
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

export async function getTourPackage(): Promise<TourPackage> {
  try {
    const row = await readTourPackage();
    if (!row) return TOUR_FALLBACK;
    return {
      key: row.key,
      title: row.title,
      eyebrow: row.eyebrow,
      intro: row.intro,
      duration: row.duration,
      destinations: row.destinations,
      highlights: stringArray(row.highlights),
      heroImageUrl: row.heroImageUrl,
      gallery: stringArray(row.gallery),
      itinerary: Array.isArray(row.itinerary) ? row.itinerary as TourDay[] : TOUR_FALLBACK.itinerary,
      inclusions: stringArray(row.inclusions),
      exclusions: stringArray(row.exclusions),
      vehicles: Array.isArray(row.vehicles) ? row.vehicles as TourVehicle[] : TOUR_FALLBACK.vehicles,
    };
  } catch (error) {
    console.error("tour_load_failed", error);
    return TOUR_FALLBACK;
  }
}
