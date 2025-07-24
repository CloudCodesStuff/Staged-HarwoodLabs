'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as React from 'react';

function mapAllRadii(size: string | undefined) {
  // Tailwind: none, sm, '', md, lg, xl, 2xl, 3xl
  switch (size) {
    case "none":
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0px',
        '--radius-md': '0px',
        '--radius-lg': '0px',
        '--radius-xl': '0px',
        '--radius-2xl': '0px',
        '--radius-3xl': '0px',
      };
    case "sm":
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0.25rem',
        '--radius-md': '0.375rem',
        '--radius-lg': '0.5rem',
        '--radius-xl': '0.75rem',
        '--radius-2xl': '1rem',
        '--radius-3xl': '1.5rem',
      };
    case "md":
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0.375rem',
        '--radius-md': '0.5rem',
        '--radius-lg': '0.75rem',
        '--radius-xl': '1rem',
        '--radius-2xl': '1.5rem',
        '--radius-3xl': '2rem',
      };
    case "lg":
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0.5rem',
        '--radius-md': '0.75rem',
        '--radius-lg': '1rem',
        '--radius-xl': '1.25rem',
        '--radius-2xl': '1.75rem',
        '--radius-3xl': '2.5rem',
      };
    case "xl":
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0.75rem',
        '--radius-md': '1rem',
        '--radius-lg': '1.25rem',
        '--radius-xl': '1.5rem',
        '--radius-2xl': '2rem',
        '--radius-3xl': '3rem',
      };
    default:
      return {
        '--radius-none': '0px',
        '--radius-sm': '0.125rem',
        '--radius': '0.375rem',
        '--radius-md': '0.5rem',
        '--radius-lg': '0.75rem',
        '--radius-xl': '1rem',
        '--radius-2xl': '1.5rem',
        '--radius-3xl': '2rem',
      };
  }
}

function mapTextSizes(size: string | undefined) {
  // Base sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
  // Scale up/down based on size
  let scale = 1;
  if (size === 'sm') scale = 0.92;
  if (size === 'lg') scale = 1.12;
  return {
    '--text-xs': `${0.75 * scale}rem`,
    '--text-sm': `${0.875 * scale}rem`,
    '--text-base': `${1 * scale}rem`,
    '--text-lg': `${1.125 * scale}rem`,
    '--text-xl': `${1.25 * scale}rem`,
    '--text-2xl': `${1.5 * scale}rem`,
    '--text-3xl': `${1.875 * scale}rem`,
    '--text-4xl': `${2.25 * scale}rem`,
  };
}

export function PortalTheme({ theme, children }: { theme: any; children: React.ReactNode }) {
  const isMobile = useIsMobile();

  const style = {
    ...mapAllRadii(theme.roundedness),
    ...mapTextSizes(theme.textSize),
    '--background': theme.backgroundColor || '#ffffff',
    '--foreground': theme.textColor || '#1f2937',
    '--card': theme.backgroundColor || '#ffffff',
    '--card-foreground': theme.textColor || '#1f2937',
    '--popover': theme.backgroundColor || '#ffffff',
    '--popover-foreground': theme.textColor || '#1f2937',
    '--primary': theme.primaryColor || '#10B981',
    '--primary-foreground': '#ffffff',
    '--secondary': theme.primaryColor ? `${theme.primaryColor}1A` : '#f1f5f9',
    '--secondary-foreground': theme.primaryColor || '#10B981',
    '--muted': '#f1f5f9',
    '--muted-foreground': '#64748b',
    '--accent': theme.primaryColor ? `${theme.primaryColor}1A` : '#f1f5f9',
    '--accent-foreground': theme.primaryColor || '#10B981',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#fafafa',
    '--border': theme.textColor ? `${theme.textColor}1A` : '#e2e8f0',
    '--input': theme.textColor ? `${theme.textColor}1A` : '#e2e8f0',
    '--ring': theme.primaryColor || '#10B981',
    '--sidebar-bg': isMobile ? theme.primaryColor : (theme.backgroundColor || '#ffffff'),
    '--sidebar-fg': isMobile ? '#ffffff' : (theme.textColor || '#1f2937'),
  } as React.CSSProperties;

  return (
    <div style={style}>
      {children}
    </div>
  );
}