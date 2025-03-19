'use client'

import { useEffect, useState } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { Search, Filter, MoreHorizontal, Trash2, Star, StarOff, Mail, MailOpen, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InboxPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Example messages data
  const [messages, setMessages] = useState([
    {
      id: "1",
      from: "John Smith",
      email: "john.smith@example.com",
      subject: "Question about paper submission",
      message: "I'm trying to submit my paper but encountering an error. Can you help?",
      date: "2023-08-15T10:30:00Z",
      read: true,
      starred: false,
      category: "support"
    },
    {
      id: "2",
      from: "Sarah Johnson",
      email: "sarah@university.edu",
      subject: "Review assignment concerns",
      message: "I believe I've been assigned too many papers to review. Is it possible to reduce my workload?",
      date: "2023-08-16T14:45:00Z",
      read: false,
      starred: true,
      category: "reviewers"
    },
    {
      id: "3",
      from: "Michael Brown",
      email: "mbrown@research.org",
      subject: "Conference registration issue",
      message: "I've paid for my registration but haven't received a confirmation email yet.",
      date: "2023-08-17T09:15:00Z",
      read: false,
      starred: false,
      category: "registration"
    },
    {
      id: "4",
      from: "Emily Davis",
      email: "emily.davis@tech.com",
      subject: "Sponsorship opportunity",
      message: "Our company would like to sponsor your conference. What packages do you offer?",
      date: "2023-08-18T16:20:00Z",
      read: true,
      starred: true,
      category: "sponsorship"
    },
    {
      id: "5",
      from: "David Wilson",
      email: "dwilson@academy.edu",
      subject: "Deadline extension request",
      message: "Due to some technical difficulties, we'd like to request a 48-hour extension for paper submissions.",
      date: "2023-08-19T11:05:00Z",
      read: false,
      starred: false,
      category: "authors"
    }
  ]);

  // Selected messages for bulk actions
  const [selected, setSelected] = useState([]);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await requireAdmin();
      } catch (error) {
        console.error("Admin check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // If date is today, show only time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If date is within the last week, show day name
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    if (date > lastWeek) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Toggle message read status
  const toggleRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: !msg.read } : msg
    ));
  };

  // Toggle message starred status
  const toggleStarred = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  // Handle message selection
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(msgId => msgId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Select/deselect all messages
  const toggleSelectAll = () => {
    if (selected.length === messages.length) {
      setSelected([]);
    } else {
      setSelected(messages.map(msg => msg.id));
    }
  };

  // Get unread count
  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1">Manage inquiries and communications</p>
        </div>
        {selected.length > 0 ? (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => {
              // Mark selected as read
              setMessages(messages.map(msg => 
                selected.includes(msg.id) ? { ...msg, read: true } : msg
              ));
              setSelected([]);
            }}>
              <MailOpen className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              // Archive selected messages (in a real app)
              // For now just remove from list
              setMessages(messages.filter(msg => !selected.includes(msg.id)));
              setSelected([]);
            }}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              // Delete selected messages
              setMessages(messages.filter(msg => !selected.includes(msg.id)));
              setSelected([]);
            }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            You have {unreadCount} unread messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="authors">Authors</TabsTrigger>
              <TabsTrigger value="reviewers">Reviewers</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="w-10 px-3 py-3 text-left">
                        <Checkbox 
                          checked={selected.length === messages.length && messages.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th scope="col" className="w-10 px-3 py-3 text-left">
                        <span className="sr-only">Star</span>
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="relative px-3 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((message) => (
                      <tr 
                        key={message.id} 
                        className={`hover:bg-gray-50 ${!message.read ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <Checkbox 
                            checked={selected.includes(message.id)}
                            onCheckedChange={() => toggleSelect(message.id)}
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <button onClick={() => toggleStarred(message.id)} className="text-gray-400 hover:text-yellow-400">
                            {message.starred ? 
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : 
                              <StarOff className="h-5 w-5" />
                            }
                          </button>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {message.from}
                          </div>
                          <div className="text-sm text-gray-500">
                            {message.email}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <button 
                            onClick={() => toggleRead(message.id)}
                            className="text-sm text-left hover:underline truncate block max-w-md"
                          >
                            <div className={`font-${message.read ? 'normal' : 'medium'} text-gray-900`}>
                              {message.subject}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {message.message.substring(0, 60)}...
                            </div>
                          </button>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(message.date)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => toggleRead(message.id)}>
                                {message.read ? (
                                  <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark as Unread
                                  </>
                                ) : (
                                  <>
                                    <MailOpen className="mr-2 h-4 w-4" />
                                    Mark as Read
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleStarred(message.id)}>
                                {message.starred ? (
                                  <>
                                    <StarOff className="mr-2 h-4 w-4" />
                                    Remove Star
                                  </>
                                ) : (
                                  <>
                                    <Star className="mr-2 h-4 w-4" />
                                    Star Message
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your inbox is empty.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread">
              <div className="text-center py-4 text-sm text-gray-500">
                View unread messages by switching to the "All" tab and using the filter.
              </div>
            </TabsContent>

            <TabsContent value="starred">
              <div className="text-center py-4 text-sm text-gray-500">
                View starred messages by switching to the "All" tab and using the filter.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
