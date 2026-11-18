import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";

export function detectImageType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

function configured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function client() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function cloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "res.cloudinary.com" ||
      !cloudName
    ) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] !== cloudName) return null;
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    let rest = parts.slice(uploadIndex + 1);
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    const publicId = rest.join("/").replace(/\.[a-z0-9]+$/i, "");
    return publicId.startsWith("mahawaththa/") ? publicId : null;
  } catch {
    return null;
  }
}

export async function destroyCloudinaryImage(url: string) {
  const publicId = cloudinaryPublicId(url);
  if (!publicId || !configured()) return;
  try {
    await client().uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("cloudinary_destroy_failed", error);
  }
}

export async function uploadImageBuffer(bytes: Buffer) {
  if (!configured()) {
    console.error("cloudinary_not_configured");
    throw new Error("upload_unavailable");
  }
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("file_too_large");
  }
  const type = detectImageType(new Uint8Array(bytes));
  if (!type) throw new Error("unsupported_type");

  const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
    const stream = client().uploader.upload_stream(
      {
        folder: "mahawaththa",
        public_id: randomUUID(),
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
        overwrite: false,
      },
      (error, uploaded) => {
        if (error || !uploaded?.secure_url) reject(error ?? new Error("upload_failed"));
        else resolve(uploaded);
      },
    );
    stream.end(bytes);
  });

  if (!result.secure_url) throw new Error("upload_failed");
  return result.secure_url;
}
