import Image from "next/image";
import Link from "next/link";
import { formatLkr, whatsappLink, categoryLabel, transmissionLabel } from "@/lib/format";
import type { Vehicle } from "@prisma/client";

interface Props {
  vehicle: Vehicle;
  whatsappNumber: string;
  bookingDetails?: string;
}

export function VehicleCard({ vehicle, whatsappNumber, bookingDetails }: Props) {
  const isRented = vehicle.status === "RENTED";
  const mainImage = vehicle.images[0];
  const waMessage = `Hello! I'm interested in renting the ${vehicle.name}. Please let me know the availability.${bookingDetails ? `\n${bookingDetails}` : ""}`;
  const waLink = whatsappLink(whatsappNumber, waMessage);

  return (
    <article className="group bg-charcoal-800/50 flex flex-col transition-all duration-500 hover:bg-charcoal-800">
      {/* Image Container - cleaner look */}
      <Link href={`/vehicles/${vehicle.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-charcoal-700">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

        <div className="absolute top-4 left-4 z-10">
          <span
            className={`border backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1.5 shadow-xl ${
              isRented
                ? "border-charcoal-500/80 bg-charcoal/90 text-muted"
                : "border-gold/70 bg-charcoal/90 text-gold"
            }`}
          >
            {isRented ? "Currently rented" : "Available"}
          </span>
        </div>
      </Link>

      {/* Content - Sixt style spacing */}
      <div className="p-6 flex flex-col flex-1 border-x border-b border-charcoal-700/50 group-hover:border-gold/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link href={`/vehicles/${vehicle.slug}`}>
              <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold transition-colors leading-tight">
                {vehicle.name}
              </h3>
            </Link>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-1 font-bold">
              {categoryLabel(vehicle.category)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted uppercase font-bold tracking-tighter">Daily</p>
            <p className="text-gold font-display font-black text-2xl tracking-tighter -mt-1">
              {formatLkr(vehicle.pricePerDay)}
            </p>
          </div>
        </div>

        {/* Specs with better icons/layout */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 border-y border-charcoal-700/50 mb-6">
          <div className="flex items-center gap-2 text-xs text-cream/70">
             <span className="text-gold">●</span> {vehicle.seats} Seats
          </div>
          <div className="flex items-center gap-2 text-xs text-cream/70">
             <span className="text-gold">●</span> {transmissionLabel(vehicle.transmission)}
          </div>
          <div className="flex items-center gap-2 text-xs text-cream/70">
             <span className="text-gold">●</span> Air Conditioned
          </div>
          <div className="flex items-center gap-2 text-xs text-cream/70">
             <span className="text-gold">●</span> Unlimited Miles
          </div>
        </div>

        <div className="mt-auto">
          {isRented ? (
            <div className="w-full text-center py-4 text-xs font-bold uppercase tracking-widest text-muted border border-charcoal-700">
              Currently rented
            </div>
          ) : waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative flex items-center justify-center gap-3 bg-gold px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-charcoal overflow-hidden transition-all hover:pr-10"
            >
              <span className="relative z-10">Select This Car</span>
              <span className="absolute right-4 translate-x-4 opacity-0 transition-all group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
                →
              </span>
            </a>
          ) : (
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className="flex items-center justify-center border border-charcoal-600 px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              View vehicle
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
