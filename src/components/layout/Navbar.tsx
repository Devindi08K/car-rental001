"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, BUSINESS_NAME } from "@/lib/constants";
import { telHref, whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wa = whatsappLink(settings.whatsappNumber);

  return (
    <header className="sticky top-0 z-50">
      {/* Top strip */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal sm:text-[11px] sm:tracking-[0.18em]">
        <a href={telHref(settings.phone)} className="transition-colors hover:text-charcoal-700">
          Call {settings.phone}
        </a>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-charcoal-700">
            WhatsApp {settings.whatsappNumber}
          </a>
        )}
      </div>
      {/* Main nav */}
      <nav className="bg-charcoal/95 backdrop-blur-sm border-b border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" aria-label={BUSINESS_NAME} className="flex min-w-0 items-center gap-3">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt={BUSINESS_NAME}
                  width={180}
                  height={56}
                  className="h-11 w-36 object-contain object-left"
                  priority
                />
              ) : (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center border border-gold/60 font-display text-lg font-bold text-gold">
                    RR
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate font-display text-base font-black uppercase tracking-tight text-cream sm:text-xl">{BUSINESS_NAME}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Vehicle Rentals</span>
                  </span>
                </>
              )}
            </Link>
            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-gold ${
                      pathname === link.href ? "text-gold" : "text-cream"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Mobile hamburger */}
            <Link href="/vehicles" className="hidden sm:inline-flex bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-charcoal hover:bg-gold-light transition-colors">
              Book a vehicle
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="lg:hidden p-2 text-cream hover:text-gold transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-charcoal-700 bg-charcoal-800">
            <ul className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2.5 px-3 rounded text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:bg-charcoal-700 hover:text-gold ${
                      pathname === link.href ? "text-gold" : "text-cream"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
