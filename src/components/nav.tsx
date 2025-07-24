'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Projects', href: '/projects' },
  { name: 'Templates', href: '/templates' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link className="font-medium text-lg tracking-tight" href="/">
              <Image alt="Staged" height={35} src="/logo.png" width={35} />
              Staged
            </Link>
            <div className="flex items-center">
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
          <Button className="h-8" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Button>
        </nav>
      </div>
    </header>
  );
}
