"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [location, setLocation] = useState("Colombo, Sri Lanka");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentalType, setRentalType] = useState("BOTH");
  const [searchError, setSearchError] = useState("");
  const bookingMessage = [
    "Hello! I'd like to inquire about a vehicle rental.",
    location ? `Pickup location: ${location}` : "",
    startDate ? `Start date: ${startDate}` : "",
    endDate ? `End date: ${endDate}` : "",
    rentalType ? `Rental type: ${rentalType === "WITH_DRIVER" ? "With driver" : rentalType === "BOTH" ? "Both options" : "Self-drive"}` : "",
  ].filter(Boolean).join("\n");
  const wa = whatsappLink(settings.whatsappNumber, bookingMessage);

  function searchCars() {
    if (startDate) {
      const today = new Date();
      const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      if (startDate < localToday) {
        setSearchError("Choose a start date from today onwards.");
        return;
      }
    }
    if (startDate && endDate && endDate < startDate) {
      setSearchError("The end date must be on or after the start date.");
      return;
    }

    setSearchError("");
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (rentalType) params.set("rentalType", rentalType);
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <section aria-label="Hero" className="bg-charcoal">
      <div className="grid min-h-[680px] lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex items-center bg-[#ddeba1] px-6 py-20 text-charcoal sm:px-10 lg:px-16 lg:py-28">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em]">Mahawaththa · Sri Lanka</p>
            <h1 className="font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              Move
              <br />
              different.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/75 sm:text-lg">
              Premium cars, effortless pickup, and the freedom to explore Sri Lanka on your terms.
            </p>
            <Link
              href="/vehicles"
              className="mt-9 inline-flex items-center gap-3 bg-charcoal px-6 py-4 text-sm font-bold text-cream transition-transform hover:-translate-y-1"
            >
              Find your car
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </div>
        <div
          className="relative min-h-[460px] overflow-hidden bg-charcoal-700 bg-cover bg-center"
          style={{
            backgroundImage:
              `linear-gradient(135deg, rgba(8,8,8,0.08), rgba(8,8,8,0.38)), url('${settings.heroImageUrl || '/photos/hero/hero-car.jpg'}')`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(191,220,88,0.12),transparent_35%)]" />
          <div className="absolute bottom-8 left-6 border-l-2 border-gold bg-charcoal/75 px-4 py-3 backdrop-blur-md sm:bottom-10 sm:left-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Premium fleet</p>
            <p className="mt-1 text-sm font-semibold text-cream">Luxury · SUV · Sedan</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-10 max-w-6xl border border-charcoal-600 bg-charcoal-800 p-4 shadow-2xl sm:mx-auto sm:p-5 lg:-mt-14">
        <div className="grid gap-3 md:grid-cols-[1.25fr_1fr_1fr_1fr_auto] md:items-end">
          <label className="border border-charcoal-600 px-4 py-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Pick-up location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-semibold text-cream outline-none"
              placeholder="Colombo, Sri Lanka"
            />
          </label>
          <label className="border border-charcoal-600 px-4 py-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                if (endDate && event.target.value > endDate) setEndDate("");
              }}
              className="mt-1 w-full bg-transparent text-sm font-semibold text-cream outline-none"
            />
          </label>
          <label className="border border-charcoal-600 px-4 py-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">End date</span>
            <input
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-semibold text-cream outline-none"
            />
          </label>
          <label className="border border-charcoal-600 px-4 py-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Rental type</span>
            <select
              value={rentalType}
              onChange={(event) => setRentalType(event.target.value)}
              className="mt-1 w-full cursor-pointer bg-charcoal-800 text-sm font-semibold text-cream outline-none"
            >
              <option value="SELF_DRIVE">Self-drive</option>
              <option value="WITH_DRIVER">With driver</option>
              <option value="BOTH">Both options</option>
            </select>
          </label>
          <button
            type="button"
            onClick={searchCars}
            className="bg-gold px-6 py-3.5 text-center text-sm font-bold text-charcoal transition-colors hover:bg-gold-light"
          >
            Search cars
          </button>
        </div>
        {searchError && <p className="mt-3 text-xs font-semibold text-red-400">{searchError}</p>}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs font-semibold text-gold hover:text-gold-light"
          >
            Prefer a quick booking? Talk to us on WhatsApp -&gt;
          </a>
        )}
      </div>
    </section>
  );
}
