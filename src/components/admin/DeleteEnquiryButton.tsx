"use client";

import { useState } from "react";

interface Props {
  detail?: boolean;
}

export function DeleteEnquiryButton({ detail = false }: Props) {
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
      className={
        detail
          ? confirmed
            ? "bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
            : "bg-red-800 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
          : confirmed
            ? "text-red-300 hover:text-red-200 text-xs font-semibold"
            : "text-red-400 hover:text-red-300 text-xs"
      }
    >
      {confirmed ? "Confirm delete" : "Delete"}
    </button>
  );
}
