'use client';

import { ChevronsUpDown, CreditCard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

export function NavUser({ className }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button size="lg" variant="ghost">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 animate-pulse rounded bg-muted" />
        </div>
      </Button>
    );
  }

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-min w-min rounded-full p-0"
          size="lg"
          variant="ghost"
        >
          <Avatar className="h-8 w-8 cursor-pointer rounded-full transition-all duration-150 active:scale-95">
            <AvatarImage alt={user?.name || ''} src={user?.image || ''} />
            <AvatarFallback className="rounded-full">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm leading-none">{user?.name}</p>
              {session?.user.stripeSubscriptionStatus === 'active' && (
                <Badge variant="secondary">Studio</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/pricing">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pricing</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
