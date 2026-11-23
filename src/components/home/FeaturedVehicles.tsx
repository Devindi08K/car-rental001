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
    <section className="section-pad bg-ivory" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">A considered collection</p>
            <h2 id="featured-heading" className="editorial-heading text-ink">
              Journeys start with the right vehicle.
            </h2>
          </div>
          <Link href="/vehicles" className="inline-flex items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.12em] text-olive-ink transition-colors hover:text-ink">
            Explore all vehicles <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      </div>
    </section>
  );
}
