import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { deleteReview } from "@/server/review-actions";
import { DeleteEnquiryButton } from "@/components/admin/DeleteEnquiryButton";

export const instant = false;

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await prisma.customerReview.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-3 font-display text-3xl font-bold text-cream">Customer Reviews</h1>
      <p className="mb-8 text-sm text-muted">Remove reviews that are inappropriate or unrelated to the service.</p>
      {reviews.length === 0 ? (
        <p className="py-16 text-center text-muted">No customer reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-5 border border-charcoal-700 bg-charcoal-800 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h2 className="font-semibold text-cream">{review.name}</h2>
                  <span className="text-sm tracking-widest text-gold" aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </span>
                  <time className="text-xs text-muted" dateTime={review.createdAt.toISOString()}>
                    {review.createdAt.toLocaleDateString("en-LK")}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{review.review}</p>
              </div>
              <form action={deleteReview.bind(null, review.id)} className="shrink-0">
                <DeleteEnquiryButton />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
