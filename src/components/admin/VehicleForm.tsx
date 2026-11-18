"use client";

import { useActionState, useState } from "react";
import { saveVehicle, type FormState } from "@/server/vehicle-actions";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { slugify } from "@/lib/format";
import type { Vehicle } from "@prisma/client";

const CATEGORIES = ["LUXURY", "SEDAN", "SUV", "VAN", "WEDDING", "ECONOMY"] as const;
const RENTALS     = ["SELF_DRIVE", "WITH_DRIVER", "BOTH"] as const;
const STATUSES    = ["AVAILABLE", "RENTED"] as const;
const TRANSMISSIONS = ["AUTOMATIC", "MANUAL"] as const;
const FUELS       = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"] as const;

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveVehicle, undefined);
  const [images, setImages] = useState<string[]>(vehicle?.images ?? []);
  const [name, setName] = useState(vehicle?.name ?? "");
  const [slug, setSlug] = useState(vehicle?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!vehicle);

  const inp = "w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm rounded-lg px-3 py-2.5 focus:border-gold focus:outline-none";
  const lbl = "block text-xs text-muted mb-1.5";

  function wrappedAction(formData: FormData) {
    // vehicle-actions reads images as a single JSON string
    formData.set("images", JSON.stringify(images));
    if (vehicle) formData.set("id", vehicle.id);
    formAction(formData);
  }

  return (
    <form action={wrappedAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3">{state.error}</div>
      )}
      {state?.ok && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-400 text-sm rounded-lg px-4 py-3">Saved successfully.</div>
      )}

      {/* Photos */}
      <section>
        <h2 className="font-semibold text-cream mb-3">Photos</h2>
        <PhotoManager images={images} onChange={setImages} />
      </section>

      {/* Basic info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="vf-name" className={lbl}>Vehicle name *</label>
          <input
            id="vf-name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className={inp}
          />
        </div>
        <div>
          <label htmlFor="vf-slug" className={lbl}>Slug *</label>
          <input
            id="vf-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className={inp}
          />
        </div>
        <div>
          <label htmlFor="vf-cat" className={lbl}>Category *</label>
          <select id="vf-cat" name="category" required defaultValue={vehicle?.category ?? "SEDAN"} className={inp}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vf-rental" className={lbl}>Rental type *</label>
          <select id="vf-rental" name="rentalType" required defaultValue={vehicle?.rentalType ?? "WITH_DRIVER"} className={inp}>
            {RENTALS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vf-status" className={lbl}>Status</label>
          <select id="vf-status" name="status" defaultValue={vehicle?.status ?? "AVAILABLE"} className={inp}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vf-price" className={lbl}>Price per day (LKR) *</label>
          <input id="vf-price" name="pricePerDay" type="number" required min={0} defaultValue={vehicle?.pricePerDay ?? ""} className={inp} />
        </div>
        <div>
          <label htmlFor="vf-seats" className={lbl}>Seats *</label>
          <input id="vf-seats" name="seats" type="number" required min={1} max={30} defaultValue={vehicle?.seats ?? 5} className={inp} />
        </div>
        <div>
          <label htmlFor="vf-trans" className={lbl}>Transmission *</label>
          <select id="vf-trans" name="transmission" defaultValue={vehicle?.transmission ?? "AUTOMATIC"} className={inp}>
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vf-fuel" className={lbl}>Fuel type *</label>
          <select id="vf-fuel" name="fuelType" defaultValue={vehicle?.fuelType ?? "PETROL"} className={inp}>
            {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="vf-sort" className={lbl}>Sort order</label>
          <input id="vf-sort" name="sortOrder" type="number" min={0} defaultValue={vehicle?.sortOrder ?? 0} className={inp} />
        </div>
      </section>

      {/* Description */}
      <div>
        <label htmlFor="vf-desc" className={lbl}>Description *</label>
        <textarea id="vf-desc" name="description" required rows={6} defaultValue={vehicle?.description ?? ""} className={`${inp} resize-y`} />
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="isFeatured" value="true" defaultChecked={vehicle?.isFeatured ?? false} className="w-4 h-4 rounded accent-gold" />
        <span className="text-sm text-cream">Show in Featured Vehicles on homepage</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold text-charcoal font-semibold px-8 py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60 text-sm"
      >
        {pending ? "Saving…" : vehicle ? "Update Vehicle" : "Create Vehicle"}
      </button>
    </form>
  );
}
