"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SubmitPaper() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: ""
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File too large", {
          description: "The maximum file size is 10MB"
        });
        return;
      }
      setPdfFile(file);
    } else if (file) {
      toast.error("Invalid file", {
        description: "Please upload a PDF file"
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pdfFile) {
      toast.error("Missing PDF", {
        description: "Please upload your paper in PDF format"
      });
      return;
    }
    
    // Validate keywords format
    const keywordsList = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (keywordsList.length === 0) {
      toast.error("Invalid keywords", {
        description: "Please provide at least one keyword, separated by commas"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Show a loading toast
      toast.loading("Uploading paper...");
      
      // Upload PDF file
      const fileFormData = new FormData();
      fileFormData.append("file", pdfFile);
      
      // Custom upload with progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Handle upload completion
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response.fileUrl);
              } catch (error) {
                reject(new Error("Invalid response from server"));
              }
            } else {
              reject(new Error("Failed to upload file"));
            }
          }
        };
      });
      
      // Start upload
      xhr.open('POST', '/api/upload', true);
      xhr.send(fileFormData);
      
      // Wait for upload to complete
      const fileUrl = await uploadPromise;
      
      // Dismiss loading toast
      toast.dismiss();
      toast.loading("Processing submission...");
      
      // Submit paper details to API - passing keywords as a string instead of array
      const paperRes = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords, // Send as string directly
          pdfUrl: fileUrl
        }),
      });
      
      // Handle API response
      if (!paperRes.ok) {
        const errorData = await paperRes.json();
        throw new Error(errorData.message || "Failed to submit paper");
      }
      
      const paperData = await paperRes.json();
      
      // Dismiss all toasts and show success
      toast.dismiss();
      toast.success("Paper submitted successfully!", {
        description: "Your paper has been submitted and will be reviewed."
      });
      
      // Redirect to my papers page
      setTimeout(() => {
        router.push("/dashboard/papers/my");
      }, 1500);
      
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Submission failed", {
        description: error instanceof Error ? error.message : "There was a problem submitting your paper. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/papers/my")}
          className="pl-0 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my papers
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit a Paper</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Submit your research paper for review and potential inclusion in the conference.
        </p>
      </div>
      
      <Card className="p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium">
              Paper Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              required
              placeholder="Enter the title of your paper"
            />
          </div>
          
          <div>
            <label htmlFor="abstract" className="block mb-2 font-medium">
              Abstract <span className="text-red-500">*</span>
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              required
              placeholder="Enter the abstract of your paper"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Provide a comprehensive summary of your research (recommended: 150-250 words).
            </p>
          </div>
          
          <div>
            <label htmlFor="keywords" className="block mb-2 font-medium">
              Keywords <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              required
              placeholder="Enter keywords separated by commas (e.g., Machine Learning, NLP, Neural Networks)"
            />
            <p className="text-xs text-gray-500 mt-1">
              3-5 keywords that describe your research, separated by commas.
            </p>
          </div>
          
          <div>
            <label htmlFor="pdfFile" className="block mb-2 font-medium">
              Paper PDF <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="pdfFile"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {pdfFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {pdfFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-gray-600 dark:text-gray-300 mb-1">
                      Click to upload PDF or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      Max file size: 10MB
                    </span>
                  </div>
                )}
              </label>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Before submitting:
                </h3>
                <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure your paper follows the conference formatting guidelines</li>
                    <li>All authors are listed in the submission</li>
                    <li>Your PDF does not exceed 10MB in size</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/papers/my")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Paper"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
