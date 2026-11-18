import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/settings";
import type { GalleryImage } from "@prisma/client";

interface Props {
  images: GalleryImage[];
  settings: SiteSettings;
}

const CHECK = (
  <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const features = [
  "Luxury vehicles with professional decoration",
  "Experienced and punctual chauffeurs",
  "Flexible pickup & return arrangements",
  "Competitive rates for full-day hire",
];

export function WeddingHighlight({ images, settings }: Props) {
  const wa = whatsappLink(settings.whatsappNumber, "Hello! I'd like to enquire about wedding vehicle hire.");
  return (
    <section className="py-20 md:py-28 bg-charcoal" aria-labelledby="wedding-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div>
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">Special Occasions</p>
            <h2 id="wedding-heading" className="font-display text-4xl md:text-5xl font-bold text-cream leading-tight mb-4">
              Wedding &amp; Event
              <span className="text-gold block">Vehicles</span>
            </h2>
            <span className="block w-12 h-0.5 bg-gold mb-6" />
            <p className="text-muted text-lg leading-relaxed mb-6">
              Arrive in timeless elegance. Our wedding fleet is handpicked to complement your most memorable
              day, complete with professional decoration and a courteous chauffeur.
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted text-sm">
                  {CHECK}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/weddings"
                className="bg-gold text-charcoal font-semibold px-6 py-3 rounded hover:bg-gold-dark transition-colors text-sm"
              >
                View Wedding Gallery
              </Link>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gold text-gold px-6 py-3 rounded hover:bg-gold hover:text-charcoal transition-colors text-sm font-semibold"
                >
                  Enquire Now
                </a>
              )}
            </div>
          </div>
          {/* Images grid */}
          <div className="grid grid-cols-2 gap-3">
            {images.length > 0
              ? images.slice(0, 4).map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative overflow-hidden rounded-lg ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || "Wedding vehicle"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))
              : [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`bg-charcoal-700 rounded-lg flex items-center justify-center ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  >
                    <svg className="w-10 h-10 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
