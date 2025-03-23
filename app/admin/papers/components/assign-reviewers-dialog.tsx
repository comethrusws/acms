"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, UserPlus, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Reviewer {
  id: string;
  name: string;
  email: string;
}

interface AssignReviewersDialogProps {
  paperId: string;
  currentReviewerIds: string[];
  triggerButton?: React.ReactNode;
  onAssignmentComplete?: () => void;
}

export default function AssignReviewersDialog({
  paperId,
  currentReviewerIds,
  triggerButton,
  onAssignmentComplete
}: AssignReviewersDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableReviewers, setAvailableReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available reviewers
  useEffect(() => {
    if (open) {
      const fetchReviewers = async () => {
        setIsLoading(true);
        try {
          // Debug the currentReviewerIds
          console.log("Current reviewer IDs:", currentReviewerIds);
          
          const response = await fetch('/api/users?role=REVIEWER');
          if (!response.ok) {
            throw new Error('Failed to load reviewers');
          }
          
          const data = await response.json();
          console.log("Fetched reviewers:", data);
          
          // Filter out already assigned reviewers
          const filteredReviewers = data.users.filter(
            (reviewer: Reviewer) => !currentReviewerIds.includes(reviewer.id)
          );
          
          console.log("Filtered reviewers:", filteredReviewers);
          setAvailableReviewers(filteredReviewers);
        } catch (error) {
          console.error("Error fetching reviewers:", error);
          toast.error("Failed to load available reviewers");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchReviewers();
    }
  }, [open, currentReviewerIds]);

  // Handle reviewer selection
  const toggleReviewerSelection = (reviewerId: string) => {
    setSelectedReviewerIds(prev => 
      prev.includes(reviewerId)
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  // Filter reviewers based on search query
  const filteredReviewers = availableReviewers.filter(reviewer => 
    reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reviewer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle assignment submission
  const handleAssignReviewers = async () => {
    if (selectedReviewerIds.length === 0) {
      toast.error("Please select at least one reviewer");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the dedicated assign-reviewers endpoint
      const response = await fetch(`/api/papers/${paperId}/assign-reviewers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewerIds: selectedReviewerIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign reviewers');
      }

      const result = await response.json();
      
      toast.success(`${result.assignedReviewers} reviewer(s) assigned successfully`);
      
      // Close dialog and refresh data
      setOpen(false);
      
      // Refresh the page or call the callback
      if (onAssignmentComplete) {
        onAssignmentComplete();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error assigning reviewers:", error);
      toast.error(error instanceof Error ? error.message : "Failed to assign reviewers");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button id="assign-reviewers-trigger">
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Reviewers
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Reviewers</DialogTitle>
          <DialogDescription>
            Select reviewers to assign to this paper. They will be notified about their new assignment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviewers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <Users className="h-8 w-8 mb-2 mx-auto text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Loading available reviewers...</p>
          </div>
        ) : filteredReviewers.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No reviewers match your search" 
                : "No available reviewers found"}
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-4">
              {filteredReviewers.map((reviewer) => (
                <div
                  key={reviewer.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{reviewer.name}</p>
                      <p className="text-sm text-muted-foreground">{reviewer.email}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedReviewerIds.includes(reviewer.id)}
                    onCheckedChange={() => toggleReviewerSelection(reviewer.id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignReviewers}
            disabled={selectedReviewerIds.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Assigning..." : "Assign Selected Reviewers"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
