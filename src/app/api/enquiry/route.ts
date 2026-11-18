import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validators";
import { consumeRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}

export async function POST(req: Request) {
  try {
    const ip = clientIpFromHeaders(req.headers);
    const allowed = await consumeRateLimit("enquiry", ip, 5, 60 * 60 * 1000);
     if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (contentLength > 16_384) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const body = await req.json();

    // Honeypot check
    if (body.companyWebsite && String(body.companyWebsite).trim()) {
      return NextResponse.json({ ok: true }); // silently swallow bots
    }

    const result = enquirySchema.safeParse(body);
    if (!result.success) {
      const first = result.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "Invalid input." }, { status: 422 });
    }

    const { name, phone, email, message, vehicleId, turnstileToken } = result.data;
    if (!(await verifyTurnstile(turnstileToken ?? "", ip))) {
      return NextResponse.json({ error: "Security verification failed. Please try again." }, { status: 403 });
    }

    await prisma.enquiry.create({
      data: {
        name: sanitizeText(name),
        phone: sanitizeText(phone),
        email: email ?? null,
        message,
        vehicleId: vehicleId ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[enquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
