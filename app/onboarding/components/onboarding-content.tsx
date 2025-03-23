"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export function OnboardingContent() {
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
        const error = await response.json();
        throw new Error(error.message || "Failed to update role");
      }

      toast.success("Profile updated successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update profile", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <RadioGroup value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value as UserRole)}>
        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="AUTHOR" id="author" />
          <Label htmlFor="author" className="flex-1 cursor-pointer">
            <div className="font-medium">Author</div>
            <p className="text-sm text-gray-500">Submit and manage your papers</p>
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
              Updating...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
