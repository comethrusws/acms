'use client'

import { useEffect, useState } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { UserPlus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    ADMIN: 0,
    ORGANIZER: 0,
    REVIEWER: 0,
    AUTHOR: 0,
    ATTENDEE: 0
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        await requireAdmin();
        
        // In a real app, you'd fetch users from your API
        // Mock data for demonstration
        const mockUsers = [
          {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "ADMIN",
            createdAt: "2023-06-15T10:00:00Z"
          },
          {
            id: "2",
            name: "Dr. John Smith",
            email: "john.smith@university.edu",
            role: "AUTHOR",
            createdAt: "2023-07-05T15:30:00Z"
          },
          {
            id: "3",
            name: "Prof. Emily Johnson",
            email: "emily.johnson@research.org",
            role: "REVIEWER",
            createdAt: "2023-07-10T09:15:00Z"
          },
          {
            id: "4",
            name: "Sarah Williams",
            email: "sarah@conference.com",
            role: "ORGANIZER",
            createdAt: "2023-06-20T14:45:00Z"
          },
          {
            id: "5",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            role: "ATTENDEE",
            createdAt: "2023-08-01T11:30:00Z"
          },
          {
            id: "6",
            name: "Dr. Lisa Chen",
            email: "lisa.chen@science.edu",
            role: "AUTHOR",
            createdAt: "2023-07-25T16:20:00Z"
          },
          {
            id: "7",
            name: "Prof. Robert Miller",
            email: "robert.miller@university.edu",
            role: "REVIEWER",
            createdAt: "2023-07-15T08:45:00Z"
          },
          {
            id: "8",
            name: "James Wilson",
            email: "james@attendee.com",
            role: "ATTENDEE",
            createdAt: "2023-08-05T10:15:00Z"
          },
          {
            id: "9",
            name: "Dr. Amanda Taylor",
            email: "amanda.taylor@research.org",
            role: "AUTHOR",
            createdAt: "2023-07-20T13:10:00Z"
          },
          {
            id: "10",
            name: "Thomas Garcia",
            email: "thomas@conference.com",
            role: "ATTENDEE",
            createdAt: "2023-08-03T09:30:00Z"
          }
        ];
        
        setUsers(mockUsers);
        
        // Calculate counts by role
        const counts = {
          total: mockUsers.length,
          ADMIN: mockUsers.filter(user => user.role === "ADMIN").length,
          ORGANIZER: mockUsers.filter(user => user.role === "ORGANIZER").length,
          REVIEWER: mockUsers.filter(user => user.role === "REVIEWER").length,
          AUTHOR: mockUsers.filter(user => user.role === "AUTHOR").length,
          ATTENDEE: mockUsers.filter(user => user.role === "ATTENDEE").length
        };
        
        setUserCounts(counts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading users:", error);
        setIsLoading(false);
      }
    };
    
    checkAdminAndFetchData();
  }, [router]);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.ADMIN}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.AUTHOR}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.REVIEWER}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.ATTENDEE}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and roles.</CardDescription>
          
          <div className="flex items-center gap-2 mt-2">
            <Input className="max-w-sm" placeholder="Search users..." />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === "ADMIN" ? "destructive" : 
                        user.role === "ORGANIZER" ? "default" :
                        user.role === "REVIEWER" ? "secondary" :
                        user.role === "AUTHOR" ? "primary" :
                        'outline'
                      }>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
