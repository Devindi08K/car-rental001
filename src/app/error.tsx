"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl text-ink mb-4">Something went wrong</h1>
      <p className="text-ink/75 mb-8">Please try again. If it keeps happening, contact us on WhatsApp.</p>
      <button onClick={reset} className="button-editorial">Try again</button>
    </div>
  );
}