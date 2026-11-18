import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validators";
import { consumeRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const ip = clientIpFromHeaders(req.headers);
    const limited = await consumeRateLimit(ip, "enquiry", 5, 3600);
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
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

    const { name, phone, email, message, vehicleId } = result.data;

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
