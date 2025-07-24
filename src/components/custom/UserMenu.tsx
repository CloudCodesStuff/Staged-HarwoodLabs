'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage alt={user.name ?? 'User'} src={user.image ?? ''} />
          <AvatarFallback>
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
