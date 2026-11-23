import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { whatsappLink, optimizedImage } from "@/lib/format";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Our Services",
  description:
    `Chauffeur service, airport transfers, outstation tours, corporate rentals and more — ${BUSINESS_NAME} serves all of Sri Lanka.`,
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
    description: "Punctual pickups and drop-offs at Bandaranaike Airport (CMB). Book ahead on WhatsApp.",
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
    title: "Wedding & Events",
    description: "Luxury vehicles with professional flower decoration, ribbons, and punctual chauffeurs for your special day.",
  },
];

export default async function ServicesPage() {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsappNumber);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-beige/30 py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="eyebrow mb-4">Services</p>
          <h1 className="editorial-heading text-ink">Our services</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink/75">
            Chauffeur, airport transfers, tours, corporate rentals, self-drive and wedding cars.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid border-t border-line md:grid-cols-2 md:gap-x-16">
          {services.map((service, index) => (
            <article key={service.title} className="border-b border-line py-7 sm:py-9">
              <div className="flex items-start gap-5">
                <span className="pt-1 text-[10px] tracking-[0.12em] text-bronze">0{index + 1}</span>
                <div>
                  <div className="mb-4 text-olive-ink">{service.icon}</div>
                  <h2 className="font-display text-2xl text-ink sm:text-3xl">{service.title}</h2>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-ink/75">{service.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { title: "Airport transfers", image: settings.airportImageUrl },
            { title: "Chauffeur service", image: settings.chauffeurImageUrl },
            { title: "Self-drive", image: settings.selfDriveImageUrl },
            { title: "Island tours", image: settings.islandTourImageUrl },
          ].filter((card) => card.image).map((card) => (
            <div
              key={card.title}
              className="group relative min-h-72 overflow-hidden bg-ink bg-cover bg-center sm:min-h-96"
              style={{ backgroundImage: `linear-gradient(90deg, rgba(36,39,36,0.76), rgba(36,39,36,0.08)), url('${optimizedImage(card.image, 1400)}')` }}
            >
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">{BUSINESS_NAME}</p>
                <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">{card.title}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-olive-dark p-8 text-white sm:p-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Your journey, your way</p>
          <h2 className="font-display text-3xl sm:text-4xl">Need something tailored?</h2>
          <p className="mb-8 mt-3 max-w-lg text-sm leading-7 text-white/75">
            We tailor every booking to your requirements. Get in touch and we&rsquo;ll put together the perfect arrangement.
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center gap-2 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
