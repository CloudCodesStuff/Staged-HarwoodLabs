'use client';

import { SidebarIcon } from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className="text-foreground"
      onClick={toggleSidebar}
      size="icon"
      variant="ghost"
    >
      <SidebarIcon />
    </Button>
  );
}
