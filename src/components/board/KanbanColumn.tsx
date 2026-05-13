'use client';

import { useDroppable } from '@dnd-kit/core';
import { Lead, LeadStatus, STATUS_LABELS } from '@/types/lead';
import { isTerminal } from '@/lib/statusMachine';
import { KanbanCard } from './KanbanCard';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  dropValidity: 'valid' | 'invalid' | 'neutral';
  isOver: boolean;
}

const columnAccentColors: Record<LeadStatus, string> = {
  NEW: 'border-t-status-new',
  CONTACTED: 'border-t-status-contacted',
  QUALIFIED: 'border-t-status-qualified',
  CONVERTED: 'border-t-status-converted',
  LOST: 'border-t-status-lost',
};

const columnCountBg: Record<LeadStatus, string> = {
  NEW: 'bg-status-new-bg text-status-new',
  CONTACTED: 'bg-status-contacted-bg text-status-contacted',
  QUALIFIED: 'bg-status-qualified-bg text-status-qualified',
  CONVERTED: 'bg-status-converted-bg text-status-converted',
  LOST: 'bg-status-lost-bg text-status-lost',
};

export function KanbanColumn({ status, leads, dropValidity, isOver }: KanbanColumnProps) {
  const terminal = isTerminal(status);

  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-0 h-full rounded-xl border-t-2 transition-all duration-200',
        columnAccentColors[status],
        // Background
        'bg-surface/50',
        // Drop validity states
        isOver && dropValidity === 'valid' && 'bg-success/5 ring-2 ring-success/30',
        isOver && dropValidity === 'invalid' && 'bg-danger/5 ring-2 ring-danger/30',
        !isOver && dropValidity === 'valid' && 'ring-1 ring-success/20',
        !isOver && dropValidity === 'invalid' && 'opacity-50',
      )}
    >
      {/* Column Header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b border-border/30 sticky top-0 z-10 bg-[#111118]/80 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {STATUS_LABELS[status]}
          </span>
          {terminal && <Lock className="w-3.5 h-3.5 text-text-muted" />}
        </div>
        <span
          className={cn(
            'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium',
            columnCountBg[status]
          )}
        >
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 scrollbar-thin">
        {leads.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-text-muted">
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}
