import type { Metadata } from "next";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getGallery } from "@/lib/gallery";
import { whatsappLink, optimizedImage } from "@/lib/format";
import { BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Wedding Cars Sri Lanka",
  description:
    "Elegant wedding car hire in Sri Lanka. Luxury vehicles professionally decorated, with courteous chauffeurs for your most memorable day.",
  path: "/weddings",
});

export default async function WeddingsPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery("WEDDING")]);
  const wa = whatsappLink(settings.whatsappNumber, "Hello! I'd like to enquire about wedding car hire. Please share availability and pricing.");

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Header */}
      <div
        className="bg-gold border-b border-gold-dark py-20 text-cream bg-cover bg-center"
        style={{
          backgroundImage: settings.weddingHeroImageUrl
            ? `linear-gradient(90deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.48) 58%, rgba(8,8,8,0.24) 100%), url('${optimizedImage(settings.weddingHeroImageUrl, 2000)}')`
            : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold-light text-sm font-bold tracking-widest uppercase mb-3">Special Occasions</p>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight text-cream">
            Wedding &amp; Event<br />
            <span className="text-gold-light">Vehicle Hire</span>
          </h1>
          <span className="block w-12 h-0.5 bg-gold mt-5 mb-6" />
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Arrive in timeless elegance. We provide professionally decorated luxury vehicles with
            experienced chauffeurs for weddings, engagements, and all special occasions across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { title: "Elegant Decoration", desc: "Fresh flowers, ribbons, and bespoke styling tailored to your wedding theme and colour palette." },
            { title: "Professional Chauffeurs", desc: "Experienced, punctual, and formally dressed drivers who understand the significance of your day." },
            { title: "Flexible Packages", desc: "Half-day, full-day, and multi-vehicle packages. We work around your wedding itinerary." },
          ].map((f) => (
            <div key={f.title} className="bg-charcoal-800 border border-charcoal-700 p-7 transition-transform hover:-translate-y-1">
              <div className="w-10 h-0.5 bg-gold mb-4" />
              <h2 className="font-display text-xl font-semibold text-cream mb-3">{f.title}</h2>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="mb-20">
            <h2 className="font-display text-3xl font-bold text-cream mb-8">Wedding Gallery</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {gallery.map((img) => (
                <div key={img.id} className="break-inside-avoid overflow-hidden rounded-lg border border-charcoal-700">
                  <div className="relative">
                    <Image
                      src={img.url}
                      alt={img.alt || "Wedding vehicle"}
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center bg-gold p-12 text-charcoal">
          <h2 className="font-display text-3xl font-bold mb-3">Make your day unforgettable</h2>
          <p className="text-charcoal/70 mb-8 max-w-lg mx-auto">
            Contact us on WhatsApp to discuss your requirements and check availability for your wedding date.
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal-700 text-cream font-semibold px-10 py-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
