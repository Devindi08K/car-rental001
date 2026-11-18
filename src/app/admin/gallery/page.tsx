import { requireAdmin } from "@/lib/auth-guard";
import { getGallery } from "@/lib/gallery";
import { GalleryUploader } from "@/components/admin/GalleryUploader";

export const instant = false;

export default async function AdminGalleryPage() {
  await requireAdmin();
  const images = await getGallery();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-3">Gallery</h1>
      <p className="text-muted text-sm mb-8">Images here appear on the Weddings page. Upload JPG, PNG, or WebP under 5 MB.</p>
      <GalleryUploader initialImages={images} />
    </div>
  );
}
