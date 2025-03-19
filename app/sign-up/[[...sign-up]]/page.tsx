"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
 
export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  
  useEffect(() => {
    // Store the role in session storage to be used after signup
    if (role) {
      sessionStorage.setItem("selectedRole", role);
    }
  }, [role]);
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl={`/onboarding${role ? `?role=${role}` : ""}`}
        afterSignUpUrl={`/onboarding${role ? `?role=${role}` : ""}`}
      />
    </div>
  );
}
