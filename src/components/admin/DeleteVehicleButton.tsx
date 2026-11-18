"use client";

import { useState } from "react";

export function DeleteVehicleButton({ name }: { name: string }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirmed) {
          event.preventDefault();
          setConfirmed(true);
        }
      }}
      className={`text-xs ${confirmed ? "text-red-300 font-semibold" : "text-red-400 hover:text-red-300"}`}
    >
      {confirmed ? `Confirm delete "${name}"` : "Delete"}
    </button>
  );
}
