"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { SiteSettings } from "@/lib/settings";
import type { TourPackage } from "@/lib/tours";
import { whatsappLink } from "@/lib/format";

const revealVariants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)" },
};

const imageScaleVariants = {
  hidden: { scale: 1.2 },
  visible: { scale: 1 },
};

export function FeaturedTour({ settings, tour }: { settings: SiteSettings; tour: TourPackage }) {
  const wa = whatsappLink(
    settings.whatsappNumber,
    "Hello Mahawaththa Travels! I’d like to enquire about the 7-day Sri Lanka tour.",
  );
  const photos = [
    ...tour.gallery,
  ].filter(Boolean);
  const mainImage =
    tour.heroImageUrl ||
    "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1800&q=88";
  const routeRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: routeRef,
    offset: ["start end", "end start"],
  });
  const routeX = useSpring(
    useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -24, reduceMotion ? 0 : 24]),
    { stiffness: 100, damping: 20 },
  );

  return (
    <section className="bg-paper py-10 sm:py-14 lg:py-16" aria-labelledby="featured-tour-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden border border-line lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            className="relative min-h-[320px] bg-ink sm:min-h-[430px] lg:min-h-[520px]"
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="image-editorial absolute inset-0"
              variants={reduceMotion ? undefined : revealVariants}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="absolute inset-0"
                variants={reduceMotion ? undefined : imageScaleVariants}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={mainImage}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
            <span className="absolute left-5 top-5 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink sm:left-7 sm:top-7">
              {tour.duration}
            </span>
          </motion.div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
            <div>
              <p className="eyebrow mb-4">{tour.eyebrow}</p>
              <h2 id="featured-tour-heading" className="max-w-[14ch] font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
                {tour.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink/70">{tour.intro}</p>
              <motion.p
                ref={routeRef}
                style={{ x: routeX }}
                className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-olive-ink"
              >
                {tour.destinations}
              </motion.p>
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
              <Link href="/tours" className="button-editorial group flex-1">
                View full itinerary <span aria-hidden="true" className="arrow-nudge">↗</span>
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
