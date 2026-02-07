import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  // Optionally protect specific routes
  // Leave empty to allow all routes by default
  // Add routes you want to protect, e.g., ["/dashboard", "/profile"]
  // For now, we'll keep the app open and add auth UI elements
});

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
