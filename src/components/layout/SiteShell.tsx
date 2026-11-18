import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { getSettings } from "@/lib/settings";
import { BUSINESS_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/seo";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: BUSINESS_NAME,
    description: "Premium car rental and luxury vehicles in Sri Lanka",
    url: siteUrl(),
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "LK",
    },
    priceRange: "LKR",
    currenciesAccepted: "LKR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFab number={settings.whatsappNumber} />
    </>
  );
}
