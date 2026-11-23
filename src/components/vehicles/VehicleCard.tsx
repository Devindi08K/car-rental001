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
    <article className="group flex flex-col">
      <Link href={`/vehicles/${vehicle.slug}`} className="image-editorial relative block aspect-[4/3]">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-12 w-12 text-ink/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute left-4 top-4 z-10">
          <span
            className={`inline-block px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] ${
              isRented
                ? "bg-ink/80 text-white"
                : "bg-paper/90 text-olive-ink"
            }`}
          >
            {isRented ? "Currently rented" : "Available"}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <Link href={`/vehicles/${vehicle.slug}`}>
              <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-olive-ink">
                {vehicle.name}
              </h3>
            </Link>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/70">
              {categoryLabel(vehicle.category)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink/70">From / day</p>
            <p className="mt-1 whitespace-nowrap font-display text-xl text-ink">
              {formatLkr(vehicle.pricePerDay)}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4">
          <div className="text-xs text-ink/70">
             {vehicle.seats} seats
          </div>
          <div className="text-xs text-ink/70">
             {transmissionLabel(vehicle.transmission)}
          </div>
          <div className="text-xs text-ink/70">
             Air conditioned
          </div>
          <div className="text-xs text-ink/70">
             Unlimited miles
          </div>
        </div>

        <div className="mt-auto">
          {isRented ? (
            <div className="w-full border border-line py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">
              Currently rented
            </div>
          ) : waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button-editorial group/btn relative w-full overflow-hidden"
            >
              <span className="relative z-10">Select This Vehicle</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className="flex min-h-13 items-center justify-center border border-line px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:border-olive hover:text-olive-ink"
            >
              View vehicle
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
