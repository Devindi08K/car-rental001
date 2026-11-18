import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/format";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: `Services — ${BUSINESS_NAME}`,
  description:
    "Chauffeur service, airport transfers, outstation tours, corporate rentals and more — Mahawaththa Rent a Car serves all of Sri Lanka.",
  path: "/services",
});

const services = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Chauffeur Service",
    description: "Professional, courteous drivers available for half-day, full-day, or multi-day hire. Business and leisure travel across Sri Lanka.",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: "Airport Transfers",
    description: "Punctual pickups and drop-offs at Bandaranaike (CMB) and Mattala (HRI) airports. Available 24/7, all days including public holidays.",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Island-Wide Tours",
    description: "Sigiriya, Kandy, Ella, Mirissa — customise a multi-day itinerary or choose from our popular tour packages.",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Corporate Rentals",
    description: "Long-term contracts for businesses. Dedicated vehicles, monthly invoicing, and priority support.",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    title: "Self-Drive Rental",
    description: "Take the wheel yourself. Valid Sri Lankan or international driving licence required. Competitive daily rates.",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Wedding &amp; Events",
    description: "Luxury vehicles with professional flower decoration, ribbons, and punctual chauffeurs for your special day.",
  },
];

export default async function ServicesPage() {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsappNumber);

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Header */}
      <div className="bg-gold border-b border-gold-dark py-20 text-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-charcoal/70 text-sm font-bold tracking-widest uppercase mb-3">What We Offer</p>
          <h1 className="font-display text-4xl md:text-6xl font-black">Our Services</h1>
          <span className="block w-12 h-0.5 bg-charcoal mt-4" />
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="group bg-charcoal-800 border border-charcoal-700 p-8 transition-transform hover:-translate-y-1 hover:border-gold/50">
              <div className="text-gold mb-5">{s.icon}</div>
              <h2 className="font-display text-2xl font-semibold text-cream mb-3" dangerouslySetInnerHTML={{ __html: s.title }} />
              <p className="text-muted text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            { title: "Airport transfers", image: settings.airportImageUrl },
            { title: "Chauffeur service", image: settings.chauffeurImageUrl },
            { title: "Self-drive", image: settings.selfDriveImageUrl },
            { title: "Island tours", image: settings.islandTourImageUrl },
          ].filter((card) => card.image).map((card) => (
            <div
              key={card.title}
              className="relative min-h-72 overflow-hidden border border-charcoal-700 bg-charcoal-800 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(90deg, rgba(8,8,8,0.82), rgba(8,8,8,0.12)), url('${card.image}')` }}
            >
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Mahawaththa</p>
                <h2 className="mt-2 text-2xl font-black text-cream">{card.title}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gold p-10 text-charcoal">
          <h2 className="font-display text-3xl font-bold mb-3">Need a custom service?</h2>
          <p className="text-charcoal/70 mb-8 max-w-lg mx-auto">
            We tailor every booking to your requirements. Get in touch and we&rsquo;ll put together the perfect arrangement.
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal-700 text-cream font-semibold px-8 py-3.5 transition-colors text-sm"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
