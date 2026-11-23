import type { Metadata } from "next";
import Image from "next/image";
import { getSelfDriveContent } from "@/lib/content";
import { getSelfDriveVehicles } from "@/lib/vehicles";
import { getSettings } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = pageMeta({
  title: "Self-Drive Vehicle Rental Sri Lanka — Drive Yourself",
  description:
    "Rent a vehicle and drive yourself around Sri Lanka. Our self-drive fleet includes cars, vans, SUVs and luxury vehicles. A valid licence is required. Book on WhatsApp.",
  path: "/self-drive-rental",
});

export default async function SelfDriveRentalPage() {
  const [content, vehicles, settings] = await Promise.all([
    getSelfDriveContent(),
    getSelfDriveVehicles(),
    getSettings(),
  ]);
  const wa = whatsappLink(settings.whatsappNumber, "Hello! I'd like to enquire about a self-drive rental.");

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-beige/30 py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="eyebrow mb-4">The open road</p>
          <h1 className="editorial-heading text-ink">{content.title}</h1>
          <div className="mt-6 max-w-2xl space-y-3 text-sm leading-7 text-ink/75">
            {content.intro.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {settings.selfDriveImageUrl && (
          <div className="image-editorial relative mb-12 aspect-[16/8] sm:mb-16 sm:aspect-[16/6]">
            <Image
              src={settings.selfDriveImageUrl}
              alt="A vehicle ready for a self-drive journey in Sri Lanka"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
          <div className="space-y-12">
            <section>
              <p className="eyebrow mb-4">Before you set off</p>
              <h2 className="mb-6 font-display text-3xl text-ink">Requirements</h2>
              <ul className="space-y-4 border-t border-line pt-5">
                {content.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-6 text-ink/75">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-olive-ink" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-display text-3xl text-ink">For foreign visitors</h2>
              <div className="space-y-3 text-sm leading-7 text-ink/75">
                {content.foreignNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="mb-4 font-display text-3xl text-ink">Pricing notes</h2>
              <div className="space-y-3 text-sm leading-7 text-ink/75">
                {content.pricingNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Insurance */}
            <section>
              <h2 className="mb-4 font-display text-3xl text-ink">Insurance &amp; liability</h2>
              <div className="space-y-3 text-sm leading-7 text-ink/75">
                {content.insuranceNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Pickup info */}
            <section>
              <h2 className="mb-4 font-display text-3xl text-ink">Pickup &amp; drop-off</h2>
              <div className="space-y-3 text-sm leading-7 text-ink/75">
                {content.pickupInfo.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {content.faq.length > 0 && (
              <section>
                <h2 className="mb-6 font-display text-3xl text-ink">Frequently asked questions</h2>
                <div className="divide-y divide-line border-y border-line">
                  {content.faq.map((item, i) => (
                    <div key={i} className="py-5">
                      <h3 className="mb-2 font-semibold text-ink">{item.question}</h3>
                      <div className="space-y-2 text-sm leading-7 text-ink/75">
                        {item.answer.split("\n").filter(Boolean).map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div className="sticky top-28 bg-olive-dark p-6 text-white sm:p-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">A little more freedom</p>
              <h3 className="mb-3 font-display text-3xl">Ready to book?</h3>
              <p className="mb-6 text-sm leading-6 text-white/75">Contact us on WhatsApp for instant availability and pricing.</p>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 w-full items-center justify-center gap-2 bg-white py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Book on WhatsApp
                </a>
              )}
            </div>
          </aside>
        </div>

        {vehicles.length > 0 && (
          <section className="mt-20">
            <p className="eyebrow mb-4">Ready when you are</p>
            <h2 className="mb-8 font-display text-4xl text-ink">Available for self-drive</h2>
            <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} whatsappNumber={settings.whatsappNumber} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
