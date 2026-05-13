'use client';

import { LeadStatus, STATUS_LABELS } from '@/types/lead';
import { isTerminal } from '@/lib/statusMachine';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const statusConfig: Record<LeadStatus, { dotColor: string; bgColor: string; textColor: string }> = {
  NEW: {
    dotColor: 'bg-status-new',
    bgColor: 'bg-status-new-bg',
    textColor: 'text-status-new',
  },
  CONTACTED: {
    dotColor: 'bg-status-contacted',
    bgColor: 'bg-status-contacted-bg',
    textColor: 'text-status-contacted',
  },
  QUALIFIED: {
    dotColor: 'bg-status-qualified',
    bgColor: 'bg-status-qualified-bg',
    textColor: 'text-status-qualified',
  },
  CONVERTED: {
    dotColor: 'bg-status-converted',
    bgColor: 'bg-status-converted-bg',
    textColor: 'text-status-converted',
  },
  LOST: {
    dotColor: 'bg-status-lost',
    bgColor: 'bg-status-lost-bg',
    textColor: 'text-status-lost',
  },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function LeadStatusBadge({ status, size = 'md', className }: LeadStatusBadgeProps) {
  const config = statusConfig[status];
  const terminal = isTerminal(status);

  return (
    <span
      role="status"
      aria-label={`Status: ${STATUS_LABELS[status]}${terminal ? ' (locked)' : ''}`}
      className={cn(
        'status-badge',
        config.bgColor,
        config.textColor,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full shrink-0',
          config.dotColor,
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        )}
      />
      {STATUS_LABELS[status]}
      {terminal && <Lock className={cn('shrink-0', size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />}
    </span>
  );
}
