'use client';

import { Lead, LeadStatus, STATUS_LABELS } from '@/types/lead';
import { getCommonTransitions } from '@/lib/statusMachine';
import { useUpdateLead } from '@/hooks/useUpdateLead';
import { useDeleteLead } from '@/hooks/useDeleteLead';

import { X, Trash2, ArrowRightCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

interface BulkActionBarProps {
  selectedLeads: Lead[];
  onClearSelection: () => void;
}

export function BulkActionBar({ selectedLeads, onClearSelection }: BulkActionBarProps) {
  const { mutateAsync: updateLead } = useUpdateLead();
  const { mutateAsync: deleteLead } = useDeleteLead();
  const [isProcessing, setIsProcessing] = useState(false);

  const statuses = selectedLeads.map((l) => l.status);
  const commonTransitions = useMemo(() => getCommonTransitions(statuses), [statuses]);
  const hasLockedLeads = statuses.some((s) => s === 'CONVERTED' || s === 'LOST');

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    let successCount = 0;
    const failures: { name: string; error: string }[] = [];

    for (const lead of selectedLeads) {
      try {
        await deleteLead(lead.id);
        successCount++;
      } catch (err) {
        failures.push({ name: lead.name, error: err instanceof Error ? err.message : 'Delete failed' });
      }
    }

    setIsProcessing(false);
    onClearSelection();

    if (failures.length === 0) {
      toast.success(`${successCount} lead${successCount !== 1 ? 's' : ''} deleted`);
    } else {
      toast.error(`${successCount} deleted · ${failures.length} failed`, {
        description: (
          <div className="mt-1.5 flex flex-col gap-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
            {failures.map((f, i) => (
              <div key={i} className="text-xs text-text-muted">
                <span className="font-medium text-text-primary">{f.name}:</span> {f.error}
              </div>
            ))}
          </div>
        ),
      });
    }
  };

  const handleBulkStatusChange = async (targetStatus: LeadStatus) => {
    setIsProcessing(true);
    let successCount = 0;
    const failures: { name: string; error: string }[] = [];

    for (const lead of selectedLeads) {
      try {
        await updateLead({ id: lead.id, data: { status: targetStatus } });
        successCount++;
      } catch (err) {
        failures.push({ name: lead.name, error: err instanceof Error ? err.message : 'Update failed' });
      }
    }

    setIsProcessing(false);
    onClearSelection();

    if (failures.length === 0) {
      toast.success(`${successCount} lead${successCount !== 1 ? 's' : ''} moved to ${STATUS_LABELS[targetStatus]}`);
    } else {
      toast.error(`${successCount} updated · ${failures.length} failed`, {
        description: (
          <div className="mt-1.5 flex flex-col gap-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
            {failures.map((f, i) => (
              <div key={i} className="text-xs text-text-muted">
                <span className="font-medium text-text-primary">{f.name}:</span> {f.error}
              </div>
            ))}
          </div>
        ),
      });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-3 bg-surface/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl shadow-black/40">
        {/* Count */}
        <span className="text-sm font-medium text-text-primary whitespace-nowrap">
          {selectedLeads.length} selected
        </span>

        <div className="w-px h-6 bg-border/50" />

        {/* Status change */}
        {commonTransitions.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted">Move to:</span>
            {commonTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleBulkStatusChange(status)}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-surface-hover hover:bg-accent/10 text-text-primary rounded-md transition-all duration-150 disabled:opacity-50"
              >
                <ArrowRightCircle className="w-3 h-3" />
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        )}

        {hasLockedLeads && commonTransitions.length === 0 && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <AlertCircle className="w-3.5 h-3.5" />
            Selection contains locked leads
          </div>
        )}

        <div className="w-px h-6 bg-border/50" />

        {/* Delete */}
        <button
          onClick={handleBulkDelete}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 hover:bg-danger/20 rounded-md transition-all duration-150 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          Delete
        </button>

        {/* Deselect */}
        <button
          onClick={onClearSelection}
          disabled={isProcessing}
          className="inline-flex items-center justify-center w-7 h-7 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-all duration-150"
          aria-label="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
