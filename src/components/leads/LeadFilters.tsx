'use client';

import { LEAD_STATUSES, STATUS_LABELS, LeadStatus } from '@/types/lead';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Input } from '@/components/ui/input';
import { Search, X, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string | null) => void;
  selectedStatuses: LeadStatus[];
  onToggleStatus: (status: LeadStatus) => void;
  sortField: string;
  onSortFieldChange: (field: 'name' | 'created_at' | 'updated_at') => void;
  sortOrder: string;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const sortOptions = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'name', label: 'Name' },
] as const;

export function LeadFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onToggleStatus,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  hasActiveFilters,
  onClearFilters,
}: LeadFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (searchQuery || '')) {
        onSearchChange(localSearch || null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <Input
            id="lead-search"
            type="text"
            placeholder="Search leads by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 bg-surface border-border/50 text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:ring-accent/20"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onSearchChange(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as 'name' | 'created_at' | 'updated_at')}
            className="h-9 rounded-md border border-border/50 bg-surface px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            aria-label="Sort by"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-border/50 bg-surface text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted mr-1">Status:</span>
        {LEAD_STATUSES.map((status) => {
          const isActive = selectedStatuses.includes(status);
          return (
            <button
              key={status}
              onClick={() => onToggleStatus(status)}
              className={cn(
                'transition-all duration-150 rounded-full',
                isActive
                  ? 'ring-2 ring-accent/50 ring-offset-1 ring-offset-[#0A0A0F]'
                  : 'opacity-60 hover:opacity-100'
              )}
              aria-label={`${isActive ? 'Remove' : 'Add'} ${STATUS_LABELS[status]} filter`}
              aria-pressed={isActive}
            >
              <LeadStatusBadge status={status} size="sm" />
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-accent hover:text-accent-hover transition-colors ml-2"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
