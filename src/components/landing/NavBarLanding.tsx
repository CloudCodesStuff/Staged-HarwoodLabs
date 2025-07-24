import { ArrowRight, X as CloseIcon, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spotlight } from '../ui/spotlight-new';


export default function NavBarLanding(){
    const [showBanner, setShowBanner] = useState(true);
return(
    <>


      {showBanner && (
        <div className="relative z-10 flex w-full justify-center bg-secondary py-3 text-center font-semibold text-secondary-foreground">
          <p className="text- sm:text-base">Early Access is Open</p>
          <Button
            aria-label="Dismiss early access banner"
            className="-translate-y-1/2 absolute top-1/2 right-4 border-none shadow-none hover:bg-accent "
            onClick={() => setShowBanner(false)}
            size={'icon'}
            type="button"
            variant={'secondary'}
          >
            <CloseIcon aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      )}
      <header className="top-0 z-50 w-full sticky h-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <nav 
            aria-label="Main Navigation"
            className="flex h-16 items-center justify-between"
          >
            <Link
              aria-label="Staged Home"
              className="group flex items-center gap-3 font-medium text-xl tracking-tight"
              href="/"
            >
              <Image
                alt="Staged logo"
                className="rotate-90 transition-transform duration-300 group-hover:rotate-[80deg]"
                height={35}
                priority
                src="/logo.png"
                width={35}
              />
              <span className="font- hidden text-xl sm:block">Staged</span>
            </Link>

            <div className="hidden items-center gap-8 font-medium text-sm md:flex">
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="/#features"
              >
                Features
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="/#pricing"
              >
                Pricing
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="/#faq"
              >
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link className="hidden sm:block" href="/login">
                <Button size="sm" variant="ghost">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size={'sm'} variant='outline'>
                  Get Started{' '}
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      </>
      )
}