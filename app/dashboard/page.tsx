import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Different dashboard content based on user role
  let dashboardContent;
  
  switch (user.role) {
    case "ADMIN":
    case "ORGANIZER":
      const paperCount = await db.paper.count();
      const reviewCount = await db.review.count();
      const userCount = await db.user.count();
      const pendingReviewCount = await db.review.count({
        where: { completed: false }
      });
      
      dashboardContent = (
        <div>
          <h2 className="text-2xl font-bold mb-6">Conference Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard title="Papers" value={paperCount.toString()} />
            <DashboardCard title="Reviews" value={reviewCount.toString()} />
            <DashboardCard title="Pending Reviews" value={pendingReviewCount.toString()} />
            <DashboardCard title="Users" value={userCount.toString()} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/dashboard/papers/assign" 
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                  Assign Papers to Reviewers
                </Link>
                <Link 
                  href="/dashboard/schedule/create" 
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                  Create Schedule
                </Link>
                <Link 
                  href="/dashboard/papers/review-status" 
                  className="block w-full text-center bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 py-2 rounded-md"
                >
                  View Review Status
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Needs Attention</h3>
              <AttentionList />
            </div>
          </div>
        </div>
      );
      break;
    
    case "REVIEWER":
      const assignedReviews = await db.review.findMany({
        where: { reviewerId: user.id },
        include: { paper: true }
      });
      
      const completedReviews = assignedReviews.filter(review => review.completed);
      const pendingReviews = assignedReviews.filter(review => !review.completed);
      
      dashboardContent = (
        <div>
          <h2 className="text-2xl font-bold mb-6">Reviewer Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DashboardCard title="Assigned Reviews" value={assignedReviews.length.toString()} />
            <DashboardCard title="Completed" value={completedReviews.length.toString()} />
            <DashboardCard title="Pending" value={pendingReviews.length.toString()} />
          </div>
          
          {pendingReviews.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Pending Reviews</h3>
              <ul className="space-y-3">
                {pendingReviews.map(review => (
                  <li key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <Link 
                      href={`/dashboard/reviews/assigned/${review.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {review.paper.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No pending reviews.</p>
            </div>
          )}
        </div>
      );
      break;
    
    case "AUTHOR":
      const authorPapers = await db.paper.findMany({
        where: { authorId: user.id },
      });
      
      dashboardContent = (
        <div>
          <h2 className="text-2xl font-bold mb-6">Author Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DashboardCard title="My Papers" value={authorPapers.length.toString()} />
            <DashboardCard 
              title="Papers Status" 
              value={
                authorPapers.filter(p => p.status === "ACCEPTED").length + " Accepted / " +
                authorPapers.filter(p => p.status === "REJECTED").length + " Rejected"
              } 
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">My Papers</h3>
              <Link 
                href="/dashboard/papers/submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Submit New Paper
              </Link>
            </div>
            
            {authorPapers.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {authorPapers.map(paper => (
                  <li key={paper.id} className="py-4">
                    <div className="flex justify-between">
                      <Link 
                        href={`/dashboard/papers/my/${paper.id}`}
                        className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
                      >
                        {paper.title}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        paper.status === "ACCEPTED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        paper.status === "REJECTED" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        paper.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}>
                        {paper.status.replace("_", " ")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No papers submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      );
      break;
    
    default: // ATTENDEE
      const registration = await db.registration.findFirst({
        where: { userId: user.id },
      });
      
      dashboardContent = (
        <div>
          <h2 className="text-2xl font-bold mb-6">Attendee Dashboard</h2>
          
          {registration ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Your Registration</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Registration Status:</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    registration.isPaid 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {registration.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>
                
                {registration.isPaid && registration.badgeUrl && (
                  <Link 
                    href={registration.badgeUrl}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    target="_blank"
                  >
                    View Badge
                  </Link>
                )}
                
                {!registration.isPaid && (
                  <Link 
                    href="/dashboard/registration/payment"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Complete Payment
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium mb-4">You haven't registered for the conference yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Register to attend the conference and access all sessions.
              </p>
              <Link 
                href="/dashboard/registration/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
              >
                Register Now
              </Link>
            </div>
          )}
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Conference Schedule</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              View the latest conference schedule and plan your attendance.
            </p>
            <Link 
              href="/schedule"
              className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md block text-center"
            >
              View Schedule
            </Link>
          </div>
        </div>
      );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {dashboardContent}
    </>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

async function AttentionList() {
  // Papers needing manual review for anonymization
  const papersNeedingReview = await db.paper.count({
    where: { needsManualReview: true }
  });
  
  // Reviews that are overdue
  const overdueReviews = await db.review.count({
    where: { 
      completed: false,
      createdAt: {
        lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      }
    }
  });
  
  if (papersNeedingReview === 0 && overdueReviews === 0) {
    return <p className="text-gray-500 dark:text-gray-400">Nothing needs attention right now.</p>;
  }
  
  return (
    <ul className="space-y-3">
      {papersNeedingReview > 0 && (
        <li className="flex items-center text-yellow-800 dark:text-yellow-200">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <Link href="/dashboard/papers/anonymize" className="hover:underline">
            {papersNeedingReview} paper(s) need manual anonymization review
          </Link>
        </li>
      )}
      
      {overdueReviews > 0 && (
        <li className="flex items-center text-red-800 dark:text-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <Link href="/dashboard/reviews/overdue" className="hover:underline">
            {overdueReviews} review(s) are overdue
          </Link>
        </li>
      )}
    </ul>
  );
}
