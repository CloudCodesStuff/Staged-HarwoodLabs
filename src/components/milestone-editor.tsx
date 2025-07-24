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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

interface MilestoneEditorProps {
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
}

function SortableItem({
  milestone,
  editingId,
  setEditingId,
  updateMilestone,
  deleteMilestone,
  toggleCompleted,
  isLoading,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="space-y-3 rounded-lg border bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <div {...listeners} className="mt-1 cursor-grab">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <Checkbox
          checked={milestone.completed}
          onCheckedChange={() => toggleCompleted(milestone.id)}
        />
        <div className="flex-1 space-y-2">
          {editingId === milestone.id ? (
            <div className="space-y-2">
              <Input
                onChange={(e) =>
                  updateMilestone(milestone.id, { title: e.target.value })
                }
                placeholder="Milestone title"
                value={milestone.title}
              />
              <Textarea
                onChange={(e) =>
                  updateMilestone(milestone.id, { description: e.target.value })
                }
                placeholder="Description (optional)"
                rows={2}
                value={milestone.description}
              />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  className="w-auto"
                  onChange={(e) =>
                    updateMilestone(milestone.id, { dueDate: e.target.value })
                  }
                  type="date"
                  value={milestone.dueDate}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setEditingId(null)} size="sm">
                  Save
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-medium ${
                    milestone.completed ? 'text-gray-500 line-through' : ''
                  }`}
                >
                  {milestone.title}
                </h4>
                {milestone.completed && (
                  <Badge
                    className="bg-green-100 text-green-800"
                    variant="secondary"
                  >
                    Completed
                  </Badge>
                )}
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {milestone.description && (
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              )}
              {milestone.dueDate && (
                <p className="text-gray-500 text-sm">
                  Due: {milestone.dueDate}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() =>
              setEditingId(editingId === milestone.id ? null : milestone.id)
            }
            size="sm"
            variant="ghost"
          >
            Edit
          </Button>
          <Button
            className="text-red-600 hover:text-red-700"
            onClick={() => deleteMilestone(milestone.id)}
            size="sm"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MilestoneEditor({
  milestones,
  onUpdate,
}: MilestoneEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: 'New Milestone',
      description: '',
      completed: false,
      dueDate: '',
    };
    onUpdate([...milestones, newMilestone]);
    setEditingId(newMilestone.id);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    onUpdate(milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMilestone = (id: string) => {
    onUpdate(milestones.filter((m) => m.id !== id));
  };

  const toggleCompleted = (id: string) => {
    const current = milestones.find((m) => m.id === id);
    if (!current) return;

    setLoadingIds((prev) => new Set(prev).add(id));
    updateMilestone(id, { completed: !current.completed });

    // Simulate backend response delay
    setTimeout(() => {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 500);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = milestones.findIndex((m) => m.id === active.id);
      const newIndex = milestones.findIndex((m) => m.id === over.id);
      const newMilestones = arrayMove(milestones, oldIndex, newIndex);
      onUpdate(newMilestones);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Milestones</CardTitle>
          <Button onClick={addMilestone} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={milestones.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {milestones.map((milestone) => (
              <SortableItem
                deleteMilestone={deleteMilestone}
                editingId={editingId}
                isLoading={loadingIds.has(milestone.id)}
                key={milestone.id}
                milestone={milestone}
                setEditingId={setEditingId}
                toggleCompleted={toggleCompleted}
                updateMilestone={updateMilestone}
              />
            ))}
          </SortableContext>
        </DndContext>

        {milestones.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No milestones yet. Add your first milestone to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
