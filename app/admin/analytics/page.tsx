'use client'

import { useEffect, useState } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { BarChart3, LineChart, PieChart, Calendar, Download, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    paperCount: 0,
    reviewCount: 0,
    usersByRole: [
      { role: "Authors", count: 0 },
      { role: "Reviewers", count: 0 },
      { role: "Attendees", count: 0 },
      { role: "Organizers", count: 0 },
      { role: "Admins", count: 0 },
    ],
    papersByStatus: [
      { status: "Submitted", count: 0 },
      { status: "Under Review", count: 0 },
      { status: "Accepted", count: 0 },
      { status: "Rejected", count: 0 },
    ]
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        await requireAdmin();
        
        // In a real app, you'd fetch this data from your API
        // For now we'll use mock data
        setStats({
          userCount: 573,
          paperCount: 248,
          reviewCount: 518,
          usersByRole: [
            { role: "Authors", count: 320 },
            { role: "Reviewers", count: 115 },
            { role: "Attendees", count: 130 },
            { role: "Organizers", count: 5 },
            { role: "Admins", count: 3 },
          ],
          papersByStatus: [
            { status: "Submitted", count: 58 },
            { status: "Under Review", count: 79 },
            { status: "Accepted", count: 83 },
            { status: "Rejected", count: 28 },
          ]
        });
      } catch (error) {
        console.error("Error in analytics setup:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminAndFetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Data insights and statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-1 bg-blue-100 rounded-md">
              <BarChart3 className="h-4 w-4 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.userCount > 0 ? `${stats.usersByRole[0].count} authors, ${stats.usersByRole[1].count} reviewers` : "No users yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Papers</CardTitle>
            <div className="p-1 bg-amber-100 rounded-md">
              <PieChart className="h-4 w-4 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paperCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paperCount > 0 ? `${stats.papersByStatus[2].count} accepted, ${stats.papersByStatus[3].count} rejected` : "No papers yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <div className="p-1 bg-green-100 rounded-md">
              <LineChart className="h-4 w-4 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reviewCount > 0 ? `Average score: 7.4/10` : "No reviews yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>
            Distribution of users across different roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
            <p className="text-muted-foreground text-center">
              User distribution chart will be displayed here.
              <br />
              (Using a chart library like Chart.js or Recharts would be implemented here)
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {stats.usersByRole.map((item, i) => (
              <Card key={i} className="p-2 text-center">
                <p className="text-xs text-muted-foreground">{item.role}</p>
                <p className="text-lg font-bold">{item.count}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paper Submissions</CardTitle>
            <CardDescription>
              Number of papers submitted over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
              <p className="text-muted-foreground text-center">
                Submission trend chart will be displayed here.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Paper Status</CardTitle>
            <CardDescription>
              Distribution of papers by their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
              <p className="text-muted-foreground text-center">
                Paper status chart will be displayed here.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {stats.papersByStatus.map((item, i) => (
                <Card key={i} className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                  <p className="text-lg font-bold">{item.count}</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
