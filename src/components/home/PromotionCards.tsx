import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { optimizedImage } from "@/lib/format"; SELECT url('${card.image}')

export function PromotionCards({ settings }: { settings: SiteSettings }) {
  const cards = [
    { title: "Airport transfers", image: settings.promotionAirportImageUrl, href: "/services", eyebrow: "Arrive on time" },
    { title: "Wedding vehicles", image: settings.promotionWeddingImageUrl, href: "/weddings", eyebrow: "Celebrate in style" },
    { title: "Long-term rental", image: settings.promotionLongTermImageUrl, href: "/self-drive-rental", eyebrow: "Stay flexible" },
  ].filter((card) => card.image);

  if (cards.length === 0) return null;

  return (
    <section className="bg-charcoal py-20 md:py-28" aria-label="Rental promotions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Explore more</p>
            <h2 className="font-display text-4xl font-black text-cream md:text-5xl">Made for every journey</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative min-h-96 overflow-hidden border border-charcoal-700 bg-charcoal-800 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.05), rgba(8,8,8,0.82)), url('${optimizedImage(card.image, 1200)}')` }}
            >
              <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{card.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-black text-cream">{card.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
