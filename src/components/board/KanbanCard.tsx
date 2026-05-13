'use client';

import { useDraggable } from '@dnd-kit/core';
import { Lead, SOURCE_LABELS } from '@/types/lead';
import { isTerminal } from '@/lib/statusMachine';
import { generateInitials, formatRelativeTime, cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import Link from 'next/link';

interface KanbanCardProps {
  lead: Lead;
  isDragging?: boolean;
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-accent/20 text-accent',
    'bg-status-new-bg text-status-new',
    'bg-status-contacted-bg text-status-contacted',
    'bg-status-qualified-bg text-status-qualified',
    'bg-status-converted-bg text-status-converted',
    'bg-[#EC489920] text-[#EC4899]',
    'bg-[#06B6D420] text-[#06B6D4]',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function KanbanCard({ lead, isDragging = false }: KanbanCardProps) {
  const terminal = isTerminal(lead.status);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
    disabled: terminal,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-surface-raised border border-border/30 rounded-lg p-3 transition-all duration-150',
        !terminal && 'hover:border-border cursor-grab active:cursor-grabbing',
        terminal && 'opacity-70 cursor-default',
        isDragging && 'shadow-xl shadow-black/30 border-accent/50'
      )}
    >
      {/* Drag handle */}
      {!terminal && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          aria-label={`Drag ${lead.name}`}
        >
          <GripVertical className="w-4 h-4 text-text-muted" />
        </div>
      )}

      {/* Card content */}
      <Link href={`/leads/${lead.id}`} className="block">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0',
              getAvatarColor(lead.name)
            )}
          >
            {generateInitials(lead.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary truncate pr-4">
              {lead.name}
            </p>
            <p className="text-xs text-text-muted truncate mt-0.5">
              {lead.email}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/20">
          {lead.source && (
            <span className="text-[10px] px-1.5 py-0.5 bg-surface/80 border border-border/30 rounded text-text-muted">
              {SOURCE_LABELS[lead.source] || lead.source}
            </span>
          )}
          <span className="text-[10px] text-text-muted font-mono ml-auto">
            {formatRelativeTime(lead.updated_at)}
          </span>
        </div>
      </Link>
    </div>
  );
}
