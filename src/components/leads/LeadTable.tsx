'use client';

import { useCallback, useMemo, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Lead } from '@/types/lead';
import { LeadRow } from './LeadRow';
import { DeleteLeadDialog } from './DeleteLeadDialog';
import { BulkActionBar } from './BulkActionBar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/layout/EmptyState';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Inbox, AlertCircle } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function LeadTable({
  leads,
  isLoading,
  isError,
  error,
  onRetry,
  hasActiveFilters = false,
  onClearFilters,
}: LeadTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });



  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === leads.length) {
        return new Set();
      }
      return new Set(leads.map((l) => l.id));
    });
  }, [leads]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedLeads = useMemo(
    () => leads.filter((l) => selectedIds.has(l.id)),
    [leads, selectedIds]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="w-12 px-4 py-3"><Skeleton className="w-4 h-4" /></th>
              <th className="px-4 py-3 text-left"><Skeleton className="w-20 h-4" /></th>
              <th className="px-4 py-3 text-left"><Skeleton className="w-24 h-4" /></th>
              <th className="px-4 py-3 text-left"><Skeleton className="w-16 h-4" /></th>
              <th className="px-4 py-3 text-left"><Skeleton className="w-16 h-4" /></th>
              <th className="px-4 py-3 text-left"><Skeleton className="w-16 h-4" /></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/30" style={{ height: 56 }}>
                <td className="px-4 py-3"><Skeleton className="w-4 h-4" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-28 h-4" />
                  </div>
                </td>
                <td className="px-4 py-3"><Skeleton className="w-36 h-4" /></td>
                <td className="px-4 py-3"><Skeleton className="w-20 h-6 rounded-full" /></td>
                <td className="px-4 py-3"><Skeleton className="w-16 h-4" /></td>
                <td className="px-4 py-3"><Skeleton className="w-16 h-4" /></td>
                <td className="px-4 py-3"><Skeleton className="w-8 h-8 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="glass-card p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-danger" />
          </div>
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-text-muted mb-4 max-w-md">
            {error?.message || 'Failed to load leads. Please check your connection and try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty states
  if (leads.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon={Search}
          title="No leads match your filters"
          description="Try adjusting your search or filter criteria to find what you're looking for."
          action={{
            label: 'Clear filters',
            onClick: onClearFilters,
          }}
        />
      );
    }
    return (
      <EmptyState
        icon={Inbox}
        title="No leads yet"
        description="Get started by adding your first lead. Track and manage your sales pipeline from here."
        action={{
          label: 'Add your first lead',
          href: '/leads/new',
        }}
      />
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm">
              <tr className="border-b border-border/50">
                <th scope="col" className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all leads"
                    className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Updated
                </th>
                <th scope="col" className="w-16 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px` }}>
                  <td colSpan={7} />
                </tr>
              )}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const lead = leads[virtualRow.index];
                return (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onDelete={setDeleteTarget}
                    isSelected={selectedIds.has(lead.id)}
                    onToggleSelect={toggleSelect}
                    showCheckbox={true}
                  />
                );
              })}
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr style={{ height: `${rowVirtualizer.getTotalSize() - (rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)}px` }}>
                  <td colSpan={7} />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="px-4 py-2.5 border-t border-border/30 bg-surface/50">
          <p className="text-xs text-text-muted">
            {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          selectedLeads={selectedLeads}
          onClearSelection={clearSelection}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteLeadDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          leadId={deleteTarget.id}
          leadName={deleteTarget.name}
          onSuccess={() => {
            selectedIds.delete(deleteTarget.id);
            setSelectedIds(new Set(selectedIds));
          }}
        />
      )}
    </>
  );
}
