import Link from "next/link";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const wa = whatsappLink(settings.whatsappNumber, "Hello! I'd like to inquire about a vehicle rental.");

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
              "linear-gradient(135deg, rgba(8,8,8,0.08), rgba(8,8,8,0.38)), url('/photos/hero/hero-car.jpg')",
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
        <div className="grid gap-3 md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-end">
          <div className="border border-charcoal-600 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Pick-up location</p>
            <p className="mt-1 text-sm font-semibold text-cream">Colombo, Sri Lanka</p>
          </div>
          <div className="border border-charcoal-600 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Start date</p>
            <p className="mt-1 text-sm font-semibold text-cream">Choose a date</p>
          </div>
          <div className="border border-charcoal-600 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Rental type</p>
            <p className="mt-1 text-sm font-semibold text-cream">Self-drive</p>
          </div>
          <Link
            href="/vehicles"
            className="bg-gold px-6 py-3.5 text-center text-sm font-bold text-charcoal transition-colors hover:bg-gold-light"
          >
            Search cars
          </Link>
        </div>
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
