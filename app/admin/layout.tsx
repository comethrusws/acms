import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Don't apply authentication check on login page
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will be handled by middleware, so we only need to render the layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h1 className="text-xl font-bold">ACMS Admin</h1>
        </div>
        <nav className="mt-5">
          <ul>
            <li>
              <Link 
                href="/admin" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Users
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/papers" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Papers
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/logout" 
                className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
