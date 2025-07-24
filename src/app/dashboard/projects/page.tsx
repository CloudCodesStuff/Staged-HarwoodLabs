'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { CreateProjectModal } from '@/components/create-project-modal';
import { Nav } from '@/components/nav';
import { ProjectsTable } from '@/components/projects-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';

export default function ProjectsPage() {
  const { data: projects } = api.project.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="fade-in animate-in font-semibold text-2xl">
                Projects
              </h1>

              <p className="text-muted-foreground">
                Manage your client portals
              </p>
            </div>
            <CreateProjectModal />
          </div>

          {/* Search */}

          {/* Projects Table */}
          <ProjectsTable />
        </div>
      </div>
    </div>
  );
}
