import { Activity, Users, FileText, Settings, ArrowRight, TrendingUp, Clock, Calendar } from "lucide-react";

// Import these components after creating them in the shadcn setup
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to ACMS Admin Panel</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          New Conference
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Papers Submitted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +24%
              </span> from last conference
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> 12 days remaining
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-md">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>Users Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-500">
              Manage system users, assign roles and permissions. View registered users and their activity.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/admin/users">
                View Users <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-md">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle>Paper Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-500">
              Review submitted papers, assign reviewers, and track review status. Manage conference submissions.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/admin/papers">
                View Papers <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-md">
                <Settings className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle>System Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-500">
              Configure application settings, manage email templates, and adjust system preferences.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/admin/settings">
                View Settings <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
