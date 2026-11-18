"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";

const RENTAL_TABS = [
  { value: "SELF_DRIVE", label: "Self-drive" },
  { value: "WITH_DRIVER", label: "With driver" },
  { value: "BOTH", label: "Both options" },
] as const;

const fieldBox = "border border-charcoal-600 bg-charcoal px-4 py-3 transition-colors focus-within:border-gold";
const fieldLabel = "block text-[10px] font-bold uppercase tracking-[0.18em] text-muted";
const fieldInput = "mt-1 w-full bg-transparent text-sm font-semibold text-cream outline-none [color-scheme:dark]";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [location, setLocation] = useState("Colombo, Sri Lanka");
  const [rentalType, setRentalType] = useState<(typeof RENTAL_TABS)[number]["value"]>("BOTH");

  const rentalText = RENTAL_TABS.find((t) => t.value === rentalType)?.label ?? "";
  const bookingMessage = [
    "Hello! I'd like to inquire about a vehicle rental.",
    location ? `Pickup location: ${location}` : "",
    rentalText ? `Rental type: ${rentalText}` : "",
  ].filter(Boolean).join("\n");
  const wa = whatsappLink(settings.whatsappNumber, bookingMessage);

  function searchCars(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (rentalType) params.set("rentalType", rentalType);
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <section aria-label="Hero" className="bg-charcoal">
      {/* Photo + headline */}
      <div className="relative min-h-[620px] overflow-hidden bg-charcoal-700 lg:min-h-[700px]">
        <Image
          src={settings.heroImageUrl || "/photos/hero/hero-car.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-56 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-gold">
            Mahawaththa · Sri Lanka
          </p>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-[-0.05em] text-cream sm:text-7xl lg:text-8xl">
            Drive
            <br />
            <span className="text-gold">premium.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Luxury cars, easy pickup, and the freedom to explore Sri Lanka your way.
          </p>
        </div>
      </div>

      {/* Booking card */}
      <div className="relative z-10 mx-auto -mt-44 max-w-6xl px-4 pb-6 sm:px-6">
        <form
          onSubmit={searchCars}
          className="border-t-4 border-gold bg-charcoal-800 p-5 shadow-2xl shadow-black/60 sm:p-7"
        >
          <h2 className="font-display text-xl font-bold text-cream sm:text-2xl">Find your car</h2>

          {/* Rental type tabs */}
          <div className="mt-4 grid w-full grid-cols-3 gap-2 md:w-fit" role="group" aria-label="Rental type">
            {RENTAL_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={rentalType === tab.value}
                onClick={() => setRentalType(tab.value)}
                className={`whitespace-nowrap px-2 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors sm:px-4 sm:text-xs ${
                  rentalType === tab.value
                    ? "bg-gold text-charcoal"
                    : "border border-charcoal-600 text-cream hover:border-gold hover:text-gold"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-stretch">
            <label className={fieldBox}>
              <span className={fieldLabel}>Pick-up location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={fieldInput}
                placeholder="Colombo, Sri Lanka"
              />
            </label>
            <button
              type="submit"
              className="bg-gold px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-charcoal transition-colors hover:bg-gold-light"
            >
              Search cars
            </button>
          </div>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs font-semibold text-gold hover:text-gold-light"
            >
              Prefer a quick booking? Talk to us on WhatsApp →
            </a>
          )}
        </form>
      </div>
    </section>
  );
}
