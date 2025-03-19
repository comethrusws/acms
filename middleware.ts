import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Export as named function 'middleware' using clerkMiddleware
export const middleware = clerkMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/schedule",
    "/contact",
    "/api/webhooks(.*)",
    "/onboarding(.*)",
    "/unauthorized",
    "/admin(.*)" // Make sure admin routes are public
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    try {
      const user = await db.user.findUnique({
        where: { clerkId: auth.userId },
      });

      if (!user) {
        url.pathname = "/onboarding";
        const role = new URL(req.url).searchParams.get("role");
        if (role) {
          url.searchParams.set("role", role);
        }
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  ignoredRoutes: ["/api/upload"]
});

// Keep the Clerk config
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
