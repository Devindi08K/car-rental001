import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleBySlug } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import {
  formatLkr,
  whatsappLink,
  categoryLabel,
  transmissionLabel,
  fuelLabel,
  rentalLabel,
  statusLabel,
} from "@/lib/format";
import { BUSINESS_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle Not Found" };
  return {
        title: vehicle.name,
        description: vehicle.description.slice(0, 160),
    openGraph: {
      title: vehicle.name,
      description: vehicle.description.slice(0, 160),
      images: vehicle.images[0] ? [{ url: vehicle.images[0], alt: vehicle.name }] : [],
      url: `${siteUrl()}/vehicles/${slug}`,
    },
  };
}

export default async function VehicleDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const bookingParams = searchParams ? await searchParams : {};
  const [vehicle, settings] = await Promise.all([getVehicleBySlug(slug), getSettings()]);
  if (!vehicle) notFound();

  const isRented = vehicle.status === "RENTED";
  const oneParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const location = oneParam(bookingParams.location);
  const startDate = oneParam(bookingParams.startDate);
  const endDate = oneParam(bookingParams.endDate);
  const rentalType = oneParam(bookingParams.rentalType);
  const bookingDetails = [
    location ? `Pickup location: ${location}` : "",
    startDate ? `Start date: ${startDate}` : "",
    endDate ? `End date: ${endDate}` : "",
    rentalType ? `Rental type: ${rentalType === "WITH_DRIVER" ? "With driver" : rentalType === "BOTH" ? "Both options" : "Self-drive"}` : "",
  ].filter(Boolean).join("\n");
  const waMessage = `Hello! I'm interested in renting the *${vehicle.name}*. Please let me know the availability and booking details.${bookingDetails ? `\n${bookingDetails}` : ""}`;
  const waLink = whatsappLink(settings.whatsappNumber, waMessage);

  const specs = [
    { label: "Category", value: categoryLabel(vehicle.category) },
    { label: "Seats", value: `${vehicle.seats} passengers` },
    { label: "Transmission", value: transmissionLabel(vehicle.transmission) },
    { label: "Fuel type", value: fuelLabel(vehicle.fuelType) },
    { label: "Rental type", value: rentalLabel(vehicle.rentalType) },
    { label: "Status", value: statusLabel(vehicle.status) },
  ];

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gold border-b border-gold-dark py-4 text-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-charcoal/70">
          <Link href="/vehicles" className="hover:text-charcoal transition-colors">Vehicles</Link>
          <span className="mx-2 text-charcoal/50">/</span>
          <span className="font-semibold">{vehicle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <VehicleGallery images={vehicle.images} name={vehicle.name} rented={isRented} />
          {/* Details */}
          <div>
            <span className="inline-flex items-center text-xs bg-gold/15 text-gold border border-gold/25 px-2.5 py-1 rounded mb-3">
              {categoryLabel(vehicle.category)}
            </span>
            {isRented && (
              <span className="inline-flex items-center text-xs bg-red-900/40 text-red-400 border border-red-700/40 px-2.5 py-1 rounded mb-3 ml-2">
                Currently Rented
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">{vehicle.name}</h1>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display text-3xl font-bold text-gold">{formatLkr(vehicle.pricePerDay)}</span>
              <span className="text-muted text-sm">/ day</span>
            </div>

            {/* Specs */}
            <div className="bg-charcoal-800 rounded-xl border border-charcoal-700 p-6 mb-6">
              <h2 className="font-display text-lg font-semibold text-cream mb-4">Specifications</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs text-muted uppercase tracking-wide">{s.label}</dt>
                    <dd className="text-cream text-sm font-medium mt-0.5">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-display text-lg font-semibold text-cream mb-3">About this vehicle</h2>
              <div className="text-muted text-sm leading-relaxed space-y-2">
                {vehicle.description.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* CTA */}
            {waLink && !isRented ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold-light text-charcoal font-bold py-4 transition-colors text-base uppercase tracking-[0.08em]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book this vehicle on WhatsApp
              </a>
            ) : (
              <div className="w-full flex items-center justify-center bg-charcoal-700 text-muted font-semibold py-4 rounded-xl cursor-not-allowed text-base">
                Vehicle Currently Rented — Enquire for Availability
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
