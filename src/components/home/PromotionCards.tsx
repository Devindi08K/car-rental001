import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { optimizedImage } from "@/lib/format";

export function PromotionCards({ settings }: { settings: SiteSettings }) {
  const cards = [
    { title: "Airport transfers", image: settings.promotionAirportImageUrl, href: "/services", eyebrow: "Arrive on time" },
    { title: "Wedding vehicles", image: settings.promotionWeddingImageUrl, href: "/weddings", eyebrow: "Celebrate in style" },
    { title: "Long-term rental", image: settings.promotionLongTermImageUrl, href: "/self-drive-rental", eyebrow: "Stay flexible" },
  ].filter((card) => card.image);

  if (cards.length === 0) return null;

  return (
    <section className="section-pad bg-ivory" aria-label="Rental promotions">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">A little inspiration</p>
            <h2 className="editorial-heading text-ink">Made for every journey.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden bg-ink bg-cover bg-center p-6 text-white sm:min-h-[440px] sm:p-8"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(36,39,36,0.02), rgba(36,39,36,0.76)), url('${optimizedImage(card.image, 1200)}')` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">{card.eyebrow}</p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl">{card.title}</h3>
              <span className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform group-hover:translate-x-1">
                Discover <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
