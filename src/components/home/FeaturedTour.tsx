import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import type { TourPackage } from "@/lib/tours";
import { whatsappLink } from "@/lib/format";

export function FeaturedTour({ settings, tour }: { settings: SiteSettings; tour: TourPackage }) {
  const wa = whatsappLink(
    settings.whatsappNumber,
    "Hello Royal Route Lanka! I’d like to enquire about the 7-day Sri Lanka tour.",
  );
  const photos = [
    ...tour.gallery,
  ].filter(Boolean);
  const mainImage =
    tour.heroImageUrl ||
    "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1800&q=88";

  return (
    <section className="bg-paper py-10 sm:py-14 lg:py-16" aria-labelledby="featured-tour-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden border border-line lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-ink sm:min-h-[430px] lg:min-h-[520px]">
            <Image
              src={mainImage}
              alt={tour.title}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink sm:left-7 sm:top-7">
              {tour.duration}
            </span>
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
            <div>
              <p className="eyebrow mb-4">{tour.eyebrow}</p>
              <h2 id="featured-tour-heading" className="max-w-[14ch] font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
                {tour.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink/70">{tour.intro}</p>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-olive-ink">
                {tour.destinations}
              </p>
              <ul className="mt-7 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
                {tour.highlights
                  .filter(Boolean)
                  .map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-6 text-ink/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-olive" />
                      {highlight}
                    </li>
                  ))}
              </ul>
            </div>

            {photos.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-2">
                {photos.slice(0, 3).map((photo, index) => (
                  <div key={photo} className="relative aspect-[4/3] overflow-hidden bg-beige">
                    <Image
                      src={photo}
                      alt={`${tour.title} preview ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 28vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tours" className="button-editorial flex-1">
                View full itinerary <span aria-hidden="true">↗</span>
              </Link>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 flex-1 items-center justify-center border border-ink px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
                >
                  Enquire on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
