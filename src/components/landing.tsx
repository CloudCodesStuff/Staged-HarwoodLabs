'use client';

import {
  MotionProps,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  DoorOpen,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Shield,
  Star,
  UploadCloud,
  Users,
  X,
  Zap,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingStaged = dynamic(() => import('./pricing'), { ssr: false });
const Faq = dynamic(() => import('./faq').then((mod) => mod.Faq), {
  ssr: false,
});
const Spotlighta = dynamic(
  () => import('@/components/ui/spotlight-new').then((mod) => mod.Spotlight),
  { ssr: false }
);

import CTASection from './landing/CTASection';
import DemoPreview from './landing/DemoPreview';
import FeatureGrid from './landing/FeatureGrid';
import Footer from './landing/Footer';
import HeroSection from './landing/HeroSection';
import OldVsNew from './landing/OldVsNew';
import { SocialProofSection } from './testimonial-05/testimonial-05';
import NavBarLanding from './landing/NavBarLanding';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className,
  id,
}) => (
  <motion.section
    className={className}
    id={id}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true }}
    whileInView={{ opacity: 1, y: 0 }}
  >
    {children}
  </motion.section>
);

export default function StagedLanding() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [20, -20]);
  const rotateY = useTransform(x, [-100, 100], [-20, 20]);

  const bentoGridAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' as const },
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-serif">
      {/* 🔵 Spotlight as full website background */}
      <div className="fixed inset-0 -z-10">
        <Spotlighta  />
      </div>

      {/* 🔴 Sticky Navbar - Enhanced stickiness */}
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
          <NavBarLanding />
        </div>
      </header>

      {/* 🔶 Page Sections */}
      <main>
        <HeroSection />
        <DemoPreview />
        <FeatureGrid />
        <OldVsNew />
        <SocialProofSection />
        <PricingStaged />
        <Faq />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}