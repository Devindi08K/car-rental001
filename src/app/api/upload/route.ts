import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImageBuffer, destroyCloudinaryImage } from "@/lib/cloudinary";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request) {
  const authError = await requireAdmin();
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: `File exceeds ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit.` }, { status: 413 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(bytes);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "upload_failed";
    if (msg === "unsupported_type") return NextResponse.json({ error: "Only JPG, PNG, and WebP images are accepted." }, { status: 415 });
    if (msg === "file_too_large") return NextResponse.json({ error: "File is too large." }, { status: 413 });
    if (msg === "upload_unavailable") {
      return NextResponse.json({ error: "Image uploads are not configured. Add the Cloudinary credentials to .env.local." }, { status: 503 });
    }
    console.error("[upload POST]", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (contentLength > 16_384) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    const { url } = await req.json();
    if (typeof url !== "string") {
      return NextResponse.json({ error: "Missing url." }, { status: 400 });
    }
    await destroyCloudinaryImage(url);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[upload DELETE]", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
