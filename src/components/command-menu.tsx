'use client';

import { Home, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <>
      <CommandDialog className='bg-white' onOpenChange={onOpenChange} open={open}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/dashboard'))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push('/dashboard/settings'))
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => signOut({ callbackUrl: '/' }))}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
