'use client';

import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/trpc/react';

interface EditProjectModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectModal({
  projectId,
  open,
  onOpenChange,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    description: '',
  });

  const { data: project } = api.project.getById.useQuery(
    { id: projectId },
    { enabled: open && !!projectId }
  );

  const utils = api.useUtils();
  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      toast.success('Project updated successfully!');
      onOpenChange(false);
      utils.project.getAll.invalidate();
      utils.project.getById.invalidate({ id: projectId });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        clientName: project.clientName,
        description: project.description || '',
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formData.name.trim() && formData.clientName.trim())) {
      toast.error('Project name and client name are required');
      return;
    }
    updateProject.mutate({ id: projectId, ...formData });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details. Changes will be reflected in the
              client portal.
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
              <Label htmlFor="description">Description</Label>
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
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={updateProject.isPending} type="submit">
              {updateProject.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
