"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = ["", "LUXURY", "SEDAN", "SUV", "VAN", "WEDDING", "ECONOMY"] as const;
const RENTALS    = ["", "SELF_DRIVE", "WITH_DRIVER", "BOTH"] as const;
const TRANSMISSIONS = ["", "AUTOMATIC", "MANUAL"] as const;
const SEATS      = ["", "2", "4", "5", "7", "8"] as const;

const catLabels: Record<string, string> = {
  "": "All categories", LUXURY: "Luxury", SEDAN: "Sedan",
  SUV: "SUV", VAN: "Van", WEDDING: "Wedding", ECONOMY: "Economy",
};
const rentalLabels: Record<string, string> = {
  "": "All types", SELF_DRIVE: "Self-drive", WITH_DRIVER: "With driver", BOTH: "Both options",
};
const transLabels: Record<string, string> = {
  "": "Any gearbox", AUTOMATIC: "Automatic", MANUAL: "Manual",
};
const seatsLabels: Record<string, string> = {
  "": "Any seats", "2": "2 seats", "4": "4 seats", "5": "5 seats", "7": "7 seats", "8": "8+ seats",
};

export function VehicleFilters() {
  const router    = useRouter();
  const pathname  = usePathname();
  const params    = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value); else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, params]
  );

  const val = (key: string) => params.get(key) ?? "";

  const sel = "bg-charcoal-800 border border-charcoal-600 text-cream text-sm rounded px-3 py-2 w-full focus:border-gold focus:outline-none cursor-pointer";

  return (
    <form className="grid grid-cols-2 md:grid-cols-4 gap-3" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-xs text-muted mb-1">Category</label>
        <select value={val("category")} onChange={(e) => update("category", e.target.value)} className={sel}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{catLabels[c]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Rental type</label>
        <select value={val("rentalType")} onChange={(e) => update("rentalType", e.target.value)} className={sel}>
          {RENTALS.map((r) => <option key={r} value={r}>{rentalLabels[r]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Transmission</label>
        <select value={val("transmission")} onChange={(e) => update("transmission", e.target.value)} className={sel}>
          {TRANSMISSIONS.map((t) => <option key={t} value={t}>{transLabels[t]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Seats</label>
        <select value={val("seats")} onChange={(e) => update("seats", e.target.value)} className={sel}>
          {SEATS.map((s) => <option key={s} value={s}>{seatsLabels[s]}</option>)}
        </select>
      </div>
    </form>
  );
}
