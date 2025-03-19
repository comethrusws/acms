import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }
  
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  });
  
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  
  return user;
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

export async function requireOrganizer() {
  return requireRole([UserRole.ADMIN, UserRole.ORGANIZER]);
}

export async function requireReviewer() {
  return requireRole([UserRole.ADMIN, UserRole.ORGANIZER, UserRole.REVIEWER]);
}

export async function requireAuthor() {
  return requireRole([UserRole.ADMIN, UserRole.AUTHOR]);
}
