"use server";

import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth-guard";
import { clientIpFromHeaders, consumeRateLimit } from "@/lib/rate-limit";
import { customerReviewSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { revalidateReviews } from "@/lib/revalidate";

export type ReviewActionState = {
  ok?: boolean;
  error?: string;
};

export async function submitReview(
  _previousState: ReviewActionState | null,
  formData: FormData,
): Promise<ReviewActionState> {
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const result = customerReviewSchema.safeParse({
    name: formData.get("name"),
    review: formData.get("review"),
    rating: formData.get("rating"),
  });
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Please check your review and try again." };
  }

  try {
    const requestHeaders = await headers();
    const allowed = await consumeRateLimit(
      "customer-review",
      clientIpFromHeaders(requestHeaders),
      3,
      60 * 60 * 1000,
    );
    if (!allowed) return { error: "Too many reviews submitted. Please try again later." };

    await prisma.customerReview.create({ data: result.data });
    revalidateReviews();
    return { ok: true };
  } catch (error) {
    console.error("[submitReview]", error);
    return { error: "We couldn't submit your review. Please try again." };
  }
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();
  if (!id || id.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error("Invalid review.");
  }

  try {
    await prisma.customerReview.delete({ where: { id } });
  } catch (error) {
    console.error("[deleteReview]", error);
    throw new Error("Failed to delete the review.");
  }

  revalidateReviews();
}
