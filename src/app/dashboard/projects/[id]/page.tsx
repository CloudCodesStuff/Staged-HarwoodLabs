"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Eye, MoreHorizontal, Calendar, Clock, MessageSquare, Target, Sparkles, Plus, AlertCircle, Pencil, HelpCircle, Info } from "lucide-react"
import Link from "next/link"
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useRef } from "react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';

import { useState } from "react"
import { PortalStyleEditor } from "@/components/portal-style-editor"
import { MilestoneList } from "@/components/milestone-list"
import { EditProjectModal } from "@/components/edit-project-modal"
import { EditorOutput } from "@/components/editor-output"
import { FileManager } from '@/components/file-manager'
import { CreateMilestoneModal } from "@/components/create-milestone-modal"
import { Resend } from "resend"
import { env } from "@/env"
import InviteToProjectEmail from "@/emails/invite"
import { InfoWithTooltip } from '@/components/ui/info-with-tooltip';

export default function ProjectPage() {
  const params = useParams()
  if (!params || !params.id) return <div>Invalid project ID</div>;
  const projectId = params.id as string
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { data: session } = useSession();

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId })

  // Members CRM logic
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const portalId = projectId; // 1:1 mapping: portalId = projectId
  const membersQuery = api.portal.listMembers.useQuery({ portalId }, { enabled: !!portalId });
  const inviteUser = api.portal.inviteUser.useMutation();
  const removeMember = api.portal.removeMember.useMutation();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const resend = new Resend("re_SvMudbx8_ELuWKaAp5LrfaGZ6wXKYrKbC");
  const isValidEmail = (email: string) => !!email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const [loading, setLoading] = useState(false);

  const INVITE_SUBJECT = "You're invited to a portal";

  // Show Me How modal state
  const [showHowModal, setShowHowModal] = useState(false);

  async function sendInviteEmail(to: string) {
    // Call the API route with to, projectName, and portalId
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, projectName: project?.name || 'Project', portalId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send email');
    return data;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus(null);
    if (!isValidEmail(inviteEmail)) {
      setInviteStatus("Please enter a valid email.");
      return;
    }
    try {
      await inviteUser.mutateAsync({ portalId, email: inviteEmail });
      await sendInviteEmail(inviteEmail);
      setInviteStatus("Invitation sent!");
      setInviteEmail("");
      membersQuery.refetch();
      toast.success("Invitation sent!");
    } catch (err: any) {
      setInviteStatus("Failed to invite: " + (err?.message || "Unknown error"));
      toast.error("Failed to invite: " + (err?.message || "Unknown error"));
    }
  };

  const handleRemove = async (portalUserId: string) => {
    try {
      await removeMember.mutateAsync({ portalUserId });
      membersQuery.refetch();
      toast.success("Member removed");
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const handleResendInvite = async (email: string) => {
    try {
      await sendInviteEmail(email);
      toast.success("Invite resent!");
    } catch (err: any) {
      toast.error("Failed to resend invite: " + (err?.message || "Unknown error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-9 w-full sm:w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-9 w-full sm:w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-full sm:w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-full sm:w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">Project not found</h1>
            <p className="text-gray-600 mb-6 text-center">The project you're looking for doesn't exist or has been deleted.</p>
            <Link href="/dashboard/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0
  const totalMilestones = project.milestones?.length || 0
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
      

          {/* Show Me How Modal */}
          <Dialog open={showHowModal} onOpenChange={setShowHowModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Get Started</DialogTitle>
                <DialogDescription>Follow these steps to get your project up and running:</DialogDescription>
              </DialogHeader>
              <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                <li><b>Invite Members:</b> Go to the <b>Members</b> tab and invite your team or clients. They'll get an email with a link to join.</li>
                <li><b>Add an Update:</b> Go to the <b>Updates</b> tab and click <b>New Update</b> to share progress or announcements.</li>
                <li><b>Create Milestones:</b> Use the <b>Milestones</b> tab to add key deliverables and track progress.</li>
                <li><b>Upload Files:</b> In the <b>Files</b> tab, upload important documents, designs, or deliverables for easy sharing.</li>
                <li><b>Customize Your Portal:</b> Use the <b>Portal Style</b> tab to match your brand and make your portal stand out.</li>
              </ol>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setShowHowModal(false)} variant="default">Got it!</Button>
                <a href="https://yourdocs.example.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Read Docs</Button>
                </a>
              </div>
            </DialogContent>
          </Dialog>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-600">{project.clientName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setEditModalOpen(true)} className="w-full sm:w-auto">
                <Pencil className="w-4 h-4 mr-1.5" />
                Edit Project Details
              </Button>
              <Link href={`/portal/${projectId}`} target="_blank" className="w-full sm:w-auto">
                <Button className="gap-2 w-full">
                  <Eye className="w-4 h-4 mr-1.5" />
                  View Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Project Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{progress}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{project.updates.length}</p>
                    <p className="text-sm text-gray-600">Updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{project.comments.length}</p>
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{totalMilestones}</p>
                    <p className="text-sm text-gray-600">Milestones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {project.description && (
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Content Tabs */}
          <Tabs defaultValue="updates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:w-auto lg:flex bg-gray-100 p-1 mb-16 sm:m rounded-lg">
              <TabsTrigger id="onborda-share-updates" value="updates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Updates
              </TabsTrigger>
              <TabsTrigger value="milestones" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Milestones
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Comments
              </TabsTrigger>
              <TabsTrigger id="onborda-customize-portal" value="style" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Portal Style
              </TabsTrigger>
              <TabsTrigger id="onborda-add-files" value="files" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Files
              </TabsTrigger>
              {/* Only show Members tab if user is owner */}
              {project?.userId === session?.user?.id && (
                <TabsTrigger id="onborda-invite-members" value="members" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Members
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="updates" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Project Updates</h3>
                  <p className="text-sm text-gray-600">Share progress and important announcements with your client</p>
                </div>
                <Link href={`/dashboard/editor?projectId=${projectId}`}>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Update
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {project.updates.length === 0 ? (
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-6 h-6 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h4>
                        <p className="text-gray-600 mb-6">Create your first update to share progress with your client.</p>
                        <Link href={`/dashboard/editor?projectId=${projectId}`}>
                          <Button>Create First Update</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  project.updates.map((update) => (
                    <Card key={update.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">{update.name}</h4>
                            {update.important && (
                              <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/editor?projectId=${projectId}&updateId=${update.id}`}>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Pencil className="w-3 h-3" />
                                Edit
                              </Button>
                            </Link>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(update.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <EditorOutput content={update.content as any} />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
                  <p className="text-sm text-gray-600">Track project progress and key deliverables</p>
                </div>
                <CreateMilestoneModal projectId={projectId}></CreateMilestoneModal>
              </div>
              <MilestoneList projectId={projectId} />
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Client Comments</h3>
                  <p className="text-sm text-gray-600">Feedback and questions from your client</p>
                </div>
              </div>

              <div className="space-y-4">
                {project.comments.length === 0 ? (
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
                        <p className="text-gray-600">Comments from your client will appear here when they engage with your portal.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  project.comments.map((comment) => (
                    <Card key={comment.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 border-2 border-gray-100">
                            <AvatarFallback>{(comment.clientName?.charAt(0) || '?').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                              <span className="font-semibold text-gray-900">{comment.clientName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Portal Customization</h3>
                  <p className="text-sm text-gray-600">Customize the appearance of your client portal</p>
                </div>
              </div>
              <PortalStyleEditor projectId={projectId} />
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Files</h3>
                <p className="text-sm text-gray-600 mb-4">Upload, preview, and manage files for this stage.</p>
                <FileManager projectId={projectId} />
              </div>
            </TabsContent>

            {project?.userId === session?.user?.id && (
  <TabsContent value="members" className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Project Members</h3>
      <p className="text-sm text-gray-600 mb-4">
        Invite team members or clients to collaborate. You can remove them at any time.
      </p>
    </div>
    <Card className="bg-white shadow-md rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Members</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} aria-label="Info about invites">
                  <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                Members receive an email invite to join this project portal.
              </TooltipContent>
            </Tooltip>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a Member</DialogTitle>
                <DialogDescription>
                  Send an email invitation to someone to join this project.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="email@domain.com"
                  required
                  disabled={inviteUser.isPending}
                  ref={emailInputRef}
                  autoFocus
                  className="font-mono"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={inviteUser.isPending || !isValidEmail(inviteEmail)}>
                    {inviteUser.isPending ? "Inviting..." : "Send Invite"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Role</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Joined</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {membersQuery.data?.map((m, i) => (
                <tr key={m.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}>
                  <td className="p-3 flex items-center gap-2 font-mono text-sm text-gray-800">
                    <Avatar className="w-7 h-7 text-xs">
                      <AvatarFallback>{(m?.email?.[0] || '?').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {m.email}
                  </td>
                  <td className="p-3 capitalize">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {m.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : m.status === 'invited'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    {m.role !== 'owner' && m.status !== 'removed' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {m.status === 'invited' && (
                            <DropdownMenuItem
                              onClick={() => handleResendInvite(m.email)}
                              disabled={inviteUser.isPending}
                            >
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemove(m.id)}
                            disabled={removeMember.isPending}
                            className="text-red-600"
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Toaster />
      </CardContent>
    </Card>
  </TabsContent>
)}

          </Tabs>
        </div>
      </div>

      <EditProjectModal projectId={projectId} open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  )
}