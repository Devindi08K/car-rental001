import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

async function readReviews() {
  "use cache";
  cacheTag("reviews");
  cacheLife("hours");
  return prisma.customerReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}

export async function getReviews() {
  try {
    return await readReviews();
  } catch (error) {
    console.error("reviews_load_failed", error);
    return [];
  }
}
