import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    // Get the authenticated user
    const user = await currentUser();
    const { userId } = await auth();

    // If no user or userId, return unauthorized
    if (!user || !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body to get the role
    const body = await req.json();
    const { role } = body;

    // Validate role input
    if (!role || !["ADMIN", "ORGANIZER", "REVIEWER", "AUTHOR", "ATTENDEE"].includes(role)) {
      return new NextResponse("Invalid role specified", { status: 400 });
    }

    // Check if the user already exists in the database
    let dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser) {
      // Update existing user
      dbUser = await db.user.update({
        where: { clerkId: userId },
        data: { role },
      });
    } else {
      // Create new user
      dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          role,
        },
      });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("ERROR UPDATING USER ROLE:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
