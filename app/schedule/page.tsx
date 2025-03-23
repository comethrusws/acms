import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
import Link from "next/link";

// Define interfaces for type safety
interface Paper {
  id: string;
  title: string;
  authors: string;
}

interface Presentation {
  company: string;
  title: string;
  speaker: string;
}

interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  track: string;
  description?: string;
  speaker?: string;
  isFeatured?: boolean;
  papers?: Paper[];
  participants?: string[];
  facilitator?: string;
  presentations?: Presentation[];
}

interface ConferenceDay {
  date: Date;
  sessions: Session[];
}

interface ConferenceData {
  startDate: Date;
  endDate: Date;
  days: ConferenceDay[];
}

export default async function SchedulePage() {
  // Get current user (optional, could be used to highlight sessions they're registered for)
  const user = await getCurrentUser();
  
  // Fetch conference schedule data from the database
  // Sample schedule data (in a real app, this would come from your database)
  const conferenceData: ConferenceData = {
    startDate: new Date("2023-12-01"),
    endDate: new Date("2023-12-05"),
    days: [
      {
        date: new Date("2023-12-01"),
        sessions: [
          {
            id: "1",
            title: "Opening Keynote",
            startTime: "09:00",
            endTime: "10:30",
            location: "Main Hall",
            track: "Plenary",
            speaker: "Prof. Jane Smith",
            description: "Welcome to the conference and overview of recent advances in the field.",
            isFeatured: true,
          },
          {
            id: "2",
            title: "Session A: Machine Learning Applications",
            startTime: "11:00",
            endTime: "12:30",
            location: "Room 101",
            track: "Technical",
            papers: [
              { id: "p1", title: "Deep Learning for Medical Imaging", authors: "Zhang et al." },
              { id: "p2", title: "Reinforcement Learning in Autonomous Systems", authors: "Patel et al." },
              { id: "p3", title: "Transfer Learning for Low-Resource Languages", authors: "Johnson et al." },
            ]
          },
          {
            id: "3",
            title: "Lunch Break",
            startTime: "12:30",
            endTime: "14:00",
            location: "Dining Hall",
            track: "Break",
          },
          {
            id: "4",
            title: "Panel Discussion: Ethics in AI",
            startTime: "14:00",
            endTime: "15:30",
            location: "Main Hall",
            track: "Panel",
            participants: ["Dr. David Lee", "Prof. Maria Garcia", "Dr. Robert Chen", "Dr. Emily Johnson"],
            description: "A discussion on ethical considerations in AI research and applications."
          },
        ]
      },
      {
        date: new Date("2023-12-02"),
        sessions: [
          {
            id: "5",
            title: "Session B: Human-Computer Interaction",
            startTime: "09:00",
            endTime: "10:30",
            location: "Room 102",
            track: "Technical",
            papers: [
              { id: "p4", title: "Adaptive User Interfaces for Accessibility", authors: "Thompson et al." },
              { id: "p5", title: "Evaluating Voice Interfaces for Elderly Users", authors: "Wilson et al." },
              { id: "p6", title: "Gestural Interaction in Virtual Reality", authors: "Brown et al." },
            ]
          },
          {
            id: "6",
            title: "Workshop: Scientific Writing",
            startTime: "11:00",
            endTime: "13:00",
            location: "Workshop Room A",
            track: "Workshop",
            facilitator: "Prof. Sarah Anderson",
            description: "Hands-on workshop on improving scientific writing skills for academic publications."
          },
          {
            id: "7",
            title: "Lunch Break",
            startTime: "13:00",
            endTime: "14:00",
            location: "Dining Hall",
            track: "Break",
          },
          {
            id: "8",
            title: "Industry Presentations",
            startTime: "14:00",
            endTime: "16:00",
            location: "Room 103",
            track: "Industry",
            presentations: [
              { company: "TechCorp", title: "AI in Production Environments", speaker: "Jane Doe, CTO" },
              { company: "DataSystems", title: "Big Data Challenges in 2023", speaker: "John Smith, Lead Scientist" },
            ]
          },
        ]
      },
      // More days can be added...
    ]
  };

  // Get unique tracks for filtering
  const tracks = Array.from(
    new Set(
      conferenceData.days.flatMap(day => 
        day.sessions.map(session => session.track)
      )
    )
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Conference Schedule</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {conferenceData.startDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - 
          {conferenceData.endDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Schedule filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tracks</h3>
                <div className="space-y-2">
                  {tracks.map(track => (
                    <label key={track} className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm">{track}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Days</h3>
                <div className="space-y-2">
                  {conferenceData.days.map((day, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm">
                        {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Schedule content */}
        <main className="flex-grow">
          <div className="space-y-8">
            {conferenceData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800 px-6 py-4">
                  <h2 className="text-xl font-semibold flex items-center text-blue-900 dark:text-blue-100">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    {day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {day.sessions.map((session) => (
                    <div key={session.id} className={`p-6 ${session.isFeatured ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{session.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1.5" />
                            {session.startTime} - {session.endTime}
                          </span>
                          
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1.5" />
                            {session.location}
                          </span>
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {session.track}
                          </span>
                        </div>
                      </div>
                      
                      {/* Session description if available */}
                      {session.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
                          {session.description}
                        </p>
                      )}
                      
                      {/* Speaker information if available */}
                      {session.speaker && (
                        <div className="flex items-center text-sm mb-4">
                          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                          <span className="font-medium">Speaker: {session.speaker}</span>
                        </div>
                      )}

                      {/* Workshop facilitator if available */}
                      {session.facilitator && (
                        <div className="flex items-center text-sm mb-4">
                          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                          <span className="font-medium">Facilitator: {session.facilitator}</span>
                        </div>
                      )}
                      
                      {/* Papers if this is a paper session */}
                      {session.papers && session.papers.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Presentations:</h4>
                          <ul className="space-y-2">
                            {session.papers.map((paper) => (
                              <li key={paper.id} className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                                <Link href={`/papers/${paper.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                  {paper.title}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{paper.authors}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Panel participants if this is a panel */}
                      {session.participants && session.participants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Panelists:</h4>
                          <div className="flex flex-wrap gap-2">
                            {session.participants.map((participant, i) => (
                              <span 
                                key={i} 
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              >
                                {participant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Industry presentations */}
                      {session.presentations && session.presentations.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Industry Presentations:</h4>
                          <ul className="space-y-3">
                            {session.presentations.map((presentation, i) => (
                              <li key={i} className="pl-4 border-l-2 border-green-200 dark:border-green-800">
                                <div className="font-medium">{presentation.title}</div>
                                <div className="text-sm">
                                  <span className="text-gray-700 dark:text-gray-300">{presentation.company}</span>
                                  <span className="text-gray-500 dark:text-gray-400"> — {presentation.speaker}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
