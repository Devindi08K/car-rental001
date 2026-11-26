"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BUSINESS_NAME } from "@/lib/constants";

const reasons = [
  {
    num: "01",
    title: "Serviced Vehicles",
    desc: "Economy cars to luxury vehicles, regularly serviced.",
  },
  {
    num: "02",
    title: "Transparent Pricing",
    desc: "Clear daily rates in LKR. Fuel, deposit and distance allowance are confirmed before you book.",
  },
  {
    num: "03",
    title: "WhatsApp Support",
    desc: "Call or message us during opening hours. We reply to every enquiry as soon as we can.",
  },
  {
    num: "04",
    title: "Island-Wide Service",
    desc: "Airport pickups, Colombo city drives, upcountry tours — we cover all of Sri Lanka.",
  },
];

export function WhyUsSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="section-pad bg-beige/30" aria-labelledby="why-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_0.65fr] md:items-end">
          <div>
            <p className="eyebrow mb-4">Why choose us</p>
            <h2 id="why-heading" className="editorial-heading text-ink">
              Why rent with {BUSINESS_NAME}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink/75">
            Clear prices, serviced vehicles and quick replies on WhatsApp.
          </p>
        </div>
        <div className="relative grid border-t border-transparent sm:grid-cols-2 lg:grid-cols-4">
          <motion.span
            className="absolute inset-x-0 top-0 h-px origin-left bg-ink/15"
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
          />
          {reasons.map((reason, index) => (
            <motion.article
              key={reason.title}
              className="border-b border-ink/15 py-6 sm:px-5 sm:py-8 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: reduceMotion ? 0 : 0.7 + index * 0.12,
              }}
            >
              <p className="mb-9 text-xs tracking-[0.14em] text-bronze">{reason.num}</p>
              <h3 className="font-display text-2xl text-ink">{reason.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">{reason.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
