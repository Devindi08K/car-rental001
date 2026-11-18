import Link from "next/link";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import type { Vehicle } from "@prisma/client";

interface Props {
  vehicles: Vehicle[];
  whatsappNumber: string;
}

export function FeaturedVehicles({ vehicles, whatsappNumber }: Props) {
  if (vehicles.length === 0) return null;
  return (
    <section className="py-20 md:py-28 bg-charcoal" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">Our Fleet</p>
          <h2 id="featured-heading" className="font-display text-4xl md:text-5xl font-bold text-cream">
            Featured Vehicles
          </h2>
          <span className="block w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} whatsappNumber={whatsappNumber} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 border border-gold text-gold px-8 py-3 rounded hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium"
          >
            View All Vehicles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
