import type { Metadata } from "next";
import "./globals.css";
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