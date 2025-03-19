import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Need to await the cookies() function
  const cookieStore = await cookies();
  
  // Clear the admin session cookie
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
