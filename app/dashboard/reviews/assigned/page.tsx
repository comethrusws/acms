"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AssignedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews/assigned");
        
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        
        const data = await res.json();
        setReviews(data.reviews);
      } catch (err) {
        setError("Error loading reviews. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  // Split reviews into pending and completed
  const pendingReviews = reviews.filter(review => !review.completed);
  const completedReviews = reviews.filter(review => review.completed);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Review Assignments</h1>
      
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Review Assignments</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You haven't been assigned any papers to review yet.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Pending Reviews ({pendingReviews.length})</h2>
          {pendingReviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8 text-center text-gray-500 dark:text-gray-400">
              No pending reviews.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Paper Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.paper?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/reviews/assigned/${review.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                          Review Now
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-4">Completed Reviews ({completedReviews.length})</h2>
          {completedReviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center text-gray-500 dark:text-gray-400">
              No completed reviews.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Paper Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completed Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Your Score
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {completedReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.paper?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {review.score}/10
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/reviews/assigned/${review.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
