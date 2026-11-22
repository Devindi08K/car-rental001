"use client";

import { useActionState } from "react";
import { submitReview, type ReviewActionState } from "@/server/review-actions";

type Review = {
  id: string;
  name: string;
  review: string;
  rating: number;
  createdAt: Date;
};

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [state, formAction, pending] = useActionState<ReviewActionState | null, FormData>(
    submitReview,
    null,
  );
  const fieldClass =
    "w-full border border-charcoal-600 bg-charcoal-700 px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none";

  return (
    <section className="bg-charcoal py-20 md:py-28" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">Customer stories</p>
          <h2 id="reviews-heading" className="font-display text-4xl font-bold text-cream md:text-5xl">
            Customer Reviews
          </h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-gold" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {reviews.length ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {reviews.map((item) => (
                  <li key={item.id} className="border border-charcoal-700 bg-charcoal-800 p-6">
                    <p className="text-sm tracking-widest text-gold" aria-label={`${item.rating} out of 5 stars`}>
                      {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                    </p>
                    <blockquote className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-cream">
                      “{item.review}”
                    </blockquote>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-charcoal-700 pt-4">
                      <p className="font-semibold text-cream">{item.name}</p>
                      <time className="text-xs text-muted" dateTime={item.createdAt.toISOString()}>
                        {item.createdAt.toLocaleDateString("en-LK")}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border border-charcoal-700 bg-charcoal-800 p-6 text-sm text-muted">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
          </div>

          <div className="border border-charcoal-700 bg-charcoal-800 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-cream">Share your experience</h3>
            <p className="mt-2 text-sm text-muted">Tell other customers about your rental with us.</p>
            <form action={formAction} className="mt-6 space-y-5">
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="review-website">Leave this field empty</label>
                <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="review-name" className="mb-1.5 block text-xs text-muted">Your name</label>
                <input id="review-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="review-rating" className="mb-1.5 block text-xs text-muted">Rating</label>
                <select id="review-rating" name="rating" defaultValue="5" className={fieldClass}>
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Very good</option>
                  <option value="3">3 — Good</option>
                  <option value="2">2 — Fair</option>
                  <option value="1">1 — Poor</option>
                </select>
              </div>
              <div>
                <label htmlFor="review-text" className="mb-1.5 block text-xs text-muted">Your review</label>
                <textarea
                  id="review-text"
                  name="review"
                  required
                  minLength={10}
                  maxLength={1200}
                  rows={5}
                  className={`${fieldClass} resize-y`}
                />
              </div>
              {state?.error && (
                <p role="alert" className="border border-red-700/50 bg-red-900/40 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </p>
              )}
              {state?.ok && (
                <p role="status" className="border border-green-700/50 bg-green-900/40 px-4 py-3 text-sm text-green-300">
                  Thank you for sharing your review!
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-charcoal transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Submitting…" : "Submit review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
