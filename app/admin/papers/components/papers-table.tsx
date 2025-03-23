"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, FileText, Download, CheckCircle, XCircle, Clock } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define types for papers
interface Author {
  id: string;
  name: string;
  email: string;
}

interface Review {
  id: string;
  score: number;
  completed: boolean;
  comments?: string;
  reviewerId?: string;
}

interface Paper {
  id: string;
  title: string;
  abstract: string;
  keywords: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUESTED';
  pdfUrl: string;
  anonymizedPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: Author;
  reviews?: Review[];
}

export default function PapersTable({ initialPapers }: { initialPapers: Paper[] }) {
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Client-side function to handle status changes
  const handleStatusChange = async (paperId: string, newStatus: Paper['status']) => {
    if (isUpdatingStatus) return;
    
    try {
      setIsUpdatingStatus(true);
      toast.loading(`Updating paper status...`);
      
      const res = await fetch(`/api/papers/${paperId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to update paper status");
      }
      
      // Update local state
      setPapers(papers.map(paper => 
        paper.id === paperId ? { ...paper, status: newStatus } : paper
      ));
      
      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success(`Paper status updated to ${newStatus.replace('_', ' ')}`);
      
      // Refresh the router to get latest data
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Failed to update paper status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.map((paper) => (
            <TableRow key={paper.id}>
              <TableCell className="font-medium">{paper.title}</TableCell>
              <TableCell>{paper.author?.name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge variant={
                  paper.status === 'ACCEPTED' ? 'default' :
                  paper.status === 'REJECTED' ? 'destructive' :
                  paper.status === 'UNDER_REVIEW' ? 'outline' :
                  'outline'
                }>
                  {paper.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{new Date(paper.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isUpdatingStatus}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/papers/${paper.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={paper.pdfUrl || '#'} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => handleStatusChange(paper.id, 'ACCEPTED')}
                      disabled={isUpdatingStatus || paper.status === 'ACCEPTED'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Accept Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleStatusChange(paper.id, 'REJECTED')}
                      disabled={isUpdatingStatus || paper.status === 'REJECTED'}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Reject Paper
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleStatusChange(paper.id, 'UNDER_REVIEW')}
                      disabled={isUpdatingStatus || paper.status === 'UNDER_REVIEW'}
                    >
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      Set as Under Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
