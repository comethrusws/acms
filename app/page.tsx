import Image from "next/image";
import Link from "next/link";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/conference-logo.svg" 
              alt="ACMS Logo" 
              width={40} 
              height={40}
              className="dark:invert"
            />
            <h1 className="text-xl font-bold">Academic Conference Management System</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link 
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Streamlining Academic Conferences</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            A comprehensive platform for paper submissions, double-blind reviews, 
            scheduling, and conference registration.
          </p>
          <div className="flex gap-4 justify-center">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium">
                  Get Started
                </button>
              </SignUpButton>
            )}
            <Link
              href="/schedule"
              className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 rounded-md font-medium"
            >
              View Schedule
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold mb-10 text-center">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Paper Submission" 
              description="Authors can easily submit papers with metadata for review." 
              icon="/icons/paper.svg"
            />
            <FeatureCard 
              title="Double-Blind Reviews" 
              description="Automated anonymization for fair and unbiased paper reviews." 
              icon="/icons/anonymous.svg"
            />
            <FeatureCard 
              title="Scheduling" 
              description="Organizers can create and manage conference schedules." 
              icon="/icons/calendar.svg"
            />
            <FeatureCard 
              title="Registration" 
              description="Simple registration process for conference attendees." 
              icon="/icons/register.svg"
            />
          </div>
        </section>

        {/* Workflow Section */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold mb-10 text-center">Simplified Workflow</h3>
          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
            <WorkflowStep number={1} title="Paper Submission" />
            <div className="h-0.5 w-10 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
            <WorkflowStep number={2} title="Review Assignment" />
            <div className="h-0.5 w-10 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
            <WorkflowStep number={3} title="Paper Review" />
            <div className="h-0.5 w-10 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
            <WorkflowStep number={4} title="Schedule Published" />
          </div>
        </section>

        {/* Roles Section */}
        <section>
          <h3 className="text-2xl font-bold mb-10 text-center">User Roles</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <RoleCard 
              title="For Authors" 
              description="Submit your papers and track their review status. Automated anonymization ensures fair reviews."
              action={isSignedIn ? "Submit Paper" : "Sign Up as Author"}
              href={isSignedIn ? "/dashboard/papers/submit" : "/sign-up"}
            />
            <RoleCard 
              title="For Reviewers" 
              description="Access assigned papers for review. Provide scores and comments in an efficient interface."
              action={isSignedIn ? "View Assignments" : "Sign Up as Reviewer"}
              href={isSignedIn ? "/dashboard/reviews" : "/sign-up"}
            />
            <RoleCard 
              title="For Organizers" 
              description="Manage paper assignments, generate conference schedules, and approve registrations."
              action={isSignedIn ? "Organizer Dashboard" : "Contact Admin"}
              href={isSignedIn ? "/dashboard" : "/contact"}
            />
            <RoleCard 
              title="For Attendees" 
              description="Browse the conference schedule and register to attend. Receive a digital badge for the event."
              action="Browse Schedule"
              href="/schedule"
            />
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Academic Conference Management System
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add interfaces for your component props
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

interface WorkflowStepProps {
  number: number;
  title: string;
}

interface RoleCardProps {
  title: string;
  description: string;
  action: string;
  href: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
        <Image src={icon} alt={title} width={24} height={24} className="dark:invert" />
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title }: WorkflowStepProps) {
  return (
    <div className="flex flex-col items-center mb-6 md:mb-0">
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
        {number}
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}

function RoleCard({ title, description, action, href }: RoleCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <Link 
        href={href} 
        className="inline-block bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md font-medium"
      >
        {action}
      </Link>
    </div>
  );
}
