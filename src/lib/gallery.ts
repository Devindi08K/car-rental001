import { cacheLife, cacheTag } from "next/cache";
import type { GallerySection } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function readGallery(section?: GallerySection) {
  "use cache";
  cacheTag("gallery");
  cacheLife("hours");
  return prisma.galleryImage.findMany({
    where: section ? { section } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getGallery(section?: GallerySection) {
  try {
    return await readGallery(section);
  } catch (error) {
    console.error("gallery_load_failed", error);
    return [];
  }
}
