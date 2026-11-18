"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { MAX_VEHICLE_PHOTOS } from "@/lib/constants";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export function PhotoManager({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    const available = MAX_VEHICLE_PHOTOS - images.length;
    if (available <= 0) {
      setError(`Maximum ${MAX_VEHICLE_PHOTOS} photos allowed.`);
      return;
    }

    const selected = files.slice(0, available);
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    try {
      for (const file of selected) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Could not upload ${file.name}`);
        if (typeof data.url !== "string") throw new Error(`Upload failed for ${file.name}`);
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
      if (files.length > available) {
        setError(`Only ${available} of ${files.length} photos could be added. Maximum is ${MAX_VEHICLE_PHOTOS}.`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(e.target.files ?? []));
  }

  async function handleDelete(url: string, index: number) {
    // Remove from local state first
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    // Fire-and-forget cleanup
    fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative group border border-charcoal-600 rounded-lg overflow-hidden aspect-video bg-charcoal-700">
            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="150px" />
            {i === 0 && (
              <div className="absolute top-1 left-1 bg-gold text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded">Main</div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button type="button" onClick={() => moveUp(i)} title="Move left" disabled={i === 0}
                className="p-1 bg-charcoal-700 rounded text-cream disabled:opacity-30 hover:bg-charcoal-600 text-xs">◀</button>
              <button type="button" onClick={() => moveDown(i)} title="Move right" disabled={i === images.length - 1}
                className="p-1 bg-charcoal-700 rounded text-cream disabled:opacity-30 hover:bg-charcoal-600 text-xs">▶</button>
              <button type="button" onClick={() => handleDelete(url, i)} title="Delete"
                className="p-1 bg-red-700 rounded text-white hover:bg-red-600 text-xs">✕</button>
            </div>
          </div>
        ))}
        {images.length < MAX_VEHICLE_PHOTOS && (
          <div
            role="button"
            tabIndex={0}
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.dataTransfer.dropEffect = "copy";
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDragging(false);
              const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
                ["image/jpeg", "image/png", "image/webp"].includes(file.type)
              );
              void uploadFiles(files);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileRef.current?.click();
              }
            }}
            onClick={() => fileRef.current?.click()}
            className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${dragging ? "border-gold bg-gold/10" : "border-charcoal-600 bg-charcoal-700 hover:border-gold/50"}`}
          >
            {uploading ? (
              <span className="text-xs text-muted">Uploading…</span>
            ) : (
              <>
                <svg className="w-6 h-6 text-muted mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-muted text-center px-2">Drop photos or click</span>
              </>
            )}
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <p className="text-xs text-muted">First photo is the main image. Max {MAX_VEHICLE_PHOTOS} photos.</p>
    </div>
  );
}
