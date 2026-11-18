"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-black text-cream mb-4">Something went wrong</h1>
      <p className="text-muted mb-8">Please try again. If it keeps happening, contact us on WhatsApp.</p>
      <button onClick={reset} className="bg-gold text-charcoal font-bold px-6 py-3 text-sm hover:bg-gold-light transition-colors">
        Try again
      </button>
    </div>
  );
}