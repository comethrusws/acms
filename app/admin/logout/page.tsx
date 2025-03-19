"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        // Call the logout API route
        await fetch("/api/admin/logout");
        router.push("/admin/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }

    logout();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}
