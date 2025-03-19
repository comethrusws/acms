"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// This component captures the role from URL and redirects to the onboarding page with the role parameter
export function RoleRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  
  useEffect(() => {
    // Store the role in session storage to retrieve it after authentication
    if (role) {
      sessionStorage.setItem("selectedRole", role);
    }
  }, [role]);
  
  return null;
}
