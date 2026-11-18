"use client";

import { useState, useRef, useEffect } from "react";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

interface Props {
  vehicleId?: string;
  vehicleName?: string;
}

export function EnquiryForm({ vehicleId, vehicleName }: Props) {
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || document.querySelector('script[data-turnstile="true"]')) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    script.onload = () => {
      const turnstile = (window as typeof window & { turnstile?: { render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void } }).turnstile;
      const element = document.querySelector<HTMLElement>("[data-turnstile-widget]");
      if (turnstile && element) {
        turnstile.render(element, { sitekey: siteKey, callback: setTurnstileToken });
      }
    };
    document.head.appendChild(script);
  }, [siteKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "loading", message: "" });
    const data = new FormData(e.currentTarget);
    const body = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email") || "",
      message: data.get("message"),
      vehicleId: vehicleId,
      companyWebsite: data.get("companyWebsite"), // honeypot
      turnstileToken,
    };
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (res.ok) {
        setState({ status: "success", message: "Thank you! We'll be in touch shortly." });
        formRef.current?.reset();
      } else {
        setState({ status: "error", message: json.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection." });
    }
  }

  const inp = "w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm px-4 py-3 placeholder:text-muted focus:border-gold focus:outline-none transition-colors";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {vehicleName && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-sm text-gold">
          Enquiry about: <strong>{vehicleName}</strong>
        </div>
      )}

      {/* Honeypot */}
      <input type="text" name="companyWebsite" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="eq-name" className="block text-xs text-muted mb-1.5">Full Name *</label>
          <input id="eq-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inp} />
        </div>
        <div>
          <label htmlFor="eq-phone" className="block text-xs text-muted mb-1.5">Phone Number *</label>
          <input id="eq-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+94 7X XXX XXXX" className={inp} />
        </div>
      </div>

      <div>
        <label htmlFor="eq-email" className="block text-xs text-muted mb-1.5">Email (optional)</label>
        <input id="eq-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inp} />
      </div>

      <div>
        <label htmlFor="eq-msg" className="block text-xs text-muted mb-1.5">Message *</label>
        <textarea
          id="eq-msg"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your rental needs — dates, duration, pickup location…"
          className={`${inp} resize-none`}
        />
      </div>

      {state.status === "success" && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-400 text-sm rounded-lg px-4 py-3">
          {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3">
          {state.message}
        </div>
      )}

      {siteKey && <div data-turnstile-widget />}

      <button
        type="submit"
        disabled={state.status === "loading" || Boolean(siteKey && !turnstileToken)}
        className="w-full bg-gold text-charcoal font-bold py-3.5 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-[0.12em]"
      >
        {state.status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
