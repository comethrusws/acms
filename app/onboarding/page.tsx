"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

// Define UserRole enum to match the schema
enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  REVIEWER = "REVIEWER",
  AUTHOR = "AUTHOR",
  ATTENDEE = "ATTENDEE"
}

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, user } = useUser();
  
  // Get role from URL query param if present
  useEffect(() => {
    const role = searchParams.get("role");
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      setSelectedRole(role as UserRole);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role", {
        description: "You must select a role to continue"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update role: ${errorText}`);
      }

      toast.success("Welcome aboard!", {
        description: `You're now registered as a${selectedRole === UserRole.ADMIN ? "n" : ""} ${selectedRole.toLowerCase()}`
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Error", {
        description: "There was a problem updating your role"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Select your primary role in the conference system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup
              value={selectedRole || ""}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="AUTHOR" id="author" />
                <Label htmlFor="author" className="flex-1 cursor-pointer">
                  <div className="font-medium">Author</div>
                  <p className="text-sm text-gray-500">Submit papers to the conference</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="REVIEWER" id="reviewer" />
                <Label htmlFor="reviewer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Reviewer</div>
                  <p className="text-sm text-gray-500">Review submitted papers</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="ATTENDEE" id="attendee" />
                <Label htmlFor="attendee" className="flex-1 cursor-pointer">
                  <div className="font-medium">Attendee</div>
                  <p className="text-sm text-gray-500">Attend the conference and access materials</p>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="pt-4">
              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
