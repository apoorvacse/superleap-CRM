'use client';

import { Suspense, useMemo } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useLeadFilters } from '@/hooks/useLeadFilters';
import { TopBar } from '@/components/layout/TopBar';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { Loader2 } from 'lucide-react';

function PageFallback() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Leads" showNewButton />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    </div>
  );
}

function LeadsPageContent() {
  const { data: leads, isLoading, isError, error, refetch } = useLeads();
  const {
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    toggleStatus,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
    filterAndSortLeads,
  } = useLeadFilters();

  const filteredLeads = useMemo(
    () => (leads ? filterAndSortLeads(leads) : []),
    [leads, filterAndSortLeads]
  );

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Leads"
        subtitle={leads ? `${leads.length} total leads` : undefined}
        showNewButton
      />

      <div className="flex-1 overflow-hidden px-6 py-5 space-y-5">
        <LeadFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatuses={selectedStatuses}
          onToggleStatus={toggleStatus}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <LeadTable
          leads={filteredLeads}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LeadsPageContent />
    </Suspense>
  );
}
