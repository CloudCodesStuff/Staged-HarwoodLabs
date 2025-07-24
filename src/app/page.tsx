'use client';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StagedLanding from '@/components/landing';

const CrispWithNoSSR = dynamic(() => import('@/components/crisp'), {
  ssr: false,
});

export default function HomePage() {
  return (
    < >
    
      <StagedLanding  />
      
    </>
  );
}
