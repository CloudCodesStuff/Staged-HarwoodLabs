'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CommandMenu } from './command-menu';
import { NavUser } from './nav-user';
import { Command, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOnborda } from 'onborda';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Projects', href: '/dashboard/projects' },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { startOnborda } = useOnborda?.() || {};

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-0">
        <nav className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8 ">
            <div className="group flex items-center gap-2">
              <Link
                className="flex items-center gap-2 font-medium text-xl tracking-tight"
                href="/"
              >
                <Image
                  alt="Staged"
                  className="rotate-90 transition-transform duration-300 group-hover:rotate-[80deg]"
                  height={35}
                  src="/logo.png"
                  width={35}
                />
                Staged
              </Link>
            </div>
            <div className=" hidden items-center sm:flex">
              {navItems.map((item) => (
                <Link
                  className={cn(
                    'px-3 py-2 font-medium text-sm transition-colors duration-150',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  href={item.href}
                  key={item.name}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="hidden text-muted-foreground sm:inline-flex"
              onClick={() => setOpen(true)}
              variant="outline"
            >
              Search
              <kbd className="pointer-events-none justify-center ml-4 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
                <span className="text-xs"><Command/></span>k
              </kbd>
            </Button>
       
            <NavUser />
            <CommandMenu onOpenChange={setOpen} open={open} />
          </div>
        </nav>
      </div>
    </header>
  );
}
