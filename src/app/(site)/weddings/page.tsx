import type { Metadata } from "next";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getGallery } from "@/lib/gallery";
import { whatsappLink, optimizedImage } from "@/lib/format";

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
    <div className="min-h-screen bg-ivory text-ink">
      <div
        className={`relative overflow-hidden bg-cover bg-center py-24 text-white sm:py-32 ${settings.weddingHeroImageUrl ? "" : "bg-olive-dark"}`}
        style={{
          backgroundImage: settings.weddingHeroImageUrl
            ? `linear-gradient(90deg, rgba(36,39,36,0.7) 0%, rgba(36,39,36,0.38) 58%, rgba(36,39,36,0.16) 100%), url('${optimizedImage(settings.weddingHeroImageUrl, 2000)}')`
            : undefined,
        }}
      >
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">A day to remember</p>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">
            Wedding &amp; event vehicle hire
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Arrive in timeless elegance. We provide professionally decorated luxury vehicles with
            experienced chauffeurs for weddings, engagements, and all special occasions across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-16 grid border-t border-line md:mb-20 md:grid-cols-3 md:gap-10">
          {[
            { title: "Elegant Decoration", desc: "Fresh flowers, ribbons, and bespoke styling tailored to your wedding theme and colour palette." },
            { title: "Professional Chauffeurs", desc: "Experienced, punctual, and formally dressed drivers who understand the significance of your day." },
            { title: "Flexible Packages", desc: "Half-day, full-day, and multi-vehicle packages. We work around your wedding itinerary." },
          ].map((f) => (
            <div key={f.title} className="border-b border-line py-6 md:border-b-0 md:py-8">
              <p className="eyebrow mb-4">{f.title}</p>
              <p className="text-sm leading-7 text-ink/75">{f.desc}</p>
            </div>
          ))}
        </div>

        {gallery.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <p className="eyebrow mb-4">The details</p>
            <h2 className="mb-8 font-display text-4xl text-ink sm:text-5xl">A glimpse of the day.</h2>
            <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
              {gallery.map((img) => (
                <div key={img.id} className="image-editorial mb-4 break-inside-avoid">
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

        <div className="bg-[#eae7df] p-8 sm:p-12">
          <p className="eyebrow mb-4">Let’s make it yours</p>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Make your day unforgettable.</h2>
          <p className="mb-8 mt-3 max-w-lg text-sm leading-7 text-ink/75">
            Contact us on WhatsApp to discuss your requirements and check availability for your wedding date.
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="button-editorial"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire on WhatsApp <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
