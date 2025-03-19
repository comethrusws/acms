import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

// This function will handle custom admin authentication
async function adminAuthMiddleware(req: NextRequest) {
  const adminSessionCookie = req.cookies.get("admin_session")?.value;
  const path = req.nextUrl.pathname;
  
  // Always allow access to admin login page and associated resources
  if (path === "/admin/login" || 
      path.startsWith("/admin/login/") || 
      path.includes("_next")) {
    return NextResponse.next();
  }
  
  // Check if path starts with /admin and user is not authenticated
  if (path.startsWith("/admin") && adminSessionCookie !== "true") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  
  return NextResponse.next();
}

// The middleware function must handle both req and event arguments
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Handle admin routes with custom auth before Clerk
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(req);
  }
  
  // For non-admin routes, use Clerk middleware with both arguments
  return clerkMiddleware()(req, event);
}

export const config = {
  matcher: [
    // Match the root path
    '/',
    // Handle all admin routes
    '/admin(.*)',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
