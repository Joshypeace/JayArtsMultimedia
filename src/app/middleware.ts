import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAuthRoute = 
      req.nextUrl.pathname === "/admin/login" || 
      req.nextUrl.pathname === "/admin/register";

    // Redirect logged-in users away from auth pages
    if (token && isAuthRoute) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // For admin routes, check user role
    if (token && isAdminRoute && !isAuthRoute) {
      const allowedRoles = ["ADMIN", "EDITOR"];
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAuthRoute = 
          req.nextUrl.pathname === "/admin/login" || 
          req.nextUrl.pathname === "/admin/register";

        // Allow access to auth pages without token
        if (isAuthRoute) return true;

        // Require token for other admin routes
        if (isAdminRoute) {
          return !!token;
        }

        // Public routes
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};