"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { OnboardingContent } from "./components/onboarding-content";

// Define UserRole enum to match the schema
enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  REVIEWER = "REVIEWER",
  AUTHOR = "AUTHOR",
  ATTENDEE = "ATTENDEE"
}

export default function OnboardingPage() {
  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Choose your role to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<OnboardingFallback />}>
            <OnboardingContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function OnboardingFallback() {
  return (
    <div className="space-y-4 py-2">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-20 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-20 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
      </div>
    </div>
  );
}
