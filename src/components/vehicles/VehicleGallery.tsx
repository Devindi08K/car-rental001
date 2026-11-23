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
      <div className="flex aspect-video items-center justify-center bg-beige/30 text-sm text-ink/70">
        No photos yet
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="image-editorial relative mb-3 aspect-video">
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
          <span className="absolute left-4 top-4 bg-ink/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
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
              className={`image-editorial relative aspect-video border transition-colors ${
                i === active ? "border-olive" : "border-transparent hover:border-olive/50"
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