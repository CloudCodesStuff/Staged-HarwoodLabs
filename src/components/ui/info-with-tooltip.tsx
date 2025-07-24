import { Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import React from 'react';

interface InfoWithTooltipProps {
  tooltip: string;
  className?: string;
}

export function InfoWithTooltip({ tooltip, className }: InfoWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className={className}>
          <Info className="w-4 h-4 text-blue-400 inline align-middle cursor-pointer" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
} 