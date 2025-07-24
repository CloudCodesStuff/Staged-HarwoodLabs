'use client';

// Make sure this path is correct for your actual EditorOutput component
// import { EditorOutput } from "@/components/editor-output"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code,
  Download, // Icon for the demo overlay
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FolderIcon,
  Image,
  LetterText,
  Mail,
  MessageCircle,
  Send,
  Target,
  Wrench,
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ClientInfo {
  name: string;
  email: string;
}

// --- MOCK EditorOutput Component ---
// IMPORTANT: Replace this with your actual EditorOutput component from your project.
// This mock component is for demonstration purposes only to show text rendering.
const EditorOutput = ({ content }: { content: any }) => {
  if (!(content && content.content)) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      {content.content.map((block: any, index: number) => {
        if (block.type === 'paragraph' && block.content) {
          return (
            <p key={index}>
              {block.content.map((item: any, itemIndex: number) => {
                if (item.type === 'text') {
                  return <span key={itemIndex}>{item.text}</span>;
                }
                return null;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};
// --- END MOCK EditorOutput Component ---

// --- MOCK FILE/FOLDER TREE DATA FOR DEMO ---
type DemoFileNode = {
  id: string;
  name: string;
  isFolder: false;
  url: string;
  size: string;
  uploadedAt: Date;
};
type DemoFolderNode = {
  id: string;
  name: string;
  isFolder: true;
  children: DemoNode[];
};
type DemoNode = DemoFileNode | DemoFolderNode;

const demoTree: DemoNode[] = [
  {
    id: 'folder-1',
    name: 'Designs',
    isFolder: true,
    children: [
      {
        id: 'file-1',
        name: 'Logo.png',
        isFolder: false,
        url: 'https://via.placeholder.com/300x200.png?text=Logo',
        size: '120 KB',
        uploadedAt: new Date('2025-06-18T10:30:00Z'),
      },
      {
        id: 'file-2',
        name: 'Homepage.sketch',
        isFolder: false,
        url: 'https://example.com/homepage.sketch',
        size: '2.1 MB',
        uploadedAt: new Date('2025-06-17T15:00:00Z'),
      },
    ],
  },
  {
    id: 'folder-2',
    name: 'Docs',
    isFolder: true,
    children: [
      {
        id: 'file-3',
        name: 'Project Brief.pdf',
        isFolder: false,
        url: 'https://example.com/brief.pdf',
        size: '1.2 MB',
        uploadedAt: new Date('2025-06-15T09:00:00Z'),
      },
    ],
  },
  {
    id: 'file-4',
    name: 'Invoice.pdf',
    isFolder: false,
    url: 'https://example.com/invoice.pdf',
    size: '300 KB',
    uploadedAt: new Date('2025-06-12T16:20:00Z'),
  },
];

function flattenTree(tree: DemoNode[]): DemoFileNode[] {
  let files: DemoFileNode[] = [];
  for (const node of tree) {
    if (node.isFolder && node.children) {
      files = files.concat(flattenTree(node.children));
    } else if (!node.isFolder) {
      files.push(node);
    }
  }
  return files;
}

function getFileIcon(name: string) {
  const safeName = name || '';
  const ext = safeName.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext))
    return <Image aria-hidden="true" className="h-4 w-4 text-primary" />;
  if (['pdf'].includes(ext))
    return <File aria-hidden="true" className="h-4 w-4 text-primary" />;
  if (['sketch', 'fig', 'xd'].includes(ext))
    return <File aria-hidden="true" className="h-4 w-4 text-primary" />;
  return <File aria-hidden="true" className="h-4 w-4 text-primary" />;
}

function isImageFile(name: string) {
  const safeName = name || '';
  const ext = safeName.split('.').pop()?.toLowerCase() || '';
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);
}

// --- MOCK FileList Component ---
// This simulates a list of uploaded files with disabled download functionality.
interface DemoFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'zip' | 'general';
  size: string;
  uploadedAt: Date;
}

const demoFiles: DemoFile[] = [
  {
    id: 'f1',
    name: 'Project_Brief_V2.pdf',
    type: 'pdf',
    size: '1.2 MB',
    uploadedAt: new Date('2025-06-18T10:30:00Z'),
  },
  {
    id: 'f2',
    name: 'Design_Mockups_Dashboard.zip',
    type: 'zip',
    size: '8.7 MB',
    uploadedAt: new Date('2025-06-17T15:00:00Z'),
  },
  {
    id: 'f3',
    name: 'Milestone_Roadmap.xlsx',
    type: 'xlsx',
    size: '350 KB',
    uploadedAt: new Date('2025-06-15T09:00:00Z'),
  },
  {
    id: 'f4',
    name: 'Client_Feedback_Summary.docx',
    type: 'docx',
    size: '50 KB',
    uploadedAt: new Date('2025-06-14T11:45:00Z'),
  },
  {
    id: 'f5',
    name: 'Hero_Image_Concept.jpg',
    type: 'jpg',
    size: '2.1 MB',
    uploadedAt: new Date('2025-06-12T16:20:00Z'),
  },
];

const FileList = ({ clientId }: { clientId: string }) => {
  // clientId is used here for consistency but not actively used by the mock data.
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <File className="h-5 w-5 text-primary" />;
      case 'docx':
        return <File className="h-5 w-5 text-primary" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-primary" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-5 w-5 text-primary" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="h-5 w-5 text-primary" />; // Using FileCode for archives for simplicity
      default:
        return <LetterText className="h-5 w-5 text-primary" />;
    }
  };

  if (demoFiles.length === 0) {
    return (
      <p className="py-4 text-center text-gray-500 text-sm">
        No files uploaded yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {demoFiles.map((file) => (
        <div className="flex items-center justify-between p-3" key={file.id}>
          <div className="flex items-center space-x-3">
            {getFileIcon(file.type)}
            <div>
              <p className="truncate font-medium text-gray-900 text-sm">
                {file.name}
              </p>
              <p className="text-gray-500 text-xs">
                {file.size} &middot; Uploaded {formatDate(file.uploadedAt)}
              </p>
            </div>
          </div>
          <Button
            className="cursor-not-allowed opacity-50"
            disabled
            onClick={() => console.log('Download disabled in demo mode.')} // Disabled as per user request
            size="sm" // Visually indicate disabled state
            title="Download is disabled in demo mode" // Tooltip for disabled button
            variant="outline"
          >
            <Download />
          </Button>
        </div>
      ))}
    </div>
  );
};
// --- Static Demo Project Data ---
const demoProject = {
  id: 'demo-project-id',
  name: 'Staged Project Management',
  description: 'Your portal for project updates and communication.',
  status: 'active',
  primaryColor: '#FC3200', // Vibrant orange-red as requested
  textColor: '#111827',
  backgroundColor: '#ffffff',
  roundedness: 'lg',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2025-06-20T14:30:00Z'),
  milestones: [
    {
      id: 'm1',
      name: 'Initial Setup & Discovery',
      description:
        'Onboarding completed, initial requirements gathered, and project plan outlined.',
      completed: true,
      createdAt: new Date('2024-01-20T10:00:00Z'),
    },
    {
      id: 'm2',
      name: 'Phase 1 Design Mockups',
      description:
        'First set of design mockups for key screens delivered for review.',
      completed: true,
      createdAt: new Date('2024-02-10T10:00:00Z'),
    },
    {
      id: 'm3',
      name: 'Frontend Development Kick-off',
      description:
        'Development environment set up and initial UI components started.',
      completed: false,
      createdAt: new Date('2024-03-01T10:00:00Z'),
    },
    {
      id: 'm4',
      name: 'Backend API Integration',
      description:
        'Core backend services and API endpoints are being developed.',
      completed: false,
      createdAt: new Date('2024-04-15T10:00:00Z'),
    },
    {
      id: 'm5',
      name: 'User Acceptance Testing (UAT)',
      description: 'Preparation for client testing and feedback collection.',
      completed: false,
      createdAt: new Date('2024-05-20T10:00:00Z'),
    },
    {
      id: 'm6',
      name: 'Final Polish & Bug Fixing',
      description:
        'Addressing all minor issues and perfecting the user experience.',
      completed: false,
      createdAt: new Date('2024-06-10T10:00:00Z'),
    },
    {
      id: 'm7',
      name: 'Project Launch & Handoff',
      description:
        'Deployment to live servers and final documentation provided.',
      completed: false,
      createdAt: new Date('2024-06-30T10:00:00Z'),
    },
  ],
  updates: [
    {
      id: 'u1',
      name: 'Kick-off Meeting Completed!',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Our kick-off meeting for the Staged Project Management portal was a resounding success! We've established clear goals, defined the scope, and assigned initial tasks. We're all very excited to get this project moving forward. Expect our first set of design mockups to be shared within the next two weeks.",
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "We're currently focusing on the user flow and wireframing to ensure a seamless experience. Your feedback at each stage is crucial, so please keep an eye out for our upcoming review sessions.",
              },
            ],
          },
        ],
      },
      important: true,
      createdAt: new Date('2024-01-18T11:00:00Z'),
    },
    {
      id: 'u2',
      name: 'Design Mockups Ready for Review!',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Good news! The initial design mockups for the dashboard and project detail pages are now available for your review. We've focused on a clean, intuitive interface with an emphasis on clarity and ease of use.",
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Please log in and navigate to the 'Files' section to view the latest designs. We've scheduled a feedback session for next Tuesday to discuss your thoughts and any potential revisions.",
              },
            ],
          },
        ],
      },
      important: false,
      createdAt: new Date('2024-02-28T09:00:00Z'),
    },
    {
      id: 'u3',
      name: 'Frontend Development Commencing',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "With the design mockups approved, our development team has officially begun the frontend implementation. We're setting up the component library and translating the designs into functional code.",
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Our current focus is on building out the core navigation and essential UI elements. We anticipate having a clickable prototype available for an internal review by mid-April. We'll keep you posted on our progress!",
              },
            ],
          },
        ],
      },
      important: false,
      createdAt: new Date('2024-03-25T15:00:00Z'),
    },
  ],
  comments: [
    {
      id: 'c1',
      clientName: 'John Doe (Demo User)',
      clientEmail: 'john.doe@demo.com',
      content: 'The mockups look fantastic! Great job, team.',
      createdAt: new Date('2024-02-01T14:00:00Z'),
    },
    {
      id: 'c2',
      clientName: 'Project Manager', // Simulating a comment from the agency side
      clientEmail: 'pm@agency.com',
      content:
        "Thanks, John! We're thrilled you like them. We're aiming for both aesthetics and functionality.",
      createdAt: new Date('2024-02-01T14:30:00Z'),
    },
    {
      id: 'c3',
      clientName: 'John Doe (Demo User)',
      clientEmail: 'john.doe@demo.com',
      content: 'When should we expect to see the first live prototype?',
      createdAt: new Date('2024-03-05T10:15:00Z'),
    },
    {
      id: 'c4',
      clientName: 'Project Manager',
      clientEmail: 'pm@agency.com',
      content:
        "Hi John, we're targeting a clickable prototype by mid-April. We'll send out a formal invite soon!",
      createdAt: new Date('2024-03-05T11:00:00Z'),
    },
  ],
};

export default function DemoPortalPage() {
  // We'll use a static projectId for the demo.
  const projectId = demoProject.id;

  // Pre-fill clientInfo to bypass the initial form for the demo.
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>({
    name: 'John Doe (Demo User)',
    email: 'john.doe@demo.com',
  });

  // In a real application, this state would control showing a client login/info form.
  // For the demo, we always want to show the main portal, so it's `false`.
  const [showClientForm, setShowClientForm] = useState(false);

  // State for the new comment input, though it will be disabled.
  const [newComment, setNewComment] = useState('');

  // The clientForm state is kept for type consistency, but won't be used in the demo flow.
  const [clientForm, setClientForm] = useState({ name: '', email: '' });

  // Simulate no loading and no error for the demo.
  const isLoading = false;
  const error = null;
  const project = demoProject; // Directly use the static demo data.

  // In DemoPortalPage, add at the top of the component:
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  /**
   * Handles the submission of client information.
   * In a real application, this would save details to localStorage and update state.
   * For the demo, this function is effectively bypassed as `showClientForm` is always `false`.
   */
  const handleClientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This function would typically save client info to localStorage.
    // It's included for completeness but won't be called in the demo setup.
  };

  /**
   * Handles the submission of a new comment.
   * In the demo, this functionality is disabled.
   */
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Comment submission is disabled in demo mode.');
    // You could add a toast notification or alert here for user feedback.
  };

  // --- Loading and Error States (present for completeness but not hit in demo) ---
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <p className="text-gray-500 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  // --- Project Progress Calculation ---
  const completedMilestones =
    project.milestones?.filter((m) => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const progress =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // --- Dynamic Styling based on Project Data ---
  const {
    primaryColor = '#6366f1', // Default if not specified in demoProject
    textColor = '#111827',
    backgroundColor = '#ffffff',
    roundedness = 'md',
  } = project;

  const styleVariables = {
    '--background': backgroundColor,
    '--foreground': textColor,
    '--primary': primaryColor,
    '--outline': primaryColor,
    '--ring': primaryColor,
    '--primary-foreground': '#fff',
    '--card': '#fff',
    '--card-foreground': textColor,
    '--muted': '#f9fafb',
    '--muted-foreground': '#6b7280',
    '--border': '#e5e7eb',
    '--radius':
      roundedness === 'none'
        ? '0rem'
        : roundedness === 'sm'
          ? '0.375rem'
          : roundedness === 'md'
            ? '0.5rem'
            : roundedness === 'lg'
              ? '0.75rem'
              : '1rem',
  } as React.CSSProperties;

  // --- Client Information Form (bypassed for demo) ---
  if (showClientForm) {
    // This block will not be rendered because `showClientForm` is always `false` for the demo.
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
        style={styleVariables}
      >
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-foreground bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="font-semibold text-lg text-white">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="mb-2 font-semibold text-gray-900 text-xl">
                {project.name}
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your details to access the project portal
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleClientInfoSubmit}>
              <div>
                <Input
                  className="h-11 border-gray-200 bg-gray-50 focus:border-gray-300 focus:ring-0"
                  onChange={(e) =>
                    setClientForm({ ...clientForm, name: e.target.value })
                  }
                  placeholder="Full name"
                  required
                  value={clientForm.name}
                />
              </div>
              <div>
                <Input
                  className="h-11 border-gray-200 bg-gray-50 focus:border-gray-300 focus:ring-0"
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                  placeholder="Email address"
                  required
                  type="email"
                  value={clientForm.email}
                />
              </div>
              <Button
                className="h-11 w-full font-medium"
                style={{ backgroundColor: primaryColor }}
                type="submit"
              >
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={styleVariables}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="my-8 space-y-8 rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/10">
                <span className="font-bold text-base text-white">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="font-semibold text-white text-xl">
                {project.name}
              </h1>
            </div>

            {clientInfo && (
              <div className="text-right">
                <p className="font-extrabold text-3xl text-white">
                  Welcome back, {clientInfo.name}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  We&apos;re glad to see you again.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Status',
                value: 'Active',
                icon: <div className="h-2 w-2 rounded-full bg-green-400" />,
              },
              {
                label: 'Progress',
                value: `${Math.round(progress)}%`,
                icon: <Target className="h-4 w-4 text-white/50" />,
              },
              {
                label: 'Updates',
                value: project.updates?.length || 0,
                icon: <Activity className="h-4 w-4 text-white/50" />,
              },
              {
                label: 'Comments',
                value: project.comments?.length || 0,
                icon: <MessageCircle className="h-4 w-4 text-white/50" />,
              },
            ].map((stat, i) => (
              <div
                className="rounded-xl bg-white/10 p-4 text-white shadow-inner backdrop-blur-sm"
                key={i}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-white/70">{stat.label}</p>
                    <p className="font-semibold text-lg">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Area (Milestones & Updates) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Milestones Card */}
            <Card className="shadow-sm">
              <CardHeader className="">
                <CardTitle className="flex items-center font-semibold text-gray-900 text-lg">
                  <Target className="mr-2 h-5 w-5 text-gray-400" /> Milestones
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  {completedMilestones} of {totalMilestones}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {project.milestones?.length > 0 ? (
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div
                        className="flex items-start space-x-3"
                        key={milestone.id}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                            milestone.completed
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 bg-white'
                          )}
                        >
                          {milestone.completed && (
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p
                              className={cn(
                                'font-medium text-gray-900',
                                milestone.completed &&
                                  'text-gray-500 line-through'
                              )}
                            >
                              {milestone.name}
                            </p>
                            <span className="mt-1 text-gray-400 text-xs sm:mt-0">
                              {formatDate(milestone.createdAt)}
                            </span>
                          </div>
                          {milestone.description && (
                            <p className="mt-1 text-gray-500 text-sm">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-gray-500 text-sm">
                    No milestones yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Updates Card */}
            <Card className="shadow-sm">
              <CardHeader className="">
                <CardTitle className="flex items-center font-semibold text-gray-900 text-lg">
                  <Activity className="mr-2 h-5 w-5 text-gray-400" /> Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {' '}
                {/* Remove padding from CardContent */}
                <div className="divide-y divide-gray-100">
                  {project.updates?.length > 0 ? (
                    project.updates.map((update) => (
                      <div className="p-6" key={update.id}>
                        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-2 flex items-center space-x-2 sm:mb-0">
                            <h3 className="font-medium text-gray-900">
                              {update.name}
                            </h3>
                            {update.important && (
                              <Badge className="border-red-200 bg-red-50 text-red-700 text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-400 text-xs">
                            {formatDate(update.createdAt)}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <EditorOutput content={update.content as any} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6">
                      <p className="py-8 text-center text-gray-500 text-sm">
                        No updates yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <Card className="flex h-full flex-col shadow-sm">
              <CardHeader className="0">
                <CardTitle className="flex items-center font-semibold text-gray-900">
                  <MessageCircle className="mr-2 h-4 w-4 text-gray-400" />
                  Discussion
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4">
                {Array.isArray(project.comments) &&
                project.comments.length > 0 ? (
                  [...project.comments]
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                    .map((comment) => {
                      const isYou =
                        clientInfo && comment.clientName === clientInfo.name;
                      return (
                        <div
                          className={cn(
                            'fade-in flex animate-in space-x-2',
                            isYou ? 'flex-row-reverse space-x-reverse' : ''
                          )}
                          key={comment.id}
                        >
                          {!isYou && (
                            <Avatar className="h-7 w-7 flex-shrink-0">
                              <AvatarFallback className="bg-gray-100 font-medium text-gray-600 text-xs">
                                {comment.clientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              'max-w-xs flex-1 break-words rounded-lg px-3 py-2 text-sm', // Added break-words
                              isYou
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-gray-100 text-gray-900'
                            )}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span
                                className={cn(
                                  'font-medium text-xs',
                                  isYou
                                    ? 'text-primary-foreground'
                                    : 'text-gray-500'
                                )}
                              >
                                {isYou ? 'You' : comment.clientName}{' '}
                                {/* Display "You" for current user */}
                              </span>
                              <span
                                className={cn(
                                  'text-xs',
                                  isYou ? 'text-blue-100' : 'text-gray-400'
                                )}
                              >
                                {formatDate(comment.createdAt, true)}
                              </span>
                            </div>
                            <p>{comment.content}</p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="py-8 text-center text-gray-500 text-sm">
                    No comments yet. Be the first to start a discussion!
                  </p>
                )}
              </CardContent>

              <div className="mt-auto border-gray-100 border-t p-4">
                {' '}
                {/* Added mt-auto to push to bottom */}
                <form className="flex space-x-2" onSubmit={handleCommentSubmit}>
                  <Input
                    className="h-9 flex-1 border-gray-200 bg-gray-50 focus:border-gray-300 focus:ring-0"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a message..."
                    value={newComment}
                  />
                  <Button
                    disabled={!newComment.trim()}
                    size="sm"
                    style={{ backgroundColor: primaryColor }}
                    type="submit"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>

        {/* Files Section */}
        <Card className="mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-900 text-lg">
              Files
            </CardTitle>
            <CardDescription>
              Browse files and folders shared for this project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* File/Folder Tree */}
              <div className="w-full lg:w-64 lg:flex-shrink-0 lg:border-r lg:pr-4">
                <FileTreeDemo
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              </div>
              {/* File Preview */}
              <div className="flex min-h-[250px] flex-1 items-center justify-center p-4">
                <FilePreviewDemo selectedId={selectedId} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-16 border-gray-200 border-t pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Powered by{' '}
              <span className="font-semibold text-gray-600">Staged</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Formats a Date object into a readable string.
 * @param dateString The date to format (expected to be a Date object).
 * @param includeTime Whether to include hour and minute in the formatted string.
 * @returns A formatted date string.
 */
function formatDate(dateString: Date, includeTime = false) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
  }
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function FileTreeDemo({
  selectedId,
  setSelectedId,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}): React.ReactElement {
  const renderTree = (nodes: DemoNode[], level = 0): React.ReactElement => (
    <ul className="pl-0">
      {nodes.map((node) => (
        <li className="mb-1" key={node.id}>
          <div
            aria-label={node.name}
            aria-selected={selectedId === node.id}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm',
              selectedId === node.id && 'bg-muted font-semibold'
            )}
            onClick={() => !node.isFolder && setSelectedId(node.id)}
            role={node.isFolder ? 'treeitem' : 'button'}
            style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
            tabIndex={0}
          >
            {node.isFolder ? (
              <FolderIcon aria-hidden="true" className="h-4 w-4 text-primary" />
            ) : (
              getFileIcon(node.name)
            )}
            <span className="truncate" title={node.name}>
              {node.name}
            </span>
          </div>
          {node.isFolder && node.children && node.children.length > 0 && (
            <div className="ml-2 border-muted-foreground/20 border-l pl-2">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
  return renderTree(demoTree);
}

function FilePreviewDemo({
  selectedId,
}: {
  selectedId: string | null;
}): React.ReactElement {
  const file = flattenTree(demoTree).find((f) => f.id === selectedId);
  if (!file) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        <FileText aria-hidden="true" className="mx-auto mb-2 size-8" />
        Select a file from the left to preview it here.
      </div>
    );
  }
  return (
    <div className="w-full max-w-lg space-y-4 rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex w-full items-center gap-2">
        {getFileIcon(file.name)}
        <span
          className="flex-1 truncate font-semibold text-sm"
          title={file.name}
        >
          {file.name}
        </span>
        <Button
          className="cursor-not-allowed opacity-50"
          disabled
          size="sm"
          title="Download is disabled in demo mode"
          variant="outline"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-40 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
        {isImageFile(file.name) ? (
          <img
            alt={file.name}
            className="max-h-60 max-w-full object-contain"
            src={file.url}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
            <FileText aria-hidden="true" className="mb-2 h-6 w-6" />
            <span className="text-sm">
              No direct preview available for this file type.
            </span>
            <a
              className="mt-2 text-primary text-xs hover:underline"
              href={file.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
      <div className="flex justify-between text-muted-foreground text-xs">
        <span>{file.size}</span>
        <span>Uploaded {formatDate(file.uploadedAt)}</span>
      </div>
      <a
        className="block break-all text-center text-primary text-xs underline"
        href={file.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {file.url}
      </a>
    </div>
  );
}
