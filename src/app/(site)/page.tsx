import type { Metadata } from "next";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { getGallery } from "@/lib/gallery";
import { pageMeta } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WeddingHighlight } from "@/components/home/WeddingHighlight";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { ContactStrip } from "@/components/home/ContactStrip";
import { PromotionCards } from "@/components/home/PromotionCards";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { getReviews } from "@/lib/reviews";
import { FeaturedTour } from "@/components/home/FeaturedTour";
import { getTourPackage } from "@/lib/tours";

export const metadata: Metadata = pageMeta({
  title: "Premium Vehicle Rentals Sri Lanka",
  description:
    "Sri Lanka's premier vehicle rental service. Cars, vans, luxury vehicles, self-drive, chauffeur service, airport transfers, and wedding vehicles. Book on WhatsApp.",
  path: "/",
});

export default async function HomePage() {
  const [settings, featured, weddingGallery, reviews, tour] = await Promise.all([
    getSettings(),
    getFeaturedVehicles(),
    getGallery("WEDDING"),
    getReviews(),
    getTourPackage(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <FeaturedTour settings={settings} tour={tour} />
      <FeaturedVehicles vehicles={featured} whatsappNumber={settings.whatsappNumber} />
      <ServicesSection />
      <WeddingHighlight images={weddingGallery.slice(0, 3)} settings={settings} />
      <PromotionCards settings={settings} />
      <WhyUsSection />
      <ReviewsSection reviews={reviews} />
      <ContactStrip settings={settings} />
    </>
  );
}
