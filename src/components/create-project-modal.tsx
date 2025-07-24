'use client';

import { Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/trpc/react';

interface CreateProjectModalProps {
  onSuccess?: () => void;
}

export function CreateProjectModal({ onSuccess }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    description: '',
  });

  const { data: session } = useSession();
  const { data: projects } = api.project.getAll.useQuery();
  const isSubscribed = session?.user?.stripeSubscriptionStatus === 'active';
  const projectCount = projects?.length ?? 0;
  const canCreateProject = isSubscribed || projectCount < 2;

  const utils = api.useUtils();
  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully!');
      setOpen(false);
      setFormData({ name: '', clientName: '', description: '' });
      utils.project.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error: { message: any }) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formData.name.trim() && formData.clientName.trim())) {
      toast.error('Project name and client name are required');
      return;
    }
    createProject.mutate(formData);
  };

  const triggerButton = (
    <Button id="onborda-create-project" disabled={!canCreateProject} variant="outline">
      <Plus />
      New Project
    </Button>
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {canCreateProject ? (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block" tabIndex={0}>
                {triggerButton}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade to create more than 2 projects.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new client portal project. You can customize the portal
              appearance later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Brand Redesign, Website Development..."
                required
                value={formData.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                placeholder="Acme Corporation, John Smith..."
                required
                value={formData.clientName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the project..."
                rows={3}
                value={formData.description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button variant="outline" disabled={createProject.isPending} type="submit">
              {createProject.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
