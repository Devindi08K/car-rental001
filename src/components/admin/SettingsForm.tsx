"use client";

import { useActionState } from "react";
import { saveSettings } from "@/server/settings-actions";
import type { SiteSettings } from "@/lib/settings";
import { PageImageManager } from "@/components/admin/PageImageManager";

type State = { ok: boolean; error?: string } | null;

const fields: { key: keyof SiteSettings; label: string; type?: string; placeholder?: string }[] = [
  { key: "phone", label: "Call number", placeholder: "070 646 5477" },
  { key: "whatsappNumber", label: "WhatsApp number", placeholder: "0770341970" },
  { key: "email", label: "Email address", type: "email" },
  { key: "address", label: "Address" },
  { key: "openingHours", label: "Opening hours" },
  { key: "facebookUrl", label: "Facebook URL", type: "url" },
  { key: "instagramUrl", label: "Instagram URL", type: "url" },
  { key: "tiktokUrl", label: "TikTok URL", type: "url" },
  { key: "mapEmbedUrl", label: "Google Maps embed URL", type: "url" },
];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<State, FormData>(saveSettings, null);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state?.error && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3">{state.error}</div>
      )}
      {state?.ok && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-400 text-sm rounded-lg px-4 py-3">Settings saved.</div>
      )}
      {fields.map((f) => (
        <div key={f.key}>
          <label htmlFor={`sf-${f.key}`} className="block text-xs text-muted mb-1.5">{f.label}</label>
          <input
            id={`sf-${f.key}`}
            name={f.key}
            type={f.type ?? "text"}
            defaultValue={settings[f.key]}
            placeholder={f.placeholder}
            className="w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm rounded-lg px-3 py-2.5 focus:border-gold focus:outline-none"
          />
        </div>
      ))}
      <section className="border-t border-charcoal-700 pt-8">
        <h2 className="mb-2 font-display text-xl font-bold text-cream">Page Images</h2>
        <p className="mb-5 text-sm text-muted">Vehicle photos are managed from each vehicle’s add/edit page. These images belong to the website sections.</p>
        <PageImageManager
          slots={[
            { key: "logoUrl", label: "Business logo", description: "Transparent PNG or WebP works best. The logo is shown in the navigation and footer.", value: settings.logoUrl, variant: "logo" },
            { key: "heroImageUrl", label: "Homepage hero", description: "Large spotlighted vehicle image. Recommended 2400 × 1600 px.", value: settings.heroImageUrl, fallback: "/photos/hero/hero-car.jpg" },
            { key: "airportImageUrl", label: "Airport transfer", description: "Airport or pickup promotion card. Recommended 1800 × 1100 px.", value: settings.airportImageUrl },
            { key: "chauffeurImageUrl", label: "Chauffeur service", description: "Professional chauffeur feature image. Recommended 1800 × 1100 px.", value: settings.chauffeurImageUrl },
            { key: "selfDriveImageUrl", label: "Self-drive", description: "Traveler and vehicle road image. Recommended 1800 × 1100 px.", value: settings.selfDriveImageUrl },
            { key: "islandTourImageUrl", label: "Island tours", description: "Scenic tour or long-distance travel image. Recommended 1800 × 1100 px.", value: settings.islandTourImageUrl },
            { key: "weddingHeroImageUrl", label: "Wedding page hero", description: "Large wedding vehicle feature image. Recommended 2200 × 1400 px.", value: settings.weddingHeroImageUrl },
            { key: "promotionAirportImageUrl", label: "Airport promotion card", description: "Large homepage airport promotion. Recommended 1800 × 1200 px.", value: settings.promotionAirportImageUrl },
            { key: "promotionWeddingImageUrl", label: "Wedding promotion card", description: "Large homepage wedding promotion. Recommended 1800 × 1200 px.", value: settings.promotionWeddingImageUrl },
            { key: "promotionLongTermImageUrl", label: "Long-term rental card", description: "Corporate or monthly rental feature. Recommended 1800 × 1200 px.", value: settings.promotionLongTermImageUrl },
          ]}
        />
      </section>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold text-charcoal font-semibold px-8 py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60 text-sm"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
