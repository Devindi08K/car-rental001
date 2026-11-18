import { revalidatePath, updateTag } from "next/cache";

export function revalidateVehicles(slugs: string[] = []) {
  updateTag("vehicles");
  revalidatePath("/");
  revalidatePath("/vehicles");
  revalidatePath("/self-drive-rental");
  revalidatePath("/services");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/vehicles/${slug}`);
  }
}

export function revalidateSettings() {
  updateTag("settings");
  revalidatePath("/", "layout");
}

export function revalidateContent() {
  updateTag("page:self-drive");
  revalidatePath("/self-drive-rental");
}

export function revalidateGallery() {
  updateTag("gallery");
  revalidatePath("/");
  revalidatePath("/weddings");
}
