import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow public access to demo pages
  if (pathname.startsWith("/demo/")) {
    return NextResponse.next();
  }

  // Protect dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    return withAuth(req as any);
  }

  // Allow all other routes (home page, API routes, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Kinde Auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
