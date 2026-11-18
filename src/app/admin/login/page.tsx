"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/auth-actions";

type State = { error?: string };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(loginAction, {});

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold text-gold block">Mahawaththa</span>
          <span className="text-xs text-muted tracking-widest uppercase">Admin Panel</span>
        </div>
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3">
              {state.error}
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-xs text-muted mb-1.5">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm rounded-lg px-4 py-3 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-xs text-muted mb-1.5">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm rounded-lg px-4 py-3 focus:border-gold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gold text-charcoal font-semibold py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
