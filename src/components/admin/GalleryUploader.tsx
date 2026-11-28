"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { addGalleryImage, deleteGalleryImage } from "@/server/gallery-actions";
import { MAX_WEDDING_GALLERY_IMAGES } from "@/lib/constants";
import type { GalleryImage } from "@prisma/client";

export function GalleryUploader({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const weddingImages = images.filter((image) => image.section === "WEDDING");
  const publicWeddingImageIds = new Set(
    weddingImages.slice(0, MAX_WEDDING_GALLERY_IMAGES).map((image) => image.id),
  );

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    const available = MAX_WEDDING_GALLERY_IMAGES - weddingImages.length;
    if (files.length > available) {
      setError(
        available > 0
          ? `Select no more than ${available} image${available === 1 ? "" : "s"}. The public gallery is limited to ${MAX_WEDDING_GALLERY_IMAGES}.`
          : `The public gallery is limited to ${MAX_WEDDING_GALLERY_IMAGES} images. Remove an existing wedding image before adding another.`,
      );
      return;
    }

    setUploading(true);
    setError("");
    let successCount = 0;

    try {
      for (const [index, file] of files.entries()) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data: { url?: unknown; error?: unknown } = await res.json();
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : `Could not upload ${file.name}`);
        }
        if (typeof data.url !== "string" || !data.url) {
          throw new Error(`Upload failed: no image URL returned for ${file.name}`);
        }

        const fd = new FormData();
        fd.set("url", data.url);
        fd.set("alt", file.name.replace(/\.[^.]+$/, ""));
        fd.set("section", "WEDDING");
        fd.set("sortOrder", String(images.length + successCount + index));
        const result = await addGalleryImage(null, fd);
        if (!result.ok) throw new Error(result.error);
        successCount += 1;
      }
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      if (successCount > 0) window.location.reload();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(e.target.files ?? []));
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
      {weddingImages.length > MAX_WEDDING_GALLERY_IMAGES && (
        <p className="mb-4 text-sm text-muted">
          Only the first {MAX_WEDDING_GALLERY_IMAGES} wedding images appear publicly. Remove any extra images below.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-video border border-charcoal-600 rounded-lg overflow-hidden bg-charcoal-700">
            <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="150px" />
            <div className="absolute left-1 top-1 rounded bg-charcoal/80 px-1.5 py-0.5 text-[9px] text-white">
              {img.section === "WEDDING"
                ? publicWeddingImageIds.has(img.id) ? "Shown publicly" : "Not public"
                : img.section}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-red-700 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
              <p className="text-[9px] text-muted truncate">{img.section}</p>
            </div>
          </div>
        ))}
        {weddingImages.length < MAX_WEDDING_GALLERY_IMAGES && <div
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
            void uploadFiles(Array.from(event.dataTransfer?.files ?? []).filter((file) =>
              ["image/jpeg", "image/png", "image/webp"].includes(file.type)
            ));
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
              <span className="text-xs text-muted text-center px-2">Drop photos or click to select</span>
            </>
          )}
          <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
        </div>}
      </div>
    </div>
  );
}
