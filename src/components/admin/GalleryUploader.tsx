"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { addGalleryImage, deleteGalleryImage } from "@/server/gallery-actions";
import type { GalleryImage } from "@prisma/client";

export function GalleryUploader({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data: { url?: unknown; error?: unknown } = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed");
      }
      if (typeof data.url !== "string" || !data.url) {
        throw new Error("Upload failed: no image URL returned.");
      }

      const fd = new FormData();
      fd.set("url", data.url);
      fd.set("alt", file.name.replace(/\.[^.]+$/, ""));
      fd.set("section", "WEDDING");
      fd.set("sortOrder", String(images.length));
      const result = await addGalleryImage(null, fd);
      if (!result.ok) throw new Error(result.error);
      // Refresh page to get new image with id
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const previousImages = images;
    setImages((prev) => prev.filter((i) => i.id !== id));
    const result = await deleteGalleryImage(id);
    if (!result.ok) {
      setImages(previousImages);
      setError(result.error ?? "Failed to delete image.");
    }
  }

  return (
    <div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-video border border-charcoal-600 rounded-lg overflow-hidden bg-charcoal-700">
            <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="150px" />
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-700 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
              <p className="text-[9px] text-muted truncate">{img.section}</p>
            </div>
          </div>
        ))}
        <label className="aspect-video border-2 border-dashed border-charcoal-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 transition-colors bg-charcoal-700">
          {uploading ? (
            <span className="text-xs text-muted">Uploading…</span>
          ) : (
            <>
              <svg className="w-6 h-6 text-muted mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-muted">Upload</span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
