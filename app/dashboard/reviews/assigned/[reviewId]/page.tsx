"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewDetail() {
  const params = useParams();
  const router = useRouter();
  const { reviewId } = params;
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    score: "",
    comments: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/reviews/${reviewId}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch review details");
        }
        
        const data = await res.json();
        setReview(data.review);
        
        if (data.review.completed) {
          setFormData({
            score: data.review.score.toString(),
            comments: data.review.comments || ""
          });
        }
      } catch (err) {
        setError("Error loading review. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (reviewId) {
      fetchReview();
    }
  }, [reviewId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          score: parseInt(formData.score),
          comments: formData.comments,
          completed: true
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit review");
      }
      
      const data = await res.json();
      setReview(data.review);
      
      // Show success message and redirect
      alert("Review submitted successfully!");
      router.push("/dashboard/reviews/assigned");
      
    } catch (err) {
      setError("Error submitting review. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !review) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {error || "Review not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link 
          href="/dashboard/reviews/assigned"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          ← Back to assignments
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Review Paper</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">{review.paper.title}</h2>
        
        <div className="mb-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">Abstract</h3>
          <p className="text-gray-900 dark:text-gray-100">{review.paper.abstract}</p>
        </div>
        
        <div>
          <a 
            href={review.paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md inline-block"
          >
            View Paper PDF
          </a>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">
          {review.completed ? "Your Review" : "Submit Your Review"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="score" className="block mb-2 font-medium">
              Score (1-10) *
            </label>
            <select
              id="score"
              name="score"
              value={formData.score}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
              disabled={review.completed}
            >
              <option value="">Select a score</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <option key={score} value={score}>
                  {score} - {score < 4 ? 'Poor' : score < 7 ? 'Average' : score < 9 ? 'Good' : 'Excellent'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-8">
            <label htmlFor="comments" className="block mb-2 font-medium">
              Comments *
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={8}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
              disabled={review.completed}
              placeholder="Provide detailed feedback on the paper's strengths, weaknesses, and suggestions for improvement..."
            ></textarea>
          </div>
          
          {!review.completed && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
