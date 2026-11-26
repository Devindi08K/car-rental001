"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";
import type { GalleryImage } from "@prisma/client";

interface Props {
  images: GalleryImage[];
  settings: SiteSettings;
}

const features = [
  "Luxury vehicles with professional decoration",
  "Experienced and punctual chauffeurs",
  "Flexible pickup & return arrangements",
  "Competitive rates for full-day hire",
];

const revealVariants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)" },
};

const imageScaleVariants = {
  hidden: { scale: 1.2 },
  visible: { scale: 1 },
};

export function WeddingHighlight({ images, settings }: Props) {
  const wa = whatsappLink(settings.whatsappNumber, "Hello! I'd like to enquire about wedding vehicle hire.");
  const reduceMotion = useReducedMotion();
  return (
    <section className="section-pad bg-ivory" aria-labelledby="wedding-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow mb-4">Special occasions</p>
            <h2 id="wedding-heading" className="editorial-heading text-ink">
              The day deserves something special.
            </h2>
            <p className="mb-6 mt-6 max-w-lg text-base leading-7 text-ink/75">
              Arrive in timeless elegance. Our wedding fleet is handpicked to complement your most memorable
              day, complete with professional decoration and a courteous chauffeur.
            </p>
            <ul className="mb-8 space-y-3">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/70">
                  <span className="mt-2 h-px w-4 shrink-0 bg-olive" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/weddings" className="button-editorial group">
                View wedding gallery <span aria-hidden="true" className="arrow-nudge">↗</span>
              </Link>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:text-olive-ink"
                >
                  Enquire now
                </a>
              )}
            </div>
          </div>
          <div className="order-1 grid grid-cols-2 gap-3 lg:order-2">
            {images.length > 0
              ? images.slice(0, 4).map((img, i) => (
                  <motion.div
                    key={img.id}
                    className={`relative ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`}
                    initial={reduceMotion ? false : "hidden"}
                    whileInView={reduceMotion ? undefined : "visible"}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <motion.div
                      className="image-editorial absolute inset-0"
                      variants={reduceMotion ? undefined : revealVariants}
                      transition={{
                        duration: 0.9,
                        delay: reduceMotion ? 0 : i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        variants={reduceMotion ? undefined : imageScaleVariants}
                        transition={{
                          duration: 0.9,
                          delay: reduceMotion ? 0 : i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || "Wedding vehicle"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))
              : [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center bg-beige/30 ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`}
                  >
                    <svg className="h-10 w-10 text-ink/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
