import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { getSettings } from "@/lib/settings";
import { BUSINESS_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS_NAME} | Sri Lanka`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description:
    "Premium car rental and luxury vehicles in Sri Lanka. Self-drive, chauffeur service, airport transfers, and wedding vehicles. Book on WhatsApp.",
  metadataBase: new URL(siteUrl()),
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: BUSINESS_NAME,
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS_NAME,
  description: "Premium car rental and luxury vehicles in Sri Lanka",
  url: siteUrl(),
  image: `${siteUrl()}/og-image.jpg`,
  telephone: "+94XXXXXXXXX",
  address: {
    "@type": "PostalAddress",
    addressCountry: "LK",
    addressLocality: "Colombo",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "07:00",
    closes: "22:00",
  },
  priceRange: "LKR",
  currenciesAccepted: "LKR",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-charcoal text-cream antialiased">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <WhatsAppFab number={settings.whatsappNumber} />
      </body>
    </html>
  );
}
