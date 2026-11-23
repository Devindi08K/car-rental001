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
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ivory/95 backdrop-blur-md">
      <nav aria-label="Main navigation">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex min-h-[76px] items-center justify-between gap-6">
            <Link href="/" aria-label={BUSINESS_NAME} className="flex min-w-0 items-center gap-3 text-ink">
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
                  <span className="flex size-10 shrink-0 items-center justify-center border border-olive/40 font-display text-lg text-olive-ink">
                    RR
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate font-display text-lg tracking-tight sm:text-xl">{BUSINESS_NAME}</span>
                    <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-ink/70">Private journeys · Sri Lanka</span>
                  </span>
                </>
              )}
            </Link>
            <ul className="hidden items-center gap-7 xl:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative py-2 text-[11px] uppercase tracking-[0.12em] transition-colors hover:text-olive-ink ${
                      pathname === link.href ? "text-olive-ink" : "text-ink/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden items-center gap-5 sm:flex">
              <a href={telHref(settings.phone)} className="text-xs text-ink/70 transition-colors hover:text-olive-ink">
                {settings.phone}
              </a>
              <Link href="/vehicles" className="button-editorial min-h-11 px-5">
                Explore the fleet
              </Link>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center text-ink transition-colors hover:text-olive-ink xl:hidden"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div id="mobile-menu" className="border-t border-line bg-ivory xl:hidden">
            <ul className="mx-auto max-w-[1440px] space-y-1 px-5 py-4 sm:px-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-sm transition-colors hover:text-olive-ink ${
                      pathname === link.href ? "text-olive-ink" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="flex gap-5 border-t border-line pt-4 text-xs text-ink/70">
                <a href={telHref(settings.phone)}>Call {settings.phone}</a>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
