'use client';

import { Eye, Palette, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Projects', href: '/projects' },
  { name: 'Templates', href: '/templates' },
];

interface TopNavProps {
  onCustomizeClick?: () => void;
}

export function TopNav({ onCustomizeClick }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-gray-200/50 border-b bg-white/80 backdrop-blur-sm">
      <div className="px-6">
        <nav className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              className="font-semibold text-gray-900 text-lg tracking-tight"
              href="/"
            >
              Staged
            </Link>
            <div className="flex items-center">
              {navItems.map((item) => (
                <Link
                  className={cn(
                    'rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200',
                    pathname === item.href
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  href={item.href}
                  key={item.name}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onCustomizeClick && (
              <Button onClick={onCustomizeClick} size="sm" variant="outline">
                <Palette className="mr-2 h-4 w-4" />
                Customize
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href="/portal/demo">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
