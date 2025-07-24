'use client';

import { ArrowLeft, ExternalLink, Eye, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AppSidebar } from './app-sidebar';
import { FileManager } from './file-manager';
import { MilestoneEditor } from './milestone-editor';
import { NotesEditor } from './notes-editor';

const initialProject = {
  id: '1',
  name: 'Brand Redesign',
  client: 'Acme Corp',
  description:
    'Complete brand identity redesign including logo, colors, and brand guidelines.',
  status: 'Active',
};

const initialMilestones = [
  {
    id: '1',
    title: 'Discovery & Research',
    description: 'Conduct brand audit and competitor analysis',
    completed: true,
    dueDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Logo Design',
    description: 'Create 3 logo concepts for client review',
    completed: true,
    dueDate: '2024-01-30',
  },
  {
    id: '3',
    title: 'Brand Guidelines',
    description: 'Develop comprehensive brand style guide',
    completed: false,
    dueDate: '2024-02-15',
  },
];

const initialFiles = [
  {
    id: '1',
    name: 'Brand_Audit_Report.pdf',
    type: 'document' as const,
    size: '2.4 MB',
    uploadedAt: 'Jan 10, 2024',
    url: '#',
  },
  {
    id: '2',
    name: 'Logo_Concepts_v1.png',
    type: 'image' as const,
    size: '1.8 MB',
    uploadedAt: 'Jan 25, 2024',
    url: '#',
  },
];

const initialNotes = [
  {
    id: '1',
    title: 'Client Feedback - Logo Concepts',
    content:
      'Client prefers concept #2 but wants to see variations with different colors. They specifically mentioned wanting something more modern and clean.',
    createdAt: 'Jan 26, 2024',
    important: true,
  },
  {
    id: '2',
    title: 'Meeting Notes - Jan 20',
    content:
      'Discussed brand positioning and target audience. Client wants to appeal to younger demographic while maintaining professional appearance.',
    createdAt: 'Jan 20, 2024',
    important: false,
  },
];

export default function ProjectEditor() {
  const [project, setProject] = useState(initialProject);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [files, setFiles] = useState(initialFiles);
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative mx-auto min-h-screen max-w-7xl border-x bg-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </header>

          <div className="space-y-6 p-6">
            {loading ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="max-w-2xl space-y-3">
                        <Input
                          className="border-none px-0 font-bold text-2xl focus-visible:ring-0"
                          onChange={(e) =>
                            setProject({ ...project, name: e.target.value })
                          }
                          placeholder="Project name"
                          value={project.name}
                        />
                        <Input
                          onChange={(e) =>
                            setProject({ ...project, client: e.target.value })
                          }
                          placeholder="Client name"
                          value={project.client}
                        />
                        <Textarea
                          onChange={(e) =>
                            setProject({
                              ...project,
                              description: e.target.value,
                            })
                          }
                          placeholder="Project description"
                          rows={3}
                          value={project.description}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => setIsEditing(false)} size="sm">
                            Save
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h1 className="font-bold text-3xl text-gray-900">
                            {project.name}
                          </h1>
                          <Badge
                            className="bg-green-100 text-green-800"
                            variant="secondary"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-lg">
                          {project.client}
                        </p>
                        <p className="max-w-2xl text-gray-700">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Portal
                    </Button>
                  </div>
                </div>

                <Tabs className="space-y-6" defaultValue="milestones">
                  <TabsList>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="milestones">
                    <MilestoneEditor
                      milestones={milestones}
                      onUpdate={setMilestones}
                    />
                  </TabsContent>

                  <TabsContent value="notes">
                    <NotesEditor notes={notes} onUpdate={setNotes} />
                  </TabsContent>

                  <TabsContent value="settings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Portal Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-medium text-sm">
                            Portal URL
                          </label>
                          <div className="flex gap-2">
                            <Input
                              readOnly
                              value="https://staged.app/portal/brand-redesign-acme"
                            />
                            <Button variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-medium text-sm">
                            Client Access
                          </label>
                          <p className="text-gray-600 text-sm">
                            Share this link with your client to give them access
                            to the portal.
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <Button
                            className="text-red-600 hover:text-red-700"
                            variant="outline"
                          >
                            Delete Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
