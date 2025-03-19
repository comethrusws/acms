import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  BarChart4, 
  Calendar, 
  Inbox
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-blue-600 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5" /> 
            ACMS Admin
          </h1>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-2">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Dashboard
            </p>
            <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
            <NavItem href="/admin/analytics" icon={<BarChart4 size={18} />} label="Analytics" />
            <NavItem href="/admin/calendar" icon={<Calendar size={18} />} label="Calendar" />
          </div>
          
          <div className="mt-6 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Content
            </p>
            <NavItem href="/admin/users" icon={<Users size={18} />} label="Users" />
            <NavItem href="/admin/papers" icon={<FileText size={18} />} label="Papers" />
            <NavItem href="/admin/inbox" icon={<Inbox size={18} />} label="Messages" />
          </div>
          
          <div className="mt-6 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin
            </p>
            <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link 
            href="/admin/logout" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="mr-3 h-4 w-4" /> 
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-sm font-medium">Academic Conference Management System</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <div className="relative">
                <Inbox className="h-5 w-5 text-gray-500" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform -translate-y-1/2 translate-x-1/2"></span>
              </div>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 group"
    >
      <span className="mr-3 text-gray-500 group-hover:text-gray-700">{icon}</span>
      {label}
    </Link>
  );
}
