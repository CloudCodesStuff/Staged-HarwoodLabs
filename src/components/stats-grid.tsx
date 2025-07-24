'use client';

import { CheckCircle, FileText, FolderOpen, MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';

const statIcons = {
  projects: FolderOpen,
  updates: FileText,
  comments: MessageSquare,
  milestones: CheckCircle,
};

export function StatsGrid() {
  const { data: projects, isLoading } = api.project.getAll.useQuery();

  const stats = {
    projects: projects?.length || 0,
    updates: projects?.reduce((acc, p) => acc + p._count.updates, 0) || 0,
    comments: projects?.reduce((acc, p) => acc + p._count.comments, 0) || 0,
    milestones: projects?.reduce((acc, p) => acc + p._count.milestones, 0) || 0,
  };

  const statItems = [
    {
      key: 'projects',
      label: 'Active Projects',
      value: stats.projects,
      icon: statIcons.projects,
    },
    {
      key: 'updates',
      label: 'Total Updates',
      value: stats.updates,
      icon: statIcons.updates,
    },
    {
      key: 'comments',
      label: 'Client Comments',
      value: stats.comments,
      icon: statIcons.comments,
    },
    {
      key: 'milestones',
      label: 'Total Milestones',
      value: stats.milestones,
      icon: statIcons.milestones,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card className="@container/card" key={stat.key}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
                {stat.value}
              </CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
