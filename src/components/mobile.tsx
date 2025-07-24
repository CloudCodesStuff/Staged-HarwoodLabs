'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent className="" side="top">
        <SheetHeader>
          <SheetTitle className="sr-only">NAV</SheetTitle>
          <Link className="flex items-center gap-2 py-4" href="/">
            <Image
              alt="Staged"
              className="rotate-90"
              height={32}
              src="/logo.png"
              width={32}
            />
            <span className="font-bold text-lg">Staged</span>
          </Link>
        </SheetHeader>
        <nav className="mt- flex flex-col gap-6 p-4 font-medium text-lg">
          {['Features', 'Pricing', 'FAQ'].map((item) => (
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}

          <Link href="/login">
            <Button className="w-full justify-start" variant="outline">
              Log in
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="w-full justify-start">Get started</Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
