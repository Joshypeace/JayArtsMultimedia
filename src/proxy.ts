import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 "proxy" (formerly middleware). Must live at src/proxy.ts to run.
export async function proxy(request: NextRequest) {
  // Pick the cookie name from what the browser actually sent. getToken() otherwise
  // guesses from NEXTAUTH_URL, and an http:// value (e.g. copied from local .env)
  // makes it miss the __Secure- cookie on Vercel, bouncing every admin to /login.
  // Large sessions are split into ".0", ".1"... chunks, so match by prefix.
  const secureCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("__Secure-next-auth.session-token"));
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, secureCookie });
  const isLoggedIn = !!token;
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Not logged in and trying to access admin routes
  if (!isLoggedIn && isAdminRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but not an admin/editor
  if (isLoggedIn && isAdminRoute && token.role !== "ADMIN" && token.role !== "EDITOR") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Already logged in and visiting login/register
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
