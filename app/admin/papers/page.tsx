import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { Search, Filter } from "lucide-react";
import { Suspense } from "react";
import { PaperStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PapersTable from "./components/papers-table";

// Define interface for processed papers to ensure type safety
interface ProcessedPaper {
  id: string;
  title: string;
  abstract: string;
  keywords: string;
  status: PaperStatus;
  pdfUrl: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default async function PapersPage() {
  await requireAdmin();
  
  // Fetch papers with pagination and include author info
  const papers = await db.paper.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: true
    }
  });

  // Get papers count by status
  const paperCount = await db.paper.count();
  const submittedCount = await db.paper.count({ where: { status: 'SUBMITTED' } });
  const underReviewCount = await db.paper.count({ where: { status: 'UNDER_REVIEW' } });
  const acceptedCount = await db.paper.count({ where: { status: 'ACCEPTED' } });
  const rejectedCount = await db.paper.count({ where: { status: 'REJECTED' } });

  // Process papers to ensure they match the expected Paper type with proper serialization
  const processedPapers: ProcessedPaper[] = papers.map(paper => ({
    ...paper,
    keywords: paper.keywords || '',  // Convert null to empty string
    createdAt: paper.createdAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString(),
    author: paper.author ? {
      ...paper.author,
      createdAt: paper.author.createdAt.toISOString(),
      updatedAt: paper.author.updatedAt.toISOString()
    } : undefined
  }));

  // Create token for client-side API access
  // This is just a placeholder - in a real app, you would use a proper auth token
  // or you would handle the API calls on the server side

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Papers</h1>
          <p className="text-muted-foreground mt-1">Manage conference papers and submissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/papers/assignments">
            Manage Assignments
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Papers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paperCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Papers Management</CardTitle>
          <CardDescription>
            View and manage all conference paper submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Papers</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="review">Under Review</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search papers..." className="pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </div>
              
              <Suspense fallback={<div>Loading papers...</div>}>
                {/* Add a key to force re-render when papers change */}
                <div key={`papers-${processedPapers.length}`}>
                  <PapersTable initialPapers={processedPapers} />
                </div>
              </Suspense>
              
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </TabsContent>
            
            {/* Other tabs will have similar content */}
            <TabsContent value="submitted">
              <div className="p-4 text-center text-muted-foreground">
                Change to the "All Papers" tab and use the filter options to view submitted papers.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
