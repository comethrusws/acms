import Image from "next/image";
import Link from "next/link";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ArrowRight, CheckCircle } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/conference-logo.svg" 
              alt="ACMS Logo" 
              width={36} 
              height={36}
            />
            <h1 className="text-xl font-bold text-gray-900">ACMS</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link 
                  href="/dashboard"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="text-sm">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-white border-b border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Streamlining Academic Conferences
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                A comprehensive platform for paper submissions, reviews, scheduling, and conference registration.
              </p>
              <div className="flex gap-4 justify-center">
                {isSignedIn ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <SignUpButton mode="modal">
                    <Button size="lg">
                      Get Started
                    </Button>
                  </SignUpButton>
                )}
                <Button variant="outline" size="lg" asChild>
                  <Link href="/schedule">
                    View Schedule
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-12 text-center">Key Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                title="Paper Submission" 
                description="Authors can easily submit papers with metadata for expert review." 
                icon="/icons/paper.svg"
              />
              <FeatureCard 
                title="Double-Blind Reviews" 
                description="Automated anonymization for fair and unbiased paper reviews." 
                icon="/icons/anonymous.svg"
              />
              <FeatureCard 
                title="Scheduling" 
                description="Organizers can create and manage conference schedules easily." 
                icon="/icons/calendar.svg"
              />
              <FeatureCard 
                title="Registration" 
                description="Simple registration process for conference attendees." 
                icon="/icons/register.svg"
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-12 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessCard 
                number="01" 
                title="Submit Paper" 
                description="Upload your research paper with all required metadata"
              />
              <ProcessCard 
                number="02" 
                title="Review & Feedback" 
                description="Experienced reviewers evaluate submissions"
              />
              <ProcessCard 
                number="03" 
                title="Accept & Revise" 
                description="Accepted papers proceed to revisions"
              />
              <ProcessCard 
                number="04" 
                title="Present" 
                description="Join the conference to present your work"
              />
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-12 text-center">Who It's For</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/conference-logo.svg" 
                  alt="ACMS Logo" 
                  width={28} 
                  height={28}
                />
                <span className="text-lg font-semibold">ACMS</span>
              </div>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Academic Conference Management System
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-900">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                  <li><Link href="/features" className="text-sm text-gray-500 hover:text-gray-900">Features</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-900">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
                  <li><Link href="/help" className="text-sm text-gray-500 hover:text-gray-900">Help Center</Link></li>
                  <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-900">Connect</h4>
                <ul className="space-y-2">
                  <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
                  <li><Link href="https://twitter.com" className="text-sm text-gray-500 hover:text-gray-900">Twitter</Link></li>
                  <li><Link href="https://github.com" className="text-sm text-gray-500 hover:text-gray-900">GitHub</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
          <Image src={icon} alt={title} width={20} height={20} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProcessCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <Card className="border-none shadow-sm relative overflow-hidden">
      <span className="absolute -top-4 -left-4 text-5xl font-bold text-gray-50">
        {number}
      </span>
      <CardHeader>
        <CardTitle className="text-lg relative z-10">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 relative z-10">{description}</p>
      </CardContent>
    </Card>
  );
}

function RoleCard({ title, description, action, href }: { title: string; description: string; action: string; href: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow transition-all">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full flex justify-between" asChild>
          <Link href={href}>
            <span>{action}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
