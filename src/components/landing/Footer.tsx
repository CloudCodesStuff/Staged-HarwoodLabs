import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer
    aria-label="Footer"
    className="relative overflow-hidden bg-primary text-primary-foreground"
  >
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[url('/staged.svg')] bg-center bg-contain bg-no-repeat opacity-5"
    />
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Link
            aria-label="Staged Home"
            className="mb-4 flex items-center gap-2 font-medium text-xl tracking-tight"
            href="/"
          >
            <Image
              alt="Staged logo"
              className="rotate-90"
              height={35}
              priority
              src="/logo.png"
              width={35}
            />
            <span className="font-bold text-xl">Staged</span>
          </Link>
          <p className="max-w-md text-primary-foreground/60">
            The professional way to manage client projects, feedback, and
            deliverables in one beautiful portal.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Explore</h4>
          <ul className="space-y-2 text-primary-foreground/60">
            <li>
              <a
                className="transition-colors hover:text-primary-foreground"
                href="#features"
              >
                Features
              </a>
            </li>
            <li>
              <a
                className="transition-colors hover:text-primary-foreground"
                href="#pricing"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                className="transition-colors hover:text-primary-foreground"
                href="mailto:vasubhatt60@gmail.com"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 border-primary-foreground/20 border-t pt-8 sm:flex-row">
        <p className="text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Staged. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-primary-foreground/60">
          <Link
            className="transition-colors hover:text-primary-foreground"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="transition-colors hover:text-primary-foreground"
            href="/terms"
          >
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
