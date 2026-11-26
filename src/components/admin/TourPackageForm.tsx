"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveTourPackage, type TourFormState } from "@/server/tour-actions";
import type { TourDay, TourPackage, TourVehicle } from "@/lib/tours";

export function TourPackageForm({ tour }: { tour: TourPackage }) {
  const [state, formAction, pending] = useActionState<TourFormState, FormData>(saveTourPackage, undefined);
  const [heroImage, setHeroImage] = useState(tour.heroImageUrl);
  const [gallery, setGallery] = useState(tour.gallery);
  const [highlights, setHighlights] = useState(tour.highlights);
  const [inclusions, setInclusions] = useState(tour.inclusions);
  const [exclusions, setExclusions] = useState(tour.exclusions);
  const [vehicles, setVehicles] = useState<TourVehicle[]>(tour.vehicles);
  const [itinerary, setItinerary] = useState<TourDay[]>(tour.itinerary);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");

  async function upload(file: File, target: "hero" | "gallery" | "day", dayIndex = 0, imageIndex = 0) {
    setUploading(target);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data: { url?: unknown; error?: unknown } = await response.json();
      if (!response.ok || typeof data.url !== "string") throw new Error(typeof data.error === "string" ? data.error : "Upload failed.");
      if (target === "hero") {
        setHeroImage(data.url);
      } else if (target === "gallery") {
        setGallery((current) => [...current, data.url as string].slice(0, 12));
      } else if (typeof data.url === "string") {
        setItinerary((current) => current.map((day, index) => {
          if (index !== dayIndex) return day;
          const images = [0, 1].map((position) =>
            position === imageIndex
              ? { ...(day.images[position] ?? { src: "", alt: "" }), src: data.url as string }
              : (day.images[position] ?? { src: "", alt: "" }),
          );
          return { ...day, images };
        }));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading("");
    }
  }

  const inp = "w-full rounded-lg border border-charcoal-600 bg-charcoal-700 px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none";
  const lbl = "mb-1.5 block text-xs text-muted";

  function wrappedAction(formData: FormData) {
    formData.set("heroImageUrl", heroImage);
    formData.set("gallery", JSON.stringify(gallery));
    formData.set("highlights", JSON.stringify(highlights));
    formData.set("inclusions", JSON.stringify(inclusions));
    formData.set("exclusions", JSON.stringify(exclusions));
    formData.set("vehicles", JSON.stringify(vehicles));
    formData.set("itinerary", JSON.stringify(itinerary));
    formAction(formData);
  }

  return (
    <form action={wrappedAction} className="max-w-4xl space-y-8">
      {state?.error && <div className="rounded-lg border border-red-700/50 bg-red-900/40 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      {error && <div className="rounded-lg border border-red-700/50 bg-red-900/40 px-4 py-3 text-sm text-red-400">{error}</div>}
      {state?.ok && <div className="rounded-lg border border-green-700/50 bg-green-900/40 px-4 py-3 text-sm text-green-400">Tour package saved.</div>}

      <section className="grid gap-4 sm:grid-cols-2">
        <div><label className={lbl} htmlFor="tour-title">Tour title</label><input id="tour-title" name="title" required minLength={3} defaultValue={tour.title} className={inp} /></div>
        <div><label className={lbl} htmlFor="tour-eyebrow">Eyebrow</label><input id="tour-eyebrow" name="eyebrow" required minLength={3} defaultValue={tour.eyebrow} className={inp} /></div>
        <div><label className={lbl} htmlFor="tour-duration">Duration</label><input id="tour-duration" name="duration" required minLength={3} defaultValue={tour.duration} className={inp} /></div>
        <div><label className={lbl} htmlFor="tour-destinations">Destinations</label><input id="tour-destinations" name="destinations" required minLength={3} defaultValue={tour.destinations} className={inp} /></div>
        <div className="sm:col-span-2"><label className={lbl} htmlFor="tour-intro">Introduction</label><textarea id="tour-intro" name="intro" rows={4} required defaultValue={tour.intro} className={`${inp} resize-y`} /></div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cream">Tour highlights</h2>
          <button type="button" onClick={() => setHighlights((current) => [...current, ""])} className="text-xs text-gold hover:underline">+ Add highlight</button>
        </div>
        <div className="space-y-2">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <input value={highlight} onChange={(event) => setHighlights((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className={`${inp} flex-1`} />
              <button type="button" aria-label="Remove highlight" onClick={() => setHighlights((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="px-3 text-sm text-red-400">×</button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-cream">Hero photo</h2>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-charcoal-600 bg-charcoal-700">
            {heroImage ? <Image src={heroImage} alt="Tour hero" fill className="object-cover" sizes="600px" /> : <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">No hero photo</div>}
          </div>
          <label className="mt-3 block cursor-pointer border border-charcoal-600 px-4 py-3 text-center text-xs text-gold hover:border-gold/50">
            {uploading === "hero" ? "Uploading…" : "Choose or replace hero photo"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "hero"); }} />
          </label>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-cream">Gallery photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((image, index) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded border border-charcoal-600">
                <Image src={image} alt={`Tour gallery ${index + 1}`} fill className="object-cover" sizes="180px" />
                <button type="button" aria-label="Remove gallery photo" onClick={() => setGallery((current) => current.filter((item) => item !== image))} className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-700 text-xs text-white">×</button>
              </div>
            ))}
            <label className="flex aspect-[4/3] cursor-pointer items-center justify-center rounded border-2 border-dashed border-charcoal-600 text-xs text-muted hover:border-gold/50">
              {uploading === "gallery" ? "Adding…" : "+ Add"}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "gallery"); }} />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {[
          { title: "Package inclusions", values: inclusions, setValues: setInclusions },
          { title: "Package exclusions", values: exclusions, setValues: setExclusions },
        ].map(({ title, values, setValues }) => (
          <div key={title}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-cream">{title}</h2>
              <button type="button" onClick={() => setValues((current) => [...current, ""])} className="text-xs text-gold hover:underline">+ Add item</button>
            </div>
            <div className="space-y-2">
              {values.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <input value={value} onChange={(event) => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className={`${inp} flex-1`} />
                  <button type="button" aria-label={`Remove ${title} item`} onClick={() => setValues((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="px-3 text-sm text-red-400">×</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cream">Vehicle options</h2>
          <button type="button" onClick={() => setVehicles((current) => [...current, { name: "", capacity: "", features: "" }])} className="text-xs text-gold hover:underline">+ Add vehicle</button>
        </div>
        <div className="grid gap-3">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-charcoal-600 p-4 sm:grid-cols-3">
              <div><label className={lbl}>Vehicle name</label><input value={vehicle.name} onChange={(event) => setVehicles((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} className={inp} /></div>
              <div><label className={lbl}>Capacity</label><input value={vehicle.capacity} onChange={(event) => setVehicles((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, capacity: event.target.value } : item))} className={inp} /></div>
              <div><label className={lbl}>Features</label><div className="flex gap-2"><input value={vehicle.features} onChange={(event) => setVehicles((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, features: event.target.value } : item))} className={`${inp} flex-1`} /><button type="button" aria-label="Remove vehicle" onClick={() => setVehicles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="px-2 text-red-400">×</button></div></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cream">Day-by-day itinerary</h2>
          <button type="button" onClick={() => setItinerary((current) => [...current, { day: String(current.length + 1).padStart(2, "0"), title: "", route: "", intro: "", stay: "", images: [{ src: "", alt: "" }, { src: "", alt: "" }], highlights: [["", ""]] }])} className="text-xs text-gold hover:underline">+ Add day</button>
        </div>
        <div className="space-y-4">
          {itinerary.map((day, dayIndex) => (
            <div key={`${day.day}-${dayIndex}`} className="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gold">Day {day.day}</h3>
                <button type="button" onClick={() => setItinerary((current) => current.filter((_, index) => index !== dayIndex))} className="text-xs text-red-400">Remove day</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={lbl}>Day number</label><input value={day.day} onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, day: event.target.value } : item))} className={inp} /></div>
                <div><label className={lbl}>Overnight location</label><input value={day.stay} onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, stay: event.target.value } : item))} className={inp} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Day title</label><input value={day.title} onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, title: event.target.value } : item))} className={inp} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Route</label><input value={day.route} onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, route: event.target.value } : item))} className={inp} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Day description</label><textarea rows={3} value={day.intro} onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, intro: event.target.value } : item))} className={`${inp} resize-y`} /></div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[0, 1].map((imageIndex) => {
                  const image = day.images[imageIndex] ?? { src: "", alt: "" };
                  return (
                    <div key={imageIndex}>
                      <div className="relative aspect-[16/9] overflow-hidden rounded border border-charcoal-600 bg-charcoal-700">
                        {image.src ? <Image src={image.src} alt={image.alt || `Day ${day.day} photo ${imageIndex + 1}`} fill className="object-cover" sizes="400px" /> : <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">No photo</div>}
                      </div>
                      <label className="mt-2 block cursor-pointer border border-charcoal-600 px-3 py-2 text-center text-xs text-gold">
                        {uploading === "day" ? "Uploading…" : `Choose day photo ${imageIndex + 1}`}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "day", dayIndex, imageIndex); }} />
                      </label>
                      <input value={image.alt} placeholder="Photo description" onChange={(event) => setItinerary((current) => current.map((item, index) => {
                        if (index !== dayIndex) return item;
                        const images = [0, 1].map((position) => position === imageIndex ? { ...(item.images[position] ?? { src: "", alt: "" }), alt: event.target.value } : (item.images[position] ?? { src: "", alt: "" }));
                        return { ...item, images };
                      }))} className={`${inp} mt-2`} />
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between"><p className={lbl}>Day highlights</p><button type="button" onClick={() => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, highlights: [...item.highlights, ["", ""]] } : item))} className="text-xs text-gold">+ Add highlight</button></div>
                <div className="space-y-2">
                  {day.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="grid gap-2 sm:grid-cols-[0.7fr_1fr_auto]">
                      <input value={highlight[0]} placeholder="Highlight title" onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, highlights: item.highlights.map((pair, pairIndex) => pairIndex === highlightIndex ? [event.target.value, pair[1]] : pair) } : item))} className={inp} />
                      <input value={highlight[1]} placeholder="Description" onChange={(event) => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, highlights: item.highlights.map((pair, pairIndex) => pairIndex === highlightIndex ? [pair[0], event.target.value] : pair) } : item))} className={inp} />
                      <button type="button" onClick={() => setItinerary((current) => current.map((item, index) => index === dayIndex ? { ...item, highlights: item.highlights.filter((_, pairIndex) => pairIndex !== highlightIndex) } : item))} className="px-3 text-red-400">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button type="submit" disabled={pending} className="rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-gold-dark disabled:opacity-60">
        {pending ? "Saving…" : "Save Tour Package"}
      </button>
    </form>
  );
}
