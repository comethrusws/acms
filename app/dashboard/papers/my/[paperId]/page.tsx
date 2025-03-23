// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function PaperDetail() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        // First, get all papers
        const res = await fetch("/api/papers");
        
        if (!res.ok) {
          throw new Error("Failed to fetch papers");
        }
        
        const data = await res.json();
        
        // Find the specific paper by ID
        const foundPaper = data.papers.find(p => p.id === params.paperId);
        
        if (!foundPaper) {
          throw new Error("Paper not found");
        }
        
        setPaper(foundPaper);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading paper details");
        toast.error("Failed to load paper", {
          description: err.message || "Could not retrieve paper details"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [params.paperId]);
  
  const getStatusBadge = (status) => {
    const statusClasses = {
      ACCEPTED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      UNDER_REVIEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      SUBMITTED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    };
    
    const statusText = status.replace("_", " ");
    const statusClass = statusClasses[status] || statusClasses.SUBMITTED;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {statusText}
      </span>
    );
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "UNDER_REVIEW":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !paper) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/papers/my")}
          className="pl-0 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my papers
        </Button>
        
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Paper Not Found</h2>
          <p className="text-gray-500 mb-6">
            {error || "The paper you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <Button onClick={() => router.push("/dashboard/papers/my")}>
            Return to My Papers
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/dashboard/papers/my")}
        className="pl-0 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to my papers
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{paper.title}</h1>
        <div>
          {getStatusBadge(paper.status)}
        </div>
      </div>
      
      <Card className="shadow-md mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 p-6 items-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mr-4">
            {getStatusIcon(paper.status)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status: {paper.status.replace("_", " ")}</h2>
            <p className="text-gray-500 text-sm">
              Submitted on {new Date(paper.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Abstract</h3>
            <p className="text-gray-700 dark:text-gray-300">{paper.abstract}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.split(',').map((keyword, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Paper PDF</h3>
            <Button 
              variant="outline" 
              asChild 
              className="flex items-center"
            >
              <a 
                href={paper.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4" />
                View PDF
              </a>
            </Button>
          </div>
          
          {paper.reviews && paper.reviews.length > 0 && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Review Status</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {paper.reviews.filter(r => r.completed).length} of {paper.reviews.length} reviews completed
                </p>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${paper.reviews.filter(r => r.completed).length / paper.reviews.length * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
