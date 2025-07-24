import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CTASection = () => (
  <section aria-label="Call to Action" className="px-6 py-24" id="cta">
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/80 to-secondary">
      <div className="absolute inset-0 h-full w-full">
        <Image
          alt="CTA Background"
          aria-hidden="true"
          className="object-cover"
          fill
          priority
          src="/patt.webp"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="mb-7 max-w-lg font-head font-medium text-4xl text-black sm:text-5xl">
          Ready to transform your client work?
        </h2>
        <Link href="/signup" >
          <Button aria-label="Get your portal" size="lg" variant="outline" className='m-3'>
            Get your portal
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="mt-4 text-sm text-black/70">No credit card required.</p>
      </div>
    </div>
  </section>
);

export default CTASection;
