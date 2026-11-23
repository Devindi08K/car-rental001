"use client";

import { useState, useRef, useEffect } from "react";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

type TurnstileApi = {
  render: (
    el: HTMLElement,
    o: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void },
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

const getTurnstile = () =>
  (window as typeof window & { turnstile?: TurnstileApi }).turnstile;

interface Props {
  vehicleId?: string;
  vehicleName?: string;
}

export function EnquiryForm({ vehicleId, vehicleName }: Props) {
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    const mount = () => {
      const ts = getTurnstile();
      if (cancelled || !ts || !widgetRef.current || widgetId.current) return;
      widgetId.current = ts.render(widgetRef.current, {
        sitekey: siteKey,
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
      });
    };

    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      document.head.appendChild(script);
    }
    if (getTurnstile()) mount();
    else script.addEventListener("load", mount);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", mount);
      if (widgetId.current) {
        getTurnstile()?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
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
    } finally {
      setTurnstileToken("");
      if (widgetId.current) getTurnstile()?.reset(widgetId.current);
    }
  }

  const inp = "w-full border-b border-line bg-transparent px-1 py-3 text-sm text-ink placeholder:text-ink/60 transition-colors focus:border-olive focus:outline-none";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {vehicleName && (
        <div className="border-l-2 border-olive bg-ivory px-4 py-3 text-sm text-ink">
          Enquiry about: <strong>{vehicleName}</strong>
        </div>
      )}

      {/* Honeypot */}
      <input type="text" name="companyWebsite" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="eq-name" className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-ink/70">Full Name *</label>
          <input id="eq-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inp} />
        </div>
        <div>
          <label htmlFor="eq-phone" className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-ink/70">Phone Number *</label>
          <input id="eq-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+94 7X XXX XXXX" className={inp} />
        </div>
      </div>

      <div>
        <label htmlFor="eq-email" className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-ink/70">Email (optional)</label>
        <input id="eq-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inp} />
      </div>

      <div>
        <label htmlFor="eq-msg" className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-ink/70">Message *</label>
        <textarea
          id="eq-msg"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your rental needs — dates, duration, pickup location…"
          className={`${inp} resize-y`}
        />
      </div>

      {state.status === "success" && (
        <div role="status" className="border border-green-700/30 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div role="alert" className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      {siteKey && <div ref={widgetRef} />}

      <button
        type="submit"
        disabled={state.status === "loading" || Boolean(siteKey && !turnstileToken)}
        className="button-editorial w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
