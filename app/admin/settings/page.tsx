'use client'

import { requireAdmin } from "@/lib/admin-auth";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function SettingsPage() {
  // Using useEffect to call requireAdmin on the client side
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await requireAdmin();
      } catch (error) {
        console.error("Admin check failed:", error);
        // Handle redirect or error here if needed
      }
    };
    
    checkAdmin();
  }, []);

  // Template variables displayed as string literals to avoid TypeScript errors
  const templateVariables = [
    "{name}",
    "{email}",
    "{role}",
    "{paper_title}",
    "{conference_name}",
    "{date}"
  ];

  // Default email template
  const defaultEmailTemplate = `Dear {name},

Thank you for creating an account on the Academic Conference Management System. We're excited to have you join our community of researchers and academics.

You can now log in to your account and explore the available features based on your role. If you have any questions, please don't hesitate to contact us.

Best regards,
The Conference Team`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage system settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="conference">Conference</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="Academic Conference Management System" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="A comprehensive platform for managing academic conferences, paper submissions, reviews, and scheduling."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="admin@acms.example.com" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="iso">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO (2023-01-31)</SelectItem>
                      <SelectItem value="us">US (01/31/2023)</SelectItem>
                      <SelectItem value="eu">EU (31/01/2023)</SelectItem>
                      <SelectItem value="long">Long (January 31, 2023)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Only administrators will be able to access the site.
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="conference">
          <Card>
            <CardHeader>
              <CardTitle>Conference Settings</CardTitle>
              <CardDescription>
                Configure conference-specific settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="conf-name">Conference Name</Label>
                <Input id="conf-name" defaultValue="Vedas Academic Conference 2025" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conf-description">Conference Description</Label>
                <Textarea 
                  id="conf-description" 
                  defaultValue="Annual international conference on advancements in academic research."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conf-start-date">Start Date</Label>
                  <Input id="conf-start-date" type="date" defaultValue="2023-12-01" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conf-end-date">End Date</Label>
                  <Input id="conf-end-date" type="date" defaultValue="2023-12-05" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Submission Deadlines</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paper-deadline">Paper Submission</Label>
                    <Input id="paper-deadline" type="date" defaultValue="2023-09-15" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="review-deadline">Review Deadline</Label>
                    <Input id="review-deadline" type="date" defaultValue="2023-10-20" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-date">Notification Date</Label>
                    <Input id="notification-date" type="date" defaultValue="2023-11-01" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="camera-ready-deadline">Camera-Ready Deadline</Label>
                    <Input id="camera-ready-deadline" type="date" defaultValue="2023-11-15" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-reviews">Anonymous Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable double-blind review process.
                  </p>
                </div>
                <Switch id="anonymous-reviews" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-assign">Auto-assign Reviewers</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign papers to reviewers based on expertise.
                  </p>
                </div>
                <Switch id="auto-assign" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min-reviewers">Minimum Reviewers per Paper</Label>
                <Select defaultValue="3">
                  <SelectTrigger id="min-reviewers">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Reviewer</SelectItem>
                    <SelectItem value="2">2 Reviewers</SelectItem>
                    <SelectItem value="3">3 Reviewers</SelectItem>
                    <SelectItem value="4">4 Reviewers</SelectItem>
                    <SelectItem value="5">5 Reviewers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Conference Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize email templates sent by the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-template">Select Template</Label>
                <Select defaultValue="welcome">
                  <SelectTrigger id="email-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="paper-submission">Paper Submission</SelectItem>
                    <SelectItem value="review-assignment">Review Assignment</SelectItem>
                    <SelectItem value="paper-accepted">Paper Acceptance</SelectItem>
                    <SelectItem value="paper-rejected">Paper Rejection</SelectItem>
                    <SelectItem value="registration-confirmation">Registration Confirmation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input id="email-subject" defaultValue="Welcome to the Academic Conference Management System" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea 
                  id="email-body" 
                  rows={10}
                  defaultValue={defaultEmailTemplate}
                />
              </div>
              
              <div className="bg-gray-50 border rounded-md p-3">
                <p className="text-sm font-medium mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {templateVariables.map((variable, index) => (
                    <div key={index} className="bg-gray-100 rounded px-2 py-1">
                      {variable}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-enabled">Enable Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Send this email automatically when the event occurs.
                  </p>
                </div>
                <Switch id="email-enabled" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                Test Email
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Configure integrations with external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Email Service</h3>
                    <p className="text-sm text-muted-foreground">Configure your email service provider.</p>
                  </div>
                  <Switch id="email-integration" defaultChecked />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input id="smtp-user" defaultValue="notifications@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-pass">SMTP Password</Label>
                    <Input id="smtp-pass" type="password" defaultValue="********" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Storage</h3>
                    <p className="text-sm text-muted-foreground">Configure file storage for papers and other documents.</p>
                  </div>
                  <Switch id="storage-integration" defaultChecked />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="storage-provider">Storage Provider</Label>
                  <Select defaultValue="local">
                    <SelectTrigger id="storage-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storage-bucket">Bucket Name</Label>
                    <Input id="storage-bucket" defaultValue="acms-files" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storage-region">Region</Label>
                    <Input id="storage-region" defaultValue="us-east-1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Integration Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}