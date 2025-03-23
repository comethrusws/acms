import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  FileText, 
  Star, 
  Users, 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Layers, 
  BarChart, 
  ArrowRight,
  Award
} from "lucide-react";

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
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Conference Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard 
              title="Papers" 
              value={paperCount.toString()} 
              icon={<FileText className="h-5 w-5 text-blue-600" />}
              color="blue"
            />
            <DashboardCard 
              title="Reviews" 
              value={reviewCount.toString()} 
              icon={<Star className="h-5 w-5 text-purple-600" />}
              color="purple"
            />
            <DashboardCard 
              title="Pending Reviews" 
              value={pendingReviewCount.toString()} 
              icon={<Clock className="h-5 w-5 text-amber-600" />}
              color="amber"
            />
            <DashboardCard 
              title="Users" 
              value={userCount.toString()} 
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              color="emerald"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold mb-5 flex items-center">
                <Layers className="mr-2 h-5 w-5 text-gray-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/dashboard/papers/assign" 
                  className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Assign Papers to Reviewers
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/dashboard/schedule/create" 
                  className="flex items-center justify-between w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Schedule
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/dashboard/papers/review-status" 
                  className="flex items-center justify-between w-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-3 px-4 rounded-lg transition-colors"
                >
                  <span className="flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Review Status
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold mb-5 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
                Needs Attention
              </h3>
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
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Reviewer Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <DashboardCard 
                title="Assigned Reviews" 
                value={assignedReviews.length.toString()} 
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                color="blue"
              />
              <DashboardCard 
                title="Completed" 
                value={completedReviews.length.toString()} 
                icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
                color="emerald"
              />
              <DashboardCard 
                title="Pending" 
                value={pendingReviews.length.toString()} 
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                color="amber"
              />
            </div>
          </section>
          
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Star className="mr-2 h-5 w-5 text-gray-500" />
                  Pending Reviews
                </h3>
                {pendingReviews.length > 0 && (
                  <Link 
                    href="/dashboard/reviews/assigned"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    View all
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </div>
              
              {pendingReviews.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingReviews.slice(0, 5).map(review => (
                    <li key={review.id} className="py-3 first:pt-0 last:pb-0">
                      <Link 
                        href={`/dashboard/reviews/assigned/${review.id}`}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {review.paper.title}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up! No pending reviews.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      );
      break;
    
    case "AUTHOR":
      const authorPapers = await db.paper.findMany({
        where: { authorId: user.id },
      });
      
      dashboardContent = (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Author Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DashboardCard 
                title="My Papers" 
                value={authorPapers.length.toString()} 
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                color="blue"
              />
              <DashboardCard 
                title="Papers Status" 
                value={
                  `${authorPapers.filter(p => p.status === "ACCEPTED").length} Accepted / 
                   ${authorPapers.filter(p => p.status === "REJECTED").length} Rejected`
                } 
                icon={<Award className="h-5 w-5 text-amber-600" />}
                color="amber"
              />
            </div>
          </section>
          
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-gray-500" />
                  My Papers
                </h3>
                <Link 
                  href="/dashboard/papers/submit"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Submit New Paper
                </Link>
              </div>
              
              {authorPapers.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {authorPapers.map(paper => (
                    <li key={paper.id} className="py-4 first:pt-0">
                      <Link 
                        href={`/dashboard/papers/my/${paper.id}`}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex flex-col flex-grow">
                          <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {paper.title}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Submitted on: {new Date(paper.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                          paper.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                          paper.status === "REJECTED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          paper.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {paper.status.replace("_", " ")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No papers submitted yet.</p>
                  <Link 
                    href="/dashboard/papers/submit"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Submit Your First Paper
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      );
      break;
    
    default: // ATTENDEE
      const registration = await db.registration.findFirst({
        where: { userId: user.id },
      });
      
      dashboardContent = (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Attendee Dashboard</h2>
          
          <section>
            {registration ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-gray-500" />
                  Registration Details
                </h3>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-grow space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registration Status</h4>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${registration.isPaid ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          registration.isPaid 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}>
                          {registration.isPaid ? "Paid" : "Payment Pending"}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registration Date</h4>
                      <p className="font-medium">{new Date(registration.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registration Type</h4>
                      <p className="font-medium capitalize">
                        {/* Use optional chaining and check if type property exists */}
                        {(registration as any)?.type?.toLowerCase() || "Standard"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6 space-y-4">
                    {registration.isPaid && registration.badgeUrl && (
                      <div>
                        <Link 
                          href={registration.badgeUrl}
                          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors w-full justify-center"
                          target="_blank"
                        >
                          <Award className="h-5 w-5 mr-2" />
                          View Digital Badge
                        </Link>
                      </div>
                    )}
                    
                    {!registration.isPaid && (
                      <div>
                        <Link 
                          href="/dashboard/registration/payment"
                          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors w-full justify-center"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Complete Payment
                        </Link>
                      </div>
                    )}
                    
                    <div>
                      <Link
                        href="/dashboard/registration/details"
                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium transition-colors w-full"
                      >
                        View Registration Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Not Registered Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Register now to attend the conference, gain access to all sessions, and network with other attendees.
                </p>
                <Link 
                  href="/dashboard/registration/new"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Register Now
                </Link>
              </div>
            )}
          </section>
          
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
            <h3 className="text-lg font-semibold mb-5 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-500" />
              Conference Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Browse the full schedule to plan your attendance and make the most of the conference experience.
            </p>
            <Link 
              href="/schedule"
              className="flex items-center justify-between w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-blue-700 dark:text-blue-300 py-4 px-4 rounded-lg transition-all border border-blue-100 dark:border-blue-900/30"
            >
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                View Full Schedule
              </span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user.name}
        </p>
      </header>
      {dashboardContent}
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  icon, 
  color = "blue" 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color?: "blue" | "purple" | "amber" | "emerald" | "gray"; 
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    gray: "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`rounded-full p-2.5 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
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
    return (
      <div className="text-center py-8 px-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">All systems running smoothly! Nothing needs your attention.</p>
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {papersNeedingReview > 0 && (
        <li className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center text-amber-800 dark:text-amber-300">
          <div className="h-8 w-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center mr-3 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
          <div className="flex-grow">
            <Link href="/dashboard/papers/anonymize" className="font-medium hover:underline">
              {papersNeedingReview} {papersNeedingReview === 1 ? 'paper needs' : 'papers need'} manual anonymization review
            </Link>
          </div>
        </li>
      )}
      
      {overdueReviews > 0 && (
        <li className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center text-red-800 dark:text-red-300">
          <div className="h-8 w-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center mr-3 flex-shrink-0">
            <Clock className="h-4 w-4 text-red-600 dark:text-red-300" />
          </div>
          <div className="flex-grow">
            <Link href="/dashboard/reviews/overdue" className="font-medium hover:underline">
              {overdueReviews} {overdueReviews === 1 ? 'review is' : 'reviews are'} overdue
            </Link>
          </div>
        </li>
      )}
    </ul>
  );
}
