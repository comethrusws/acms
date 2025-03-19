"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SubmitPaper() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: ""
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setIsSubmitting(true);
    
    try {
      // Upload PDF file
      const fileFormData = new FormData();
      fileFormData.append("file", pdfFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileFormData,
      });
      
      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }
      
      const { fileUrl } = await uploadRes.json();
      
      // Submit paper details
      const paperRes = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfUrl: fileUrl
        }),
      });
      
      if (!paperRes.ok) {
        throw new Error("Failed to submit paper");
      }
      
      toast.success("Paper submitted successfully!");
      router.push("/dashboard/papers/my");
      
    } catch (error) {
      console.error(error);
      toast.error("Submission failed", {
        description: "There was a problem submitting your paper. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link 
          href="/dashboard/papers/my"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          ← Back to my papers
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Submit a Paper</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium">
              Paper Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
              placeholder="Enter the title of your paper"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="abstract" className="block mb-2 font-medium">
              Abstract *
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
              placeholder="Enter the abstract of your paper"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="keywords" className="block mb-2 font-medium">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              placeholder="Enter keywords separated by commas"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="pdfFile" className="block mb-2 font-medium">
              Paper PDF *
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {pdfFile ? (
                  <span className="text-blue-600 dark:text-blue-400">
                    {pdfFile.name}
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">
                    Click to upload PDF or drag and drop
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Max file size: 10MB
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
