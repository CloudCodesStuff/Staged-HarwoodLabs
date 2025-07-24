'use client';

import {
  Edit,
  ExternalLink,
  Eye,
  Loader2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/trpc/react';

interface ProjectActionsDropdownProps {
  projectId: string;
  projectName: string;
  onEdit?: () => void;
}

export function ProjectActionsDropdown({
  projectId,
  projectName,
  onEdit,
}: ProjectActionsDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const utils = api.useUtils();
  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      toast.success('Project deleted successfully');
      utils.project.getAll.invalidate();
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  const handleDelete = () => {
    deleteProject.mutate({ id: projectId });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <Edit />
              Edit Project
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/portal/${projectId}`} target="_blank">
              <Eye />
              View Portal
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="text-destructive" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectName}"? This action
              cannot be undone and will permanently delete all project data
              including updates, milestones, and comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteProject.isPending}
              onClick={handleDelete}
            >
              {deleteProject.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
