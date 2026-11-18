"use client";

import { useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  saved: "Saved.",
  deleted: "Deleted.",
  status: "Status updated.",
};

export function AdminNotice() {
  const params = useSearchParams();
  const text = messages[params.get("notice") ?? ""];
  if (!text) return null;
  return (
    <div role="status" className="mb-6 bg-green-900/40 border border-green-700/50 text-green-400 text-sm rounded-lg px-4 py-3">
      {text}
    </div>
  );
}