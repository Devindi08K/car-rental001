"use client";

import { useActionState } from "react";
import { saveSettings } from "@/server/settings-actions";
import type { SiteSettings } from "@/lib/settings";

type State = { ok: boolean; error?: string } | null;

const fields: { key: keyof SiteSettings; label: string; type?: string; placeholder?: string }[] = [
  { key: "phone", label: "Phone number", placeholder: "+94 7X XXX XXXX" },
  { key: "whatsappNumber", label: "WhatsApp number (digits only)", placeholder: "94712345678" },
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
