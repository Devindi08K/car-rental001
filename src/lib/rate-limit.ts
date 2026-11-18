import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

function hashKey(scope: string, value: string) {
  return createHash("sha256")
    .update(`${scope}|${value}|${process.env.AUTH_SECRET ?? "dev"}`)
    .digest("hex");
}

export function clientIpFromHeaders(headerStore: { get(name: string): string | null }) {
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  return ip.slice(0, 80);
}

export async function consumeRateLimit(scope: string, identity: string, limit: number, windowMs: number) {
  const key = hashKey(scope, identity);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const bucket = await tx.rateLimitBucket.findUnique({ where: { key } });
    if (!bucket || now.getTime() - bucket.windowStart.getTime() > windowMs) {
      await tx.rateLimitBucket.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      return true;
    }
    if (bucket.count >= limit) return false;
    await tx.rateLimitBucket.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return true;
  });
}

function throttleKeys(email: string, ip: string) {
  return [hashKey("login-email", email), hashKey("login-ip", ip)];
}

export async function assertLoginAllowed(email: string, ip: string) {
  const keys = throttleKeys(email, ip);
  const rows = await prisma.loginThrottle.findMany({ where: { key: { in: keys } } });
  const now = Date.now();
  const locked = rows.some((row) => row.lockedUntil && row.lockedUntil.getTime() > now);
  const failures = rows.reduce((max, row) => Math.max(max, row.failures), 0);
  return { ok: !locked, failures };
}

export async function recordLoginFailure(email: string, ip: string) {
  const keys = throttleKeys(email, ip);
  for (const key of keys) {
    const existing = await prisma.loginThrottle.findUnique({ where: { key } });
    const failures = (existing?.failures ?? 0) + 1;
    await prisma.loginThrottle.upsert({
      where: { key },
      create: {
        key,
        failures,
        lockedUntil: failures >= MAX_FAILURES ? new Date(Date.now() + LOCK_MS) : null,
      },
      update: {
        failures,
        lockedUntil: failures >= MAX_FAILURES ? new Date(Date.now() + LOCK_MS) : null,
      },
    });
  }
}

export async function recordLoginSuccess(email: string, ip: string) {
  await prisma.loginThrottle.deleteMany({ where: { key: { in: throttleKeys(email, ip) } } });
}

export function failureDelay(failures: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.min(800 + failures * 400, 5000));
  });
}
