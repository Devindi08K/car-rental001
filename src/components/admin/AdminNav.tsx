"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/server/auth-actions";
import { BUSINESS_NAME } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/tours", label: "Tours" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/content", label: "Page Content" },
  { href: "/admin/settings", label: "Settings" },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onClick}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-gold text-charcoal" : "text-cream hover:bg-charcoal-700"
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden bg-gold border-b border-gold-dark flex items-center justify-between px-4 py-3 text-charcoal">
        <span className="font-display font-bold">Admin Panel</span>
        <button onClick={() => setOpen((o) => !o)} className="text-charcoal p-1" aria-label="Toggle menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-charcoal-800 border-b border-charcoal-700 px-4 py-4">
          <NavLinks onClick={() => setOpen(false)} />
          <div className="mt-4 pt-4 border-t border-charcoal-700">
            <form action={logoutAction}>
              <button type="submit" className="w-full text-left px-4 py-2.5 text-sm text-muted hover:text-red-400 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-charcoal-800 border-r border-charcoal-700 min-h-screen px-3 py-6">
        <Link href="/admin" className="mb-8 px-4">
          <span className="font-display text-cream font-black uppercase tracking-tight text-lg block">{BUSINESS_NAME}</span>
          <span className="text-xs text-muted">Admin Panel</span>
        </Link>
        <nav className="flex-1">
          <NavLinks />
        </nav>
        <div className="mt-6 pt-6 border-t border-charcoal-700">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left px-4 py-2.5 text-sm text-muted hover:text-red-400 transition-colors rounded-lg">
              Sign out
            </button>
          </form>
          <Link href="/" className="block px-4 py-2 text-xs text-muted hover:text-gold transition-colors mt-1">
            ← View site
          </Link>
        </div>
      </aside>
    </>
  );
}
