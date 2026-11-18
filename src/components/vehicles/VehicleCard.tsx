import Image from "next/image";
import Link from "next/link";
import { formatLkr, whatsappLink, categoryLabel, transmissionLabel } from "@/lib/format";
import type { Vehicle } from "@prisma/client";

interface Props {
  vehicle: Vehicle;
  whatsappNumber: string;
}

const WA_ICON = (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function VehicleCard({ vehicle, whatsappNumber }: Props) {
  const isRented = vehicle.status === "RENTED";
  const mainImage = vehicle.images[0];
  const waMessage = `Hello! I'm interested in renting the ${vehicle.name}. Please let me know the availability.`;
  const waLink = whatsappLink(whatsappNumber, waMessage);

  return (
    <article className="group bg-charcoal-800 overflow-hidden border border-charcoal-700 hover:border-gold/50 transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Image */}
      <Link href={`/vehicles/${vehicle.slug}`} className="relative block aspect-video overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-charcoal-700 flex items-center justify-center">
            <svg className="w-12 h-12 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
        {isRented && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">
              Currently Rented
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/vehicles/${vehicle.slug}`}>
          <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors mb-2">
            {vehicle.name}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs bg-gold/15 text-gold border border-gold/25 px-2 py-0.5 rounded">
            {categoryLabel(vehicle.category)}
          </span>
          <span className="text-xs bg-charcoal-700 text-muted border border-charcoal-600 px-2 py-0.5 rounded">
            {vehicle.seats} seats
          </span>
          <span className="text-xs bg-charcoal-700 text-muted border border-charcoal-600 px-2 py-0.5 rounded">
            {transmissionLabel(vehicle.transmission)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">Per day</p>
            <p className="text-gold font-display font-bold text-xl tracking-tight">{formatLkr(vehicle.pricePerDay)}</p>
          </div>
          {waLink && !isRented ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-charcoal text-xs font-bold px-3 py-2 rounded transition-colors"
            >
              {WA_ICON}
              Book Now
            </a>
          ) : (
            <span className="inline-flex items-center bg-charcoal-700 text-muted text-xs font-medium px-3 py-2 rounded cursor-not-allowed">
              Rented
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
