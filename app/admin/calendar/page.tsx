'use client'

import { useEffect, useState } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { CalendarPlus, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Example events data - in a real app this would come from your database
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Paper Submission Deadline",
      date: "2023-09-15",
      type: "deadline",
      description: "Last day for authors to submit their papers"
    },
    {
      id: 2,
      title: "Review Assignment",
      date: "2023-09-20",
      type: "admin",
      description: "Assign papers to reviewers"
    },
    {
      id: 3,
      title: "Review Period Begins",
      date: "2023-09-22",
      type: "period",
      description: "Reviewers can start reviewing assigned papers"
    },
    {
      id: 4,
      title: "Review Deadline",
      date: "2023-10-20",
      type: "deadline",
      description: "All reviews must be completed by reviewers"
    },
    {
      id: 5,
      title: "Committee Meeting",
      date: "2023-10-25",
      type: "meeting",
      description: "Program committee meets to make final decisions"
    },
    {
      id: 6,
      title: "Author Notification",
      date: "2023-11-01",
      type: "notification",
      description: "Authors are notified of acceptance or rejection"
    },
    {
      id: 7,
      title: "Camera-Ready Deadline",
      date: "2023-11-15",
      type: "deadline",
      description: "Final versions of accepted papers due"
    },
    {
      id: 8,
      title: "Conference Begins",
      date: "2023-12-01",
      type: "conference",
      description: "First day of the conference"
    },
  ]);
  
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
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Calendar array - includes empty slots for days before first day of month
  const calendarDays = Array.from(
    { length: firstDayOfMonth },
    () => null
  ).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Get events for the current month
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  // Get month name
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonth];

  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  // Get background color based on event type
  const getEventColor = (type) => {
    switch (type) {
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'conference':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'notification':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage conference schedule and events</p>
        </div>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">{currentMonthName} {currentYear}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="conference">Conference Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Conference Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="p-2 font-semibold text-sm">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === new Date().getDate() && 
                              currentMonth === new Date().getMonth() && 
                              currentYear === new Date().getFullYear();
              
              return (
                <div 
                  key={i} 
                  className={`
                    border p-1 min-h-[100px] 
                    ${day ? 'bg-white' : 'bg-gray-50'} 
                    ${isToday ? 'border-blue-500 border-2' : 'border-gray-100'}
                  `}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>{day}</span>
                        {dayEvents.length > 0 && (
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div 
                            key={event.id}
                            className={`
                              text-xs p-1 rounded truncate border
                              ${getEventColor(event.type)}
                            `}
                            title={event.description}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">{dayEvents.length - 2} more...</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === 'deadline' ? 'bg-red-500' :
                    event.type === 'conference' ? 'bg-green-500' :
                    event.type === 'meeting' ? 'bg-purple-500' :
                    event.type === 'notification' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <p className="text-center text-gray-500 py-4">No upcoming events.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
