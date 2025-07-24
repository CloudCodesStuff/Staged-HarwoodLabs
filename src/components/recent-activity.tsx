'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

const activityIcons = {
  update: FileText,
  milestone: CheckCircle,
  comment: MessageSquare,
  project: FileText,
};

const activityColors = {
  update: 'text-secondary bg-secondary/10',
  milestone: 'text-secondary bg-secondary/10',
  comment: 'text-secondary bg-secondary/10',
  project: 'text-secondary bg-secondary/10',
};

export function RecentActivity() {
  const [showAll, setShowAll] = useState(false);
  const { data: projects, isLoading } = api.project.getAll.useQuery();

  // Generate activity feed from projects data
  const allActivities =
    projects
      ?.flatMap((project) => [
        ...project.updates.map((update: any) => ({
          id: `update-${update.id}`,
          type: 'update' as const,
          title: `Published "${update.name}"`,
          description: `in ${project.name}`,
          timestamp: update.createdAt,
          important: update.important,
        })),
        ...(project.milestones || [])
          .filter((m: any) => m.completed)
          .map((milestone: any) => ({
            id: `milestone-${milestone.id}`,
            type: 'milestone' as const,
            title: `Completed "${milestone.name}"`,
            description: `in ${project.name}`,
            timestamp: milestone.createdAt,
            important: false,
          })),
        ...project.comments.slice(0, 2).map((comment: any) => ({
          id: `comment-${comment.id}`,
          type: 'comment' as const,
          title: `New comment from ${comment.clientName}`,
          description: `on ${project.name}`,
          timestamp: comment.createdAt,
          important: false,
        })),
      ])
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ) || [];

  const activities = showAll ? allActivities : allActivities.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your projects
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="flex gap-3" key={i}>
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
              {activities.map((activity, index) => {
                const IconComponent =
                  activityIcons[activity.type as keyof typeof activityIcons];
                const colorClasses =
                  activityColors[activity.type as keyof typeof activityColors];

                return (
                  <div key={activity.id}>
                    <div className="flex gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClasses}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">
                            {activity.title}
                          </p>
                          {activity.important && (
                            <Badge
                              className="border-amber-200 bg-amber-50 text-amber-700 text-xs"
                              variant="secondary"
                            >
                              Important
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    {index < activities.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                );
              })}
            </div>
            {allActivities.length > 8 && (
              <>
                <Separator />
                <Button
                  className="w-full"
                  onClick={() => setShowAll(!showAll)}
                  variant="ghost"
                >
                  <span className="mr-2">
                    {showAll ? 'Show Less' : 'Show More'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
                  />
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
