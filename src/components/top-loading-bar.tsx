"use client";
import LoadingBar from 'react-top-loading-bar';
import { useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function TopLoadingBar() {
  const loadingBarRef = useRef<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // For App Router: complete bar on pathname change
  useEffect(() => {
    if (loadingBarRef.current) loadingBarRef.current.complete();
  }, [pathname]);

  // For Pages Router compatibility (if needed)
  useEffect(() => {
    // No-op for App Router, but left for future compatibility
    // You can add custom event listeners here if using Pages Router
  }, []);

  return (
    <LoadingBar shadow color="#FF3C0A" height={3} ref={loadingBarRef} />
  );
} 