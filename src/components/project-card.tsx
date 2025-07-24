import {
  Calendar,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    client: string;
    status: 'active' | 'completed' | 'on-hold';
    progress: number;
    dueDate: string;
    filesCount: number;
    milestonesCompleted: number;
    totalMilestones: number;
    clientInitial: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibold text-lg">{project.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Portal
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Project</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {project.clientInitial}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-600 text-sm">{project.client}</span>
          </div>
          <Badge className={statusColors[project.status]} variant="secondary">
            {project.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gray-900 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{project.dueDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{project.filesCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {project.milestonesCompleted}/{project.totalMilestones}
            </span>
          </div>
        </div>

        <Button className="w-full" size="sm" variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Portal
        </Button>
      </CardContent>
    </Card>
  );
}
