'use client';

import { Loader2, Plus } from 'lucide-react';
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
import { api } from '@/trpc/react';

interface CreateMilestoneModalProps {
  projectId: string;
  onSuccess?: () => void;
}

export function CreateMilestoneModal({
  projectId,
  onSuccess,
}: CreateMilestoneModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const utils = api.useUtils();
  const createMilestone = api.milestone.create.useMutation({
    onSuccess: () => {
      toast.success('Milestone created successfully!');
      setOpen(false);
      setFormData({ name: '', description: '' });
      utils.project.getById.invalidate({ id: projectId });
      onSuccess?.();
    },
    onError: (error: { message: any }) => {
      toast.error(error.message || 'Failed to create milestone');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Milestone name is required');
      return;
    }
    createMilestone.mutate({ projectId, ...formData });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size={'sm'}>
          <Plus />
          Add Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to track project progress. You can reorder
              milestones later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Milestone Name</Label>
              <Input
                id="name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Discovery & Research, Design Phase..."
                required
                value={formData.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of what this milestone includes..."
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
            <Button disabled={createMilestone.isPending} type="submit">
              {createMilestone.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Milestone
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
