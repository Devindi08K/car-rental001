import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles, parseVehicleFilters } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";

export const metadata: Metadata = pageMeta({
  title: "Our Vehicles — Royal Route Sri Lanka",
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
    <div className="bg-charcoal min-h-screen">
      {/* Page header */}
      <div className="bg-gold border-b border-gold-dark py-16 text-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-charcoal/70 text-sm font-bold tracking-widest uppercase mb-2">Our Fleet</p>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight">Our Vehicles</h1>
          <span className="block w-12 h-0.5 bg-charcoal mt-4" />
        </div>
      </div>

      {bookingDetails && (
        <div className="border-b border-charcoal-700 bg-charcoal-800">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 text-sm sm:px-6 lg:px-8">
            <span className="font-bold uppercase tracking-[0.12em] text-gold">Your search</span>
            <span className="text-cream">{bookingDetails}</span>
            {rentalLabel && <span className="border border-gold/30 px-2 py-1 text-xs text-gold">{rentalLabel}</span>}
            <Link href="/vehicles" className="ml-auto text-xs text-muted hover:text-gold">Clear search</Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-charcoal-800 border-b border-charcoal-700 py-5 sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-10 bg-charcoal-700 rounded animate-pulse" />}>
            <VehicleFilters />
          </Suspense>
        </div>
      </div>

      {/* Vehicle grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {vehicles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted text-lg mb-3">No vehicles match your filters.</p>
            <Link href="/vehicles" className="text-gold hover:underline text-sm">
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm mb-8">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
