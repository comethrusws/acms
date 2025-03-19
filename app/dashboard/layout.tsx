import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Determine nav links based on user role
  let roleLinks = [];
  
  switch (user.role) {
    case "ADMIN":
    case "ORGANIZER":
      roleLinks = [
        { href: "/dashboard/papers", label: "Manage Papers" },
        { href: "/dashboard/reviews", label: "Manage Reviews" },
        { href: "/dashboard/schedule", label: "Manage Schedule" },
        { href: "/dashboard/users", label: "Manage Users" },
      ];
      break;
    case "REVIEWER":
      roleLinks = [
        { href: "/dashboard/reviews/assigned", label: "My Assignments" },
      ];
      break;
    case "AUTHOR":
      roleLinks = [
        { href: "/dashboard/papers/my", label: "My Papers" },
        { href: "/dashboard/papers/submit", label: "Submit Paper" },
      ];
      break;
    default: // ATTENDEE
      roleLinks = [
        { href: "/dashboard/registration", label: "My Registration" },
      ];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">ACMS</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Conference Management</p>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            
            {roleLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            <li>
              <Link 
                href="/schedule" 
                className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View Schedule
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
