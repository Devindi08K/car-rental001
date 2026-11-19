import type { Metadata } from "next";
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
    <div className="bg-charcoal min-h-screen">
      {/* Header */}
      <div className="bg-gold border-b border-gold-dark py-20 text-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-charcoal/70 text-sm font-bold tracking-widest uppercase mb-3">Self-Drive</p>
          <h1 className="font-display text-4xl md:text-6xl font-black mb-4">{content.title}</h1>
          <span className="block w-12 h-0.5 bg-charcoal mb-6" />
          <div className="max-w-2xl text-charcoal/70 text-lg leading-relaxed space-y-3">
            {content.intro.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-14">
            {/* Requirements */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-cream mb-6">Requirements</h2>
              <ul className="space-y-3">
                {content.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted text-sm">
                    <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Foreign visitors */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-cream mb-4">For Foreign Visitors</h2>
              <div className="text-muted text-sm leading-relaxed space-y-3">
                {content.foreignNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-cream mb-4">Pricing Notes</h2>
              <div className="text-muted text-sm leading-relaxed space-y-3">
                {content.pricingNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Insurance */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-cream mb-4">Insurance &amp; Liability</h2>
              <div className="text-muted text-sm leading-relaxed space-y-3">
                {content.insuranceNotes.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Pickup info */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-cream mb-4">Pickup &amp; Drop-off</h2>
              <div className="text-muted text-sm leading-relaxed space-y-3">
                {content.pickupInfo.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* FAQ */}
            {content.faq.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-cream mb-6">Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {content.faq.map((item, i) => (
                    <div key={i} className="bg-charcoal-800 border border-charcoal-700 rounded-lg p-6">
                      <h3 className="font-semibold text-cream mb-2">{item.question}</h3>
                      <div className="text-muted text-sm leading-relaxed space-y-2">
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

          {/* Sidebar CTA */}
          <aside className="space-y-8">
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-cream mb-3">Ready to book?</h3>
              <p className="text-muted text-sm mb-5">Contact us on WhatsApp for instant availability and pricing.</p>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-charcoal font-bold py-3 transition-colors text-sm"
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

        {/* Self-drive vehicles */}
        {vehicles.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-bold text-cream mb-8">Available for Self-Drive</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
