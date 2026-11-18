"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { saveSettings } from "@/server/settings-actions";

export interface PageImageSlot {
  key: string;
  label: string;
  description: string;
  value: string;
  fallback?: string;
}

export function PageImageManager({ slots }: { slots: PageImageSlot[] }) {
  const [uploading, setUploading] = useState<string>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function replaceImage(slot: PageImageSlot, file: File) {
    setUploading(slot.key);
    setError("");
    setMessage("");

    try {
      const form = new FormData();
      form.append("file", file);
      const upload = await fetch("/api/upload", { method: "POST", body: form });
      const data: { url?: unknown; error?: unknown } = await upload.json();
      if (!upload.ok || typeof data.url !== "string") {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed.");
      }

      const settingsForm = new FormData();
      settingsForm.set(slot.key, data.url);
      const result = await saveSettings(null, settingsForm);
      if (!result.ok) throw new Error(result.error ?? "Could not save image.");

      setMessage(`${slot.label} updated.`);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading("");
    }
  }

  return (
    <div className="space-y-5">
      {message && <p className="rounded-lg border border-green-700/50 bg-green-900/40 px-4 py-3 text-sm text-green-400">{message}</p>}
      {error && <p className="rounded-lg border border-red-700/50 bg-red-900/40 px-4 py-3 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {slots.map((slot) => {
          const source = slot.value || slot.fallback;
          return (
            <div key={slot.key} className="overflow-hidden rounded-lg border border-charcoal-600 bg-charcoal-800">
              <div className="relative aspect-[16/10] bg-charcoal-700">
                {source ? (
                  <Image src={source} alt={slot.label} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 50vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">No image added</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-cream">{slot.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{slot.description}</p>
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files[0];
                    if (file) void replaceImage(slot, file);
                  }}
                  className="mt-4 flex cursor-pointer items-center justify-between border border-charcoal-600 px-3 py-2.5 text-xs text-gold hover:border-gold/50"
                >
                  <span>{uploading === slot.key ? "Uploading…" : "Choose or drop one image"}</span>
                  <span className="font-bold">Replace</span>
                  <input
                    ref={(element) => { inputRefs.current[slot.key] = element; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploading === slot.key}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void replaceImage(slot, file);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
