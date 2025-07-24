'use client';

import { formatDistanceToNow } from 'date-fns';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import type {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import { ProjectActionsDropdown } from '@/components/project-actions-dropdown';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/trpc/react';
import { CreateProjectModal } from './create-project-modal';
import { Button } from './ui/button';

export function ProjectsTable() {
  const { data: projects, isLoading, error } = api.project.getAll.useQuery();

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-600 text-sm">
            Error loading projects: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Project
                </TableHead>
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Client
                </TableHead>
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Updates
                </TableHead>
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Milestones
                </TableHead>
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Comments
                </TableHead>
                <TableHead className="h-10 p-3 font-medium text-xs">
                  Updated
                </TableHead>
                <TableHead className="h-10 w-10 p-3 font-medium text-xs" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Skeleton className="h-6 w-6" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (!projects?.length) {
    return (
      <Card>
        <CardContent className="p-0 text-center">
          <div className="space-y-4 py-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="font-semibold text-foreground text-xl">
              Create Your First Client Portal
            </h2>
            <p className="text-muted-foreground text-sm">
              Get started by creating a project to manage your clients.
            </p>
            <CreateProjectModal />
          </div>{' '}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-10 p-3 font-medium text-xs">
                Project
              </TableHead>
              <TableHead className="h-10 p-3 font-medium text-xs">
                Client
              </TableHead>
              <TableHead className="h-10 p-3 font-medium text-xs">
                Updates
              </TableHead>
              <TableHead className="h-10 p-3 font-medium text-xs">
                Milestones
              </TableHead>
              <TableHead className="h-10 p-3 font-medium text-xs">
                Comments
              </TableHead>
              <TableHead className="h-10 p-3 font-medium text-xs">
                Updated
              </TableHead>
              <TableHead className="h-10 w-10 p-3 font-medium text-xs" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(
              (project: {
                id: Key | null | undefined;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                description:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                clientName:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                _count: {
                  updates:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  milestones:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  comments:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                };
                updatedAt: string | number | Date;
              }) => (
                <TableRow
                  className="border-b last:border-b-0 hover:bg-gray-50/50"
                  key={project.id}
                >
                  <TableCell className="p-3">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <div className="space-y-0.5">
                        <Button className="p-0" variant="link">
                          <div className="font-medium text-sm">
                            {project.name}
                          </div>
                        </Button>
                        {project.description && (
                          <div className="line-clamp-1 text-muted-foreground text-xs">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="text-sm">{project.clientName}</div>
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge className="text-xs" variant="secondary">
                      {project._count.updates}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge className="text-xs" variant="secondary">
                      {project._count.milestones}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge className="text-xs" variant="secondary">
                      {project._count.comments}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">
                    <ProjectActionsDropdown
                      projectId={project.id as string}
                      projectName={project.name as string}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
