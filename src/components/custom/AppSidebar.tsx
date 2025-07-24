'use client';

import {
  Activity,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Command,
  CreditCard,
  Dock,
  Folder,
  Home,
  LogOut,
  MessageCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '../nav-main';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function AppSidebar({
  projectId,
  providerName,
  mainColor,
  ...props
}: {
  projectId: string;
  providerName: string;
  mainColor: string;
} & React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const base = `/portal/${projectId}`;
  const navItems = [
    {
      title: 'Home',
      url: `${base}`,
      icon: Home,
      isActive: pathname === base,
    },
    {
      title: 'Milestones',
      url: `${base}/milestones`,
      icon: Target,
      isActive: pathname === `${base}/milestones`,
    },
    {
      title: 'Updates',
      url: `${base}/updates`,
      icon: Activity,
      isActive: pathname === `${base}/updates`,
    },
    {
      title: 'Files',
      url: `${base}/files`,
      icon: Folder,
      isActive: pathname === `${base}/files`,
    },
    {
      title: 'Discussion',
      url: `${base}/chat`,
      icon: MessageCircle,
      isActive: pathname === `${base}/chat`,
    },
  ];
  return (
    <Sidebar className="h-full" collapsible="icon" variant="inset" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      alt={session?.user?.name ?? 'User'}
                      src={session?.user?.image ?? ''}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={'right'}
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        alt={session?.user?.name ?? 'User'}
                        src={session?.user?.image ?? ''}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session?.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
