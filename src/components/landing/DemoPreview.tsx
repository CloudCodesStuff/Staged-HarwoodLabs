import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const LaptopFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex w-full flex-col items-center">
    {/* Laptop Screen Container */}
    <div className="relative z-10 aspect-[16/9] w-[76%] overflow-hidden rounded-t-lg border-4 border-black bg-[#1e1e1e] shadow-2xl sm:rounded-t-[1rem] sm:border-8 lg:border-[15px]">
      <div className="h-full w-full">{children}</div>

      {/* Camera Notch */}
      <div className="-translate-x-1/2 absolute top-0 left-1/2 h-2 w-18 rounded-b-lg bg-black" />

      {/* "Staged" Label */}
      <div className="-bottom-2 -translate-x-1/2 absolute left-1/2 z-10 h-2 w-24 transform rounded-b-xl text-center text-muted-foreground text-xs">
        Staged
      </div>
    </div>

    {/* Mac Bottom Part */}
    <img
      alt="Mac Bottom"
      className="-mt-1 pointer-events-none z-10 w-[90%] select-none"
      src="/mac.png"
    />
  </div>
);

const DemoPreview = () => (
  <section aria-label="Demo Preview" className=" mx-auto mb-24 max-w-7xl">
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Desktop: iframe preview in laptop frame */}
      <div className="hidden sm:block">
        <LaptopFrame>
      
      <iframe
        src="https://demo.arcade.software/R7ZoqFHlSZSeLbeyLXQE?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Create and Manage a Project Portal for Clients"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
        </LaptopFrame>
      </div>
      {/* Mobile: image preview in laptop frame + button */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 sm:hidden">
        <LaptopFrame>
          <img
            alt="Staged Demo Portal Preview"
            className="h-full object-cover"
            src="/dashboard.png"
          />
        </LaptopFrame>
        <Link className="w-full" href="/portal/demo">
          <Button
            aria-label="View Demo Portal"
            className="w-full"
            size="lg"
            variant="outline"
          >
            View Demo <Play aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default DemoPreview;
