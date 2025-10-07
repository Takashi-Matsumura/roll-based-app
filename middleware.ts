import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes
  const publicRoutes = ["/", "/login"];
  if (publicRoutes.includes(pathname)) {
    // Redirect authenticated users away from login page
    if (pathname === "/login" && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only routes
  const adminRoutes = ["/admin", "/admin/users"];
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
