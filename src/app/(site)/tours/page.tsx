import type { Metadata } from "next";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/format";
import { getTourPackage } from "@/lib/tours";

export const metadata: Metadata = pageMeta({
  title: "7-Day Sri Lanka Tour",
  description:
    "A 7-day luxury Sri Lanka itinerary covering Negombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala, Mirissa and Galle.",
  path: "/tours",
});

export default async function ToursPage() {
  const settings = await getSettings();
  const tour = await getTourPackage();
  const wa = whatsappLink(
    settings.whatsappNumber,
    "Hello Mahawaththa Travels! I’d like to enquire about the 7-day Sri Lanka tour.",
  );

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <section className="relative flex min-h-[560px] items-end overflow-hidden bg-ink text-white sm:min-h-[620px]">
        <Image
          src={tour.heroImageUrl || "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=2000&q=88"}
          alt={tour.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <p className="eyebrow mb-5 text-white/80">{tour.eyebrow} · Private journey</p>
          <h1 className="max-w-[13ch] font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            {tour.title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            {tour.intro}
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-line px-5 sm:grid-cols-4 sm:px-8 lg:px-12">
          {[
            ["7", "Days"],
            ["6", "Nights"],
            ["9+", "Destinations"],
            ["1", "Private tour"],
          ].map(([value, label]) => (
            <div key={label} className="py-7 text-center sm:py-9">
              <p className="font-display text-3xl text-olive-ink sm:text-4xl">{value}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <div className="grid gap-8 border-b border-line pb-14 sm:pb-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:pb-20">
          <div>
            <p className="eyebrow mb-4">{tour.duration}</p>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">Journey highlights</h2>
            <p className="mt-5 text-sm leading-7 text-ink/70">{tour.destinations}</p>
            <ul className="mt-6 space-y-3">
              {tour.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm text-ink/75">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-olive" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {tour.gallery
              .filter((image): image is string => Boolean(image))
              .map((image, index) => (
                <div key={image} className="image-editorial relative aspect-[4/5]">
                  <Image
                    src={image}
                    alt={`${tour.title} gallery photo ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 24vw"
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <p className="eyebrow mb-4">Your complete itinerary</p>
          <h2 className="editorial-heading text-ink">From island coast to mountain sky.</h2>
        </div>

        <div className="space-y-14 sm:space-y-20">
          {tour.itinerary.map((item) => (
            <article key={item.day} className="border-t border-line pt-7 sm:pt-9">
              <div className="mb-8 grid gap-5 md:grid-cols-[0.28fr_1fr] md:items-end">
                <div className="text-5xl font-light text-beige sm:text-6xl">{item.day}</div>
                <div>
                  <p className="eyebrow mb-3">{item.route}</p>
                  <h3 className="font-display text-3xl text-ink sm:text-5xl">{item.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">{item.intro}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.15fr_1.15fr_0.7fr]">
                {item.images.map((image) => (
                  <div key={image.src} className="image-editorial relative aspect-[4/3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
                <aside className="bg-beige/25 p-6 sm:p-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-olive-ink">Overnight</p>
                  <p className="mt-2 font-display text-2xl text-ink">{item.stay}</p>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex border-b border-ink/30 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-olive-ink hover:text-olive-ink"
                    >
                      Enquire about this route ↗
                    </a>
                  )}
                </aside>
              </div>

              <section className="mt-8 bg-paper p-6 sm:p-8 lg:p-10">
                <p className="eyebrow mb-6">Itinerary highlights</p>
                <div className="grid gap-x-10 md:grid-cols-2">
                  {item.highlights.map(([title, description], index) => (
                    <div
                      key={title}
                      className={`flex gap-4 border-t border-line py-5 ${index >= item.highlights.length - 2 ? "md:border-b-0" : ""}`}
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-olive" />
                      <div>
                        <h4 className="font-display text-lg text-ink sm:text-xl">{title}</h4>
                        <p className="mt-1 text-sm leading-6 text-ink/70">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </div>
      </div>

      <section className="bg-paper py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-4">Travel in comfort</p>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">Choose your vehicle</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {tour.vehicles.map(({ name, capacity, features }, index) => (
              <article key={name} className="border border-line bg-ivory p-7 sm:p-8">
                <span className="text-[10px] tracking-[0.16em] text-bronze">0{index + 1}</span>
                <h3 className="mt-5 font-display text-2xl text-ink">{name}</h3>
                <p className="mt-2 text-sm font-semibold text-olive-ink">{capacity}</p>
                <p className="mt-4 text-sm leading-7 text-ink/70">{features}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige/20 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow mb-5">Package inclusions</p>
              <h2 className="mb-8 font-display text-4xl text-ink sm:text-5xl">Included in your journey</h2>
              <ul className="border-t border-line">
                {tour.inclusions.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-b border-line py-4 text-sm text-ink/75">
                    <span className="size-1.5 rounded-full bg-olive" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Not included</p>
              <h2 className="mb-8 font-display text-4xl text-ink sm:text-5xl">Optional extras</h2>
              <ul className="border-t border-line">
                {tour.exclusions.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-b border-line py-4 text-sm text-ink/75">
                    <span className="size-1.5 rounded-full border border-olive" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-ink/65">
                Hotels can be arranged from 3-star comfort to 5-star luxury. Any hotel, duration or route can be customised on request.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-olive-dark py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-end lg:px-12">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">Contact for the best price</p>
            <h2 className="max-w-[14ch] font-display text-4xl leading-tight sm:text-5xl">Let’s create your Sri Lanka journey.</h2>
          </div>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
            >
              Enquire on WhatsApp <span className="ml-3" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
