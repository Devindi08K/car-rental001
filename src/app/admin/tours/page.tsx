import { requireAdmin } from "@/lib/auth-guard";
import { getTourPackage } from "@/lib/tours";
import { TourPackageForm } from "@/components/admin/TourPackageForm";

export const instant = false;

export default async function AdminToursPage() {
  await requireAdmin();
  const tour = await getTourPackage();
  return (
    <div>
      <h1 className="mb-3 font-display text-3xl font-bold text-cream">Tours</h1>
      <p className="mb-8 text-sm text-muted">Manage the featured tour, photos, inclusions and day-by-day itinerary.</p>
      <TourPackageForm tour={tour} />
    </div>
  );
}
