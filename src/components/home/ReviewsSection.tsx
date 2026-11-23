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
    "w-full border-b border-line bg-transparent px-1 py-3 text-sm text-ink placeholder:text-ink/60 focus:border-olive focus:outline-none";

  return (
    <section className="section-pad bg-paper" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12">
          <p className="eyebrow mb-4">Words from our guests</p>
          <h2 id="reviews-heading" className="editorial-heading text-ink">The best journeys stay with you.</h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="border-t border-line">
            {reviews.length ? (
              <ul className="divide-y divide-line">
                {reviews.map((item) => (
                  <li key={item.id} className="py-7 sm:py-9">
                    <p className="text-sm tracking-widest text-olive-ink" aria-label={`${item.rating} out of 5 stars`}>
                      {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                    </p>
                    <blockquote className="mt-4 max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
                      “{item.review}”
                    </blockquote>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink">{item.name}</p>
                      <time className="text-xs text-ink/70" dateTime={item.createdAt.toISOString()}>
                        {item.createdAt.toLocaleDateString("en-LK", { timeZone: "Asia/Colombo" })}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-7 text-sm text-ink/75">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
          </div>

          <div className="bg-ivory p-6 sm:p-9">
            <p className="eyebrow mb-3">Your story</p>
            <h3 className="font-display text-3xl text-ink">Share your experience</h3>
            <p className="mt-3 text-sm leading-6 text-ink/75">Tell other customers about your rental with us.</p>
            <form action={formAction} className="mt-6 space-y-5">
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="review-website">Leave this field empty</label>
                <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="review-name" className="mb-1.5 block text-xs text-ink/75">Your name</label>
                <input id="review-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="review-rating" className="mb-1.5 block text-xs text-ink/75">Rating</label>
                <select id="review-rating" name="rating" defaultValue="5" className={fieldClass}>
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Very good</option>
                  <option value="3">3 — Good</option>
                  <option value="2">2 — Fair</option>
                  <option value="1">1 — Poor</option>
                </select>
              </div>
              <div>
                <label htmlFor="review-text" className="mb-1.5 block text-xs text-ink/75">Your review</label>
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
                <p role="alert" className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {state.error}
                </p>
              )}
              {state?.ok && (
                <p role="status" className="border border-green-700/30 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thank you for sharing your review!
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="button-editorial w-full disabled:cursor-not-allowed disabled:opacity-60"
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
