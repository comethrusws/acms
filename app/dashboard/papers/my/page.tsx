"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyPapers() {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch("/api/papers");
        
        if (!res.ok) {
          throw new Error("Failed to fetch papers");
        }
        
        const data = await res.json();
        setPapers(data.papers);
      } catch (err) {
        setError("Error loading papers. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPapers();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2.5 py-0.5 rounded-full">
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2.5 py-0.5 rounded-full">
            Rejected
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2.5 py-0.5 rounded-full">
            Under Review
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs px-2.5 py-0.5 rounded-full">
            Submitted
          </span>
        );
    }
  };
  
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Papers</h1>
        <Link 
          href="/dashboard/papers/submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Submit New Paper
        </Link>
      </div>
      
      {papers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Papers Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't submitted any papers yet. Start by submitting your first paper.
          </p>
          <Link 
            href="/dashboard/papers/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            Submit Paper
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reviews
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {papers.map((paper) => (
                <tr key={paper.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {paper.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusBadge(paper.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {paper.reviews ? `${paper.reviews.filter(r => r.completed).length}/${paper.reviews.length}` : "0/0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/papers/my/${paper.id}`}
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
    </div>
  );
}
