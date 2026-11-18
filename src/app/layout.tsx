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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-charcoal text-cream antialiased">
        {children}
      </body>
    </html>
  );
}