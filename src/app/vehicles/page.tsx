import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles, parseVehicleFilters } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: `Our Vehicles — ${BUSINESS_NAME}`,
  description:
    "Browse our full fleet of cars, vans, SUVs and luxury vehicles available for self-drive or with a driver in Sri Lanka. Filter by type, seats and price.",
  path: "/vehicles",
});

export const instant = false;

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = parseVehicleFilters(params);
  const [settings, vehicles] = await Promise.all([getSettings(), getVehicles(filters)]);
  const oneParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const location = oneParam(params.location);
  const startDate = oneParam(params.startDate);
  const endDate = oneParam(params.endDate);
  const rentalLabel = filters.rentalType === "WITH_DRIVER"
    ? "With driver"
    : filters.rentalType === "BOTH"
      ? "Both options"
      : filters.rentalType === "SELF_DRIVE"
        ? "Self-drive"
        : "";
  const bookingDetails = [
    location ? `Pickup: ${location}` : "",
    startDate ? `From: ${startDate}` : "",
    endDate ? `To: ${endDate}` : "",
  ].filter(Boolean).join(" · ");
  const whatsappDetails = [
    location ? `Pickup location: ${location}` : "",
    startDate ? `Start date: ${startDate}` : "",
    endDate ? `End date: ${endDate}` : "",
    rentalLabel ? `Rental type: ${rentalLabel}` : "",
  ].filter(Boolean).join("\n");

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-[#eae7df] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="eyebrow mb-4">The collection</p>
          <h1 className="editorial-heading text-ink">A vehicle for every kind of journey.</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink/75">
            Browse our cars, vans and premium vehicles, thoughtfully prepared for your time in Sri Lanka.
          </p>
        </div>
      </div>

      {bookingDetails && (
        <div className="border-b border-line bg-paper">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-5 py-4 text-sm sm:px-8 lg:px-12">
            <span className="eyebrow">Your search</span>
            <span className="text-ink/80">{bookingDetails}</span>
            {rentalLabel && <span className="border border-olive/30 px-2 py-1 text-xs text-olive-ink">{rentalLabel}</span>}
            <Link href="/vehicles" className="ml-auto text-xs text-ink/70 hover:text-olive-ink">Clear search</Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="sticky top-[76px] z-30 border-b border-line bg-ivory/95 py-5 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Suspense fallback={<div className="h-10 animate-pulse bg-[#e8e4dc]" />}>
            <VehicleFilters />
          </Suspense>
        </div>
      </div>

      {/* Vehicle grid */}
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        {vehicles.length === 0 ? (
          <div className="text-center py-24">
            <p className="mb-3 text-lg text-ink/75">No vehicles match your filters.</p>
            <Link href="/vehicles" className="text-olive-ink hover:underline text-sm">
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-xs uppercase tracking-[0.12em] text-ink/70">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} whatsappNumber={settings.whatsappNumber} bookingDetails={whatsappDetails} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
