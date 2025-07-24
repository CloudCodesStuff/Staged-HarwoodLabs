'use client';

import {
  FileText,
  Home,
  Plus,
  Settings,
  LayoutTemplateIcon as Template,
} from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// Menu items
const items = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    url: '/dashboard',
    icon: FileText,
  },
  {
    title: 'Templates',
    url: '/dashboard',
    icon: Template,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="px-4 py-2">
          <Link className="font-semibold text-lg" href="/">
            Staged
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 pb-4">
              <Button className="w-full" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
