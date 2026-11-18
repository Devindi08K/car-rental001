export const BUSINESS_NAME = "Mahawaththa Rent a Car & Luxury Vehicles";

export const MAX_VEHICLE_PHOTOS = 5;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Our Vehicles" },
  { href: "/self-drive-rental", label: "Self-Drive Rental" },
  { href: "/services", label: "Our Services" },
  { href: "/weddings", label: "Wedding & Events" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const DEFAULT_SETTINGS = {
  phone: "+94 XX XXX XXXX",
  whatsappNumber: "94XXXXXXXXX",
  email: "enquiries@example.com",
  address: "Colombo, Sri Lanka",
  openingHours: "Open daily, 7:00 AM – 10:00 PM",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Colombo%20Sri%20Lanka&z=12&output=embed",
  heroImageUrl: "/photos/hero/hero-car.jpg",
  airportImageUrl: "",
  chauffeurImageUrl: "",
  selfDriveImageUrl: "",
  islandTourImageUrl: "",
  weddingHeroImageUrl: "",
  promotionAirportImageUrl: "",
  promotionWeddingImageUrl: "",
  promotionLongTermImageUrl: "",
} as const;

export type SettingKey = keyof typeof DEFAULT_SETTINGS;

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingKey[];
