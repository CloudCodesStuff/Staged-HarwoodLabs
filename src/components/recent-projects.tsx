'use client';

import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { CreateProjectModal } from '@/components/create-project-modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';

export function RecentProjects() {
  const { data: projects, isLoading } = api.project.getAll.useQuery();

  const recentProjects = projects?.slice(0, 5) || [];

  // Show Me How modal state
  const [showHowModal, setShowHowModal] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Projects you're actively working on
            </CardDescription>
          </div>
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/dashboard/projects">View all</Link>
          </Button>
  
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="space-y-1.5" key={i}>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <div className="border-border border-b pb-3" key={project.id}>
                <div className="group flex items-start justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        className="truncate font-medium text-foreground text-sm transition-colors hover:text-primary"
                        href={`/dashboard//projects/${project.id}`}
                      >
                        {project.name}
                      </Link>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {project.clientName}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Updated{' '}
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <Button asChild size="icon" variant="outline">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <ExternalLink />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 py-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="font-semibold text-foreground text-xl">
              Create Your First Client Portal
            </h2>
            <p className="text-muted-foreground text-sm">
              Get started by creating a project to manage your clients.
            </p>
            <CreateProjectModal />
          </div>
        )}
      </CardContent>
      {/* Show Me How Modal */}
      <Dialog open={showHowModal} onOpenChange={setShowHowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use Your Dashboard</DialogTitle>
            <DialogDescription>Quick tips for getting started:</DialogDescription>
          </DialogHeader>
          <ol className="list-decimal pl-6 space-y-2 text-gray-800">
            <li><b>View Projects:</b> Click a project card to open its dashboard and manage details.</li>
            <li><b>Create a Project:</b> Use the <b>New Project</b> button to start something new.</li>
            <li><b>Pin Projects:</b> Pin important projects for quick access.</li>
            <li><b>Invite Members:</b> Open a project and invite your team or clients from the Members tab.</li>
          </ol>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setShowHowModal(false)} className="px-4 py-2 rounded bg-blue-600 text-white">Got it!</button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
