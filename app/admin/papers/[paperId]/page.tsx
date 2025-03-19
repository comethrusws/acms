'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { ArrowLeft, Download, FileText, Users, CheckCircle, XCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paper, setPaper] = useState(null);
  
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        await requireAdmin();
        
        // In a real app, you'd fetch the specific paper from the API
        // For demo purposes, we'll create mock data
        setPaper({
          id: params.paperId,
          title: "Advances in Natural Language Processing for Academic Research",
          abstract: "This paper explores recent advancements in natural language processing (NLP) techniques that can assist academic research. We demonstrate how transformer models, semantic analysis, and automated summarization can enhance literature reviews, data extraction, and knowledge discovery across multiple disciplines. Our experiments show significant improvements in research efficiency and accuracy when utilizing these NLP tools.",
          keywords: ["NLP", "machine learning", "academic research", "text analysis", "AI"],
          status: "UNDER_REVIEW",
          createdAt: "2023-08-10T14:30:00Z",
          updatedAt: "2023-08-10T14:30:00Z",
          pdfUrl: "/papers/sample-paper.pdf", // In a real app, this would point to the actual PDF
          author: {
            id: "user123",
            name: "Dr. Jane Smith",
            email: "jane.smith@university.edu",
            institution: "University of Technology"
          },
          reviews: [
            {
              id: "review1",
              reviewerId: "reviewer1",
              reviewerName: "Prof. Robert Johnson",
              score: 8,
              comments: "Excellent paper with strong methodology. The results are convincing and the literature review is comprehensive. Some minor issues with presentation in Section 4.",
              completed: true,
              createdAt: "2023-08-15T10:20:00Z",
              updatedAt: "2023-08-17T11:45:00Z"
            },
            {
              id: "review2",
              reviewerId: "reviewer2",
              reviewerName: "Dr. Amanda Chen",
              score: 7,
              comments: "Good contribution to the field. The methodology is sound, but I would recommend adding more empirical evidence in future work.",
              completed: true,
              createdAt: "2023-08-15T10:20:00Z",
              updatedAt: "2023-08-18T09:30:00Z"
            },
            {
              id: "review3",
              reviewerId: "reviewer3",
              reviewerName: "Dr. Michael Lee",
              score: null,
              comments: "",
              completed: false,
              createdAt: "2023-08-15T10:20:00Z",
              updatedAt: "2023-08-15T10:20:00Z"
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching paper:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminAndFetchData();
  }, [params.paperId]);

  // Calculate average review score
  const calculateAverageScore = () => {
    if (!paper) return 0;
    
    const completedReviews = paper.reviews.filter(r => r.completed);
    if (completedReviews.length === 0) return 0;
    
    const sum = completedReviews.reduce((acc, r) => acc + r.score, 0);
    return (sum / completedReviews.length).toFixed(1);
  };

  // Handle changing paper status
  const updatePaperStatus = (newStatus) => {
    setPaper({
      ...paper,
      status: newStatus
    });
    // In a real app, you would make an API call here to update the status
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center py-10">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Paper not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The paper you are looking for does not exist or you don't have permission to view it.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push('/admin/papers')}>
            Back to Papers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/papers')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Papers
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{paper.title}</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={
              paper.status === 'ACCEPTED' ? 'success' :
              paper.status === 'REJECTED' ? 'destructive' :
              paper.status === 'UNDER_REVIEW' ? 'warning' :
              'outline'
            }>
              {paper.status.replace("_", " ")}
            </Badge>
            <p className="text-sm text-gray-500">
              Submitted on {new Date(paper.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="success">
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Paper
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept this paper?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the paper as accepted and notify the author. 
                  This action can be reversed later if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => updatePaperStatus('ACCEPTED')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept Paper
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject Paper
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject this paper?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the paper as rejected and notify the author. 
                  This action can be reversed later if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => updatePaperStatus('REJECTED')}
                >
                  Reject Paper
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({paper.reviews.length})</TabsTrigger>
          <TabsTrigger value="assignment">Reviewer Assignment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{paper.abstract}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {paper.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Author Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{paper.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{paper.author.name}</p>
                    <p className="text-sm text-gray-500">{paper.author.email}</p>
                    <p className="text-sm text-gray-500">{paper.author.institution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Review Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paper.reviews.filter(r => r.completed).length}/{paper.reviews.length} Reviews
                </div>
                <p className="text-sm text-gray-500">
                  Average Score: {calculateAverageScore()}/10
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${paper.reviews.filter(r => r.completed).length / paper.reviews.length * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Decision</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={paper.status} onValueChange={updatePaperStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="REVISIONS_REQUESTED">Revisions Requested</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date(paper.updatedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
              <CardDescription>
                {paper.reviews.filter(r => r.completed).length} of {paper.reviews.length} reviews completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paper.reviews.map((review, index) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.reviewerName}</p>
                        <p className="text-sm text-gray-500">
                          {review.completed ? 
                            `Reviewed on ${new Date(review.updatedAt).toLocaleDateString()}` : 
                            'Review pending'
                          }
                        </p>
                      </div>
                    </div>
                    {review.completed ? (
                      <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                        Score: {review.score}/10
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  
                  {review.completed && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Comments:</h4>
                      <p className="text-gray-700 text-sm">{review.comments}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {paper.reviews.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500">No reviews assigned yet.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Assign Additional Reviewers
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignment">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Assignment</CardTitle>
              <CardDescription>
                Assign reviewers to this paper based on their expertise and availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <p className="text-muted-foreground">
                  Reviewer assignment component would go here.
                  <br />
                  This would include a list of available reviewers and their expertise.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Paper History</CardTitle>
              <CardDescription>
                Track changes and actions taken on this paper.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-200 ml-3">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    <FileText className="h-3 w-3 text-blue-800" />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">Paper Submitted</h3>
                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{new Date(paper.createdAt).toLocaleString()}</time>
                  <p className="text-sm font-normal text-gray-500">Paper was submitted by {paper.author.name}.</p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
                    <Users className="h-3 w-3 text-yellow-800" />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">Reviewers Assigned</h3>
                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{new Date(paper.createdAt).toLocaleString()}</time>
                  <p className="text-sm font-normal text-gray-500">{paper.reviews.length} reviewers were assigned to evaluate this paper.</p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckCircle className="h-3 w-3 text-green-800" />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">Status Changed to Under Review</h3>
                  <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{new Date(paper.updatedAt).toLocaleString()}</time>
                  <p className="text-sm font-normal text-gray-500">Paper status was updated to 'Under Review'.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
