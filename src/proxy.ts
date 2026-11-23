import { auth } from "@/auth";
import type { NextAuthRequest } from "next-auth";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const authHandler: (
  request: NextAuthRequest,
  event: NextFetchEvent,
) => NextResponse = (request) => {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, private, max-age=0");
    return response;
  }

  if (!request.auth?.user?.email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
};

const authenticatedProxy = auth(authHandler);

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.method === "POST" && request.headers.has("next-action")) {
    return NextResponse.next();
  }

  return authenticatedProxy(request, event);
}

export const config = {
  matcher: ["/admin/:path*"],
};
