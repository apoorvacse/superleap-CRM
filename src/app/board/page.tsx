'use client';

import { Suspense, useMemo } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useLeadFilters } from '@/hooks/useLeadFilters';
import { TopBar } from '@/components/layout/TopBar';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';

function PageFallback() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Board" subtitle="Drag leads between columns to update status" showNewButton />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    </div>
  );
}

function BoardPageContent() {
  const { data: leads, isLoading, isError, error, refetch } = useLeads();
  const {
    searchQuery, setSearchQuery,
    selectedStatuses, toggleStatus,
    sortField, setSortField,
    sortOrder, setSortOrder,
    clearFilters, hasActiveFilters,
    filterAndSortLeads,
  } = useLeadFilters();

  const filteredLeads = useMemo(
    () => (leads ? filterAndSortLeads(leads) : []),
    [leads, filterAndSortLeads]
  );

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Board" subtitle="Drag leads between columns to update status" showNewButton />
      <div className="flex-1 overflow-hidden px-6 py-5 flex flex-col gap-5">
        <LeadFilters
          searchQuery={searchQuery} onSearchChange={setSearchQuery}
          selectedStatuses={selectedStatuses} onToggleStatus={toggleStatus}
          sortField={sortField} onSortFieldChange={setSortField}
          sortOrder={sortOrder} onSortOrderChange={setSortOrder}
          hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters}
        />
        {isLoading && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[280px] flex-1 rounded-xl bg-surface/50 border-t-2 border-border/30 p-4 space-y-3">
                <Skeleton className="w-24 h-5" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="w-full h-20 rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-danger mb-4" />
            <h3 className="text-lg font-display font-semibold text-text-primary mb-2">Failed to load board</h3>
            <p className="text-sm text-text-muted mb-4">{error?.message || 'Something went wrong.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-150">Try again</button>
          </div>
        )}
        {!isLoading && !isError && (
          <div className="flex-1 min-h-0">
            <KanbanBoard leads={filteredLeads} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BoardPageContent />
    </Suspense>
  );
}
