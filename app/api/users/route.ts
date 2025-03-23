// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";

// GET users - only accessible to admins
export async function GET(req: Request) {
  try {
    // Check admin authentication using cookie
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");
    const isAdmin = adminSession?.value === "true";
    
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get role parameter from URL if it exists
    const url = new URL(req.url);
    const roleParam = url.searchParams.get('role');
    
    // Build where clause based on role parameter
    const whereClause = roleParam ? { role: roleParam as UserRole } : {};
    
    // Fetch users from the database
    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
