'use client';

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDistanceToNow } from 'date-fns';
import { GripVertical, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/trpc/react';
import { CreateMilestoneModal } from './create-milestone-modal';

interface MilestoneListProps {
  projectId: string;
}

export function MilestoneList({ projectId }: MilestoneListProps) {
  const { data: project } = api.project.getById.useQuery({ id: projectId });
  const utils = api.useUtils();

  const [localMilestones, setLocalMilestones] = useState(
    project?.milestones || []
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (project?.milestones) {
      setLocalMilestones(project.milestones);
    }
  }, [project?.milestones]);

  const toggleMilestone = api.milestone.update.useMutation({
    onMutate: ({ id, completed }) => {
      if (completed === undefined) return;
      setLoadingId(id);
      setLocalMilestones((prev) =>
        prev.map((m) => (m.id === id ? { ...m, completed } : m))
      );
    },
    onSettled: () => {
      setLoadingId(null);
      utils.project.getById.invalidate({ id: projectId });
    },
    onError: (e) => toast.error(e.message || 'Update failed'),
  });

  const deleteMilestone = api.milestone.delete.useMutation({
    onSuccess: () => {
      toast.success('Milestone deleted');
      utils.project.getById.invalidate({ id: projectId });
    },
    onError: (e) => toast.error(e.message || 'Delete failed'),
  });

  const reorderMilestones = api.milestone.reorder.useMutation({
    onSuccess: () => utils.project.getById.invalidate({ id: projectId }),
    onError: (e) => toast.error(e.message || 'Reorder failed'),
  });

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = localMilestones.findIndex((m) => m.id === active.id);
      const newIndex = localMilestones.findIndex((m) => m.id === over.id);
      const newItems = arrayMove(localMilestones, oldIndex, newIndex);
      setLocalMilestones(newItems);
      reorderMilestones.mutate({
        projectId,
        milestones: newItems.map((m, index) => ({ id: m.id, order: index })),
      });
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this milestone?')) deleteMilestone.mutate({ id });
  };

  return (
    <Card className="w-full">
      <CardContent>
        {localMilestones.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            No milestones yet. Create one to track your progress.
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={localMilestones.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {localMilestones.map((milestone) => (
                  <SortableMilestone
                    key={milestone.id}
                    loading={loadingId === milestone.id}
                    milestone={milestone}
                    onDelete={handleDelete}
                    onToggle={toggleMilestone.mutate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

function SortableMilestone({
  milestone,
  onToggle,
  onDelete,
  loading,
}: {
  milestone: any;
  onToggle: (input: { id: string; completed: boolean }) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="group flex items-start gap-3 rounded-lg border bg-white p-3 transition hover:bg-gray-50"
      ref={setNodeRef}
      style={style}
    >
      <div {...attributes} {...listeners} className="mt-1 cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        checked={milestone.completed}
        className="mt-1"
        disabled={loading}
        onCheckedChange={(checked: any) =>
          onToggle({ id: milestone.id, completed: !!checked })
        }
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium text-sm ${milestone.completed ? 'text-muted-foreground line-through' : ''}`}
          >
            {milestone.name}
          </span>
          {milestone.completed && (
            <Badge
              className="bg-green-100 text-green-700 text-xs"
              variant="secondary"
            >
              Done
            </Badge>
          )}
        </div>
        {milestone.description && (
          <p
            className={`text-xs ${milestone.completed ? 'text-muted-foreground' : 'text-gray-600'}`}
          >
            {milestone.description}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          Created{' '}
          {formatDistanceToNow(milestone.createdAt, { addSuffix: true })}
        </p>
      </div>
      <Button
        className="h-6 w-6 p-0 text-red-600 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
        disabled={loading}
        onClick={() => onDelete(milestone.id)}
        size="icon"
        variant="ghost"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
