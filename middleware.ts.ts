// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/article", "/category", "/dashboard", "/admin"];
const adminRoutes = ["/category", "/Admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ambil cookie token dan role
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // kalau belum login & akses route protected → redirect ke /sign-in
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // kalau user role tapi akses halaman admin → redirect ke /article
  if (role === "User" && adminRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/article", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/article/:path*",
    "/categories/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
