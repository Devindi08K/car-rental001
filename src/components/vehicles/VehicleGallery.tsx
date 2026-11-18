"use client";

import { useState } from "react";
import Image from "next/image";

export function VehicleGallery({
  images,
  name,
  rented,
}: {
  images: string[];
  name: string;
  rented: boolean;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-charcoal-700 rounded-xl flex items-center justify-center border border-charcoal-600 text-sm text-muted">
        No photos yet
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-charcoal-700">
        <Image
          key={current}
          src={current}
          alt={`${name} photo ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {rented && (
          <span className="absolute top-4 left-4 bg-red-700 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            Currently Rented
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? "border-gold" : "border-charcoal-700 hover:border-gold/50"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="12vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}