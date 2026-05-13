'use client';

import { LeadStatus, STATUS_LABELS } from '@/types/lead';
import { getValidTransitions, isTerminal } from '@/lib/statusMachine';
import { useUpdateLead } from '@/hooks/useUpdateLead';
import { cn } from '@/lib/utils';
import { Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LeadStatusTransitionProps {
  leadId: string;
  currentStatus: LeadStatus;
}

const transitionButtonColors: Record<LeadStatus, string> = {
  NEW: 'bg-status-new-bg text-status-new hover:bg-status-new/20',
  CONTACTED: 'bg-status-contacted-bg text-status-contacted hover:bg-status-contacted/20',
  QUALIFIED: 'bg-status-qualified-bg text-status-qualified hover:bg-status-qualified/20',
  CONVERTED: 'bg-status-converted-bg text-status-converted hover:bg-status-converted/20',
  LOST: 'bg-status-lost-bg text-status-lost hover:bg-status-lost/20',
};

export function LeadStatusTransition({ leadId, currentStatus }: LeadStatusTransitionProps) {
  const { mutate, isPending } = useUpdateLead();
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null);

  if (isTerminal(currentStatus)) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Lock className="w-3.5 h-3.5" />
        <span>Status locked</span>
      </div>
    );
  }

  const validTransitions = getValidTransitions(currentStatus);

  const handleTransition = (targetStatus: LeadStatus) => {
    setPendingStatus(targetStatus);
    mutate(
      { id: leadId, data: { status: targetStatus } },
      { onSettled: () => setPendingStatus(null) }
    );
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-text-muted mr-1">Move to:</span>
      {validTransitions.map((status) => {
        const isLoading = isPending && pendingStatus === status;
        return (
          <button
            key={status}
            onClick={() => handleTransition(status)}
            disabled={isPending}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
              transitionButtonColors[status],
              isPending && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Change status to ${STATUS_LABELS[status]}`}
          >
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}
