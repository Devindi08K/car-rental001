"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";
import { BUSINESS_NAME } from "@/lib/constants";

const RENTAL_TABS = [
  { value: "SELF_DRIVE", label: "Self-drive" },
  { value: "WITH_DRIVER", label: "With driver" },
  { value: "BOTH", label: "Both options" },
] as const;

const fieldBox = "border-b border-line px-1 py-3 transition-colors focus-within:border-olive";
const fieldLabel = "block text-[10px] font-bold uppercase tracking-[0.16em] text-ink/70";
const fieldInput = "mt-1 w-full bg-transparent text-sm font-medium text-ink outline-none";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState("Colombo, Sri Lanka");
  const [rentalType, setRentalType] = useState<(typeof RENTAL_TABS)[number]["value"]>("BOTH");
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 100]),
    { stiffness: 100, damping: 20 },
  );
  const heroScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.15]),
    { stiffness: 100, damping: 20 },
  );

  const rentalText = RENTAL_TABS.find((t) => t.value === rentalType)?.label ?? "";
  const bookingMessage = [
    "Hello! I'd like to inquire about a vehicle rental.",
    location ? `Pickup location: ${location}` : "",
    rentalText ? `Rental type: ${rentalText}` : "",
  ].filter(Boolean).join("\n");
  const wa = whatsappLink(settings.whatsappNumber, bookingMessage);

  function searchVehicles(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (rentalType) params.set("rentalType", rentalType);
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <section aria-label="Hero" className="bg-ivory pb-10 sm:pb-16">
      <div ref={heroRef} className="relative min-h-[560px] overflow-hidden bg-ink sm:min-h-[640px] lg:min-h-[700px]">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src={settings.heroImageUrl || "/photos/hero/hero-car.jpg"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] lg:translate-x-[7%] lg:scale-110 lg:object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-r from-ink/75 via-ink/35 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-ink/10" />

        <div className="relative mx-auto flex min-h-[560px] max-w-[1440px] flex-col justify-end px-5 pb-28 pt-24 sm:min-h-[640px] sm:px-8 sm:pb-32 lg:min-h-[700px] lg:px-12 lg:pb-36">
          <div className="editorial-enter max-w-3xl text-white">
            <p className="eyebrow mb-6 text-white/80">{BUSINESS_NAME} <span className="px-2 text-bronze">/</span> Vehicle rental in Sri Lanka</p>
            <h1
              aria-label="Explore Sri Lanka, your way."
              className="max-w-[12ch] font-display text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]"
            >
              {["Explore", "Sri Lanka,", "your way."].map((line, index) => (
                <span key={line} className="block overflow-hidden" aria-hidden="true">
                  <motion.span
                    className="block"
                    initial={reduceMotion ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.9,
                      delay: reduceMotion ? 0 : index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <div className="mt-7 max-w-md">
              <p className="text-sm leading-7 text-white/80 sm:text-base">
                Choose self-drive or travel with a professional chauffeur. Search our fleet for the right vehicle for your Sri Lanka journey.
              </p>
              <Link href="#vehicle-search" className="group mt-5 inline-flex items-center gap-3 border-b border-white/45 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:text-white">
                    Find your vehicle <span aria-hidden="true" className="arrow-nudge">↗</span>
              </Link>
            </div>
          </div>
          <p className="absolute bottom-7 right-5 hidden text-[10px] uppercase tracking-[0.22em] text-white/65 sm:block lg:right-12">
            Made for the journey
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-14 max-w-[1320px] px-5 sm:-mt-16 sm:px-8 lg:px-12">
        <form
          id="vehicle-search"
          onSubmit={searchVehicles}
          className="editorial-enter scroll-mt-24 grid gap-6 bg-paper p-6 shadow-[0_24px_70px_rgba(36,39,36,0.12)] sm:p-8 lg:grid-cols-[1fr_1.2fr_auto] lg:items-end lg:gap-10 lg:p-10"
        >
          <div>
            <p className="eyebrow">Plan your journey</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Find your vehicle</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-[0.8fr_1.2fr] sm:items-end">
            <label>
              <span className={fieldLabel}>Rental style</span>
              <select
                value={rentalType}
                onChange={(event) => {
                  const selected = RENTAL_TABS.find((tab) => tab.value === event.target.value);
                  if (selected) setRentalType(selected.value);
                }}
                className={`${fieldInput} mt-2 cursor-pointer`}
              >
                {RENTAL_TABS.map((tab) => <option key={tab.value} value={tab.value}>{tab.label}</option>)}
              </select>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Pick-up location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={fieldInput}
                placeholder="Colombo, Sri Lanka"
              />
            </label>
          </div>
          <div className="flex flex-col gap-3">
            <button type="submit" className="button-editorial group w-full lg:min-w-48">
              Search the fleet <span aria-hidden="true" className="arrow-nudge">↗</span>
            </button>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="text-center text-[10px] text-ink/70 transition-colors hover:text-olive-ink">
                Or message us on WhatsApp
              </a>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
