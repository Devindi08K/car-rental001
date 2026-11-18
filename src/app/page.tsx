import type { Metadata } from "next";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { getGallery } from "@/lib/gallery";
import { pageMeta } from "@/lib/seo";
import { BUSINESS_NAME } from "@/lib/constants";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WeddingHighlight } from "@/components/home/WeddingHighlight";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { ContactStrip } from "@/components/home/ContactStrip";

export const metadata: Metadata = pageMeta({
  title: `${BUSINESS_NAME} | Premium Car Rental Sri Lanka`,
  description:
    "Sri Lanka's premier car rental service. Luxury vehicles, self-drive, chauffeur service, airport transfers, and wedding cars. Book on WhatsApp.",
  path: "/",
});

export default async function HomePage() {
  const [settings, featured, weddingGallery] = await Promise.all([
    getSettings(),
    getFeaturedVehicles(),
    getGallery("WEDDING"),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <FeaturedVehicles vehicles={featured} whatsappNumber={settings.whatsappNumber} />
      <ServicesSection />
      <WeddingHighlight images={weddingGallery.slice(0, 4)} settings={settings} />
      <WhyUsSection />
      <ContactStrip settings={settings} />
    </>
  );
}
