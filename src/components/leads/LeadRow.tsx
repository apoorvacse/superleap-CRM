'use client';

import { useRouter } from 'next/navigation';
import { Lead } from '@/types/lead';
import { LeadStatusBadge } from './LeadStatusBadge';
import { SOURCE_LABELS } from '@/types/lead';
import { generateInitials, formatRelativeTime, cn } from '@/lib/utils';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';


interface LeadRowProps {
  lead: Lead;
  onDelete: (lead: Lead) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showCheckbox?: boolean;
}

// Deterministic avatar color based on name
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

export function LeadRow({ lead, onDelete, isSelected, onToggleSelect, showCheckbox = false }: LeadRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="menuitem"]') || target.closest('[data-checkbox]')) {
      return;
    }
    router.push(`/leads/${lead.id}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="interactive-row cursor-pointer border-b border-border/30 group"
      style={{ height: 56 }}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <td className="w-12 px-4" data-checkbox>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect?.(lead.id)}
            aria-label={`Select ${lead.name}`}
            className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
        </td>
      )}

      {/* Name + Avatar */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0',
              getAvatarColor(lead.name)
            )}
          >
            {generateInitials(lead.name)}
          </div>
          <span className="text-sm font-medium text-text-primary truncate max-w-[200px]">
            {lead.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3">
        <span className="text-sm text-text-secondary truncate max-w-[200px] block">
          {lead.email}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} size="sm" />
      </td>

      {/* Source */}
      <td className="px-4 py-3">
        <span className="text-sm text-text-muted">
          {lead.source ? (SOURCE_LABELS[lead.source] || lead.source) : '—'}
        </span>
      </td>

      {/* Updated */}
      <td className="px-4 py-3">
        <span className="text-xs text-text-muted font-mono">
          {formatRelativeTime(lead.updated_at)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label={`Actions for ${lead.name}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface border-border/50 w-40">
            <DropdownMenuItem
              onClick={() => router.push(`/leads/${lead.id}`)}
              className="text-text-primary hover:bg-surface-hover focus:bg-surface-hover cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/leads/${lead.id}/edit`)}
              className="text-text-primary hover:bg-surface-hover focus:bg-surface-hover cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(lead)}
              className="text-danger hover:bg-danger/10 focus:bg-danger/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
