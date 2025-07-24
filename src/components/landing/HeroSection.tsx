import { ArrowRight, X as CloseIcon, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spotlight } from '../ui/spotlight-new';
import NavBarLanding from './NavBarLanding';

const HeroSection = () => {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <section
      aria-label="Hero"
      className="relative flex w-full flex-col items-center justify-center overflow-x-clip "
    >
      
      <div className="z-50 mt-16 flex w-full max-w-4xl flex-col items-center justify-center gap-4 text-balance px-2 text-center">
        {/* Mini Social Proof */}
        <div className="mt-1 flex flex-col items-center gap-2 ">
          <div className="flex gap-1">
            <Star className="fill-yellow-400 text-yellow-400" />
            <Star className="fill-yellow-400 text-yellow-400" />
            <Star className="fill-yellow-400 text-yellow-400" />
            <Star className="fill-yellow-400 text-yellow-400" />
            <Star className="fill-yellow-400 text-yellow-400" />
          </div>
          <span className="mt-1 text-muted-foreground text-xs">
            Trusted by Freelancers and Studios worldwide
          </span>
        </div>

        <h1
          className="text-balance font-[600]  text-3xl tracking-tight sm:text-7xl "
          id="main-headline"
        >
          A clean, professional portal for{' '}
          <span className="text-secondary">every</span> client
        </h1>

        <p className="track leading- mx-auto max-w-2xl text-md text-muted-foreground sm:text-xl">
          Share updates, links, and feedback without messy email threads.
          <br/>
          Simple, branded, and built for small teams.
        </p>

        <div className="mt-2 mb-12 flex flex-col gap-3 sm:mb-16 sm:flex-row" >
          <Link href="/signup">
            <Button size="lg" variant='outline'>Create Your Portal</Button>
          </Link>
        
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
