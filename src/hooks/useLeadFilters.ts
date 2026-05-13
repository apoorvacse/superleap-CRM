'use client';

import { useQueryState, parseAsString, parseAsStringLiteral } from 'nuqs';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Lead, LeadStatus, LEAD_STATUSES } from '@/types/lead';

const SORT_FIELDS = ['name', 'created_at', 'updated_at'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

export function useLeadFilters() {
  const [statusParam, setStatusParam] = useQueryState('status', parseAsString.withDefault(''));
  const [searchParam, setSearchParam] = useQueryState('q', parseAsString.withDefault(''));
  const [sortField, setSortField] = useQueryState(
    'sort',
    parseAsStringLiteral(SORT_FIELDS).withDefault('created_at')
  );
  const [sortOrder, setSortOrder] = useQueryState(
    'order',
    parseAsStringLiteral(SORT_ORDERS).withDefault('desc')
  );

  // Debounced search for internal use
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchParam);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParam]);

  const selectedStatuses = useMemo<LeadStatus[]>(() => {
    if (!statusParam) return [];
    return statusParam
      .split(',')
      .filter((s): s is LeadStatus => LEAD_STATUSES.includes(s as LeadStatus));
  }, [statusParam]);

  const toggleStatus = useCallback(
    (status: LeadStatus) => {
      const current = new Set(selectedStatuses);
      if (current.has(status)) {
        current.delete(status);
      } else {
        current.add(status);
      }
      const newValue = Array.from(current).join(',');
      setStatusParam(newValue || null);
    },
    [selectedStatuses, setStatusParam]
  );

  const clearFilters = useCallback(() => {
    setStatusParam(null);
    setSearchParam(null);
    setSortField('created_at');
    setSortOrder('desc');
  }, [setStatusParam, setSearchParam, setSortField, setSortOrder]);

  const hasActiveFilters = useMemo(
    () => selectedStatuses.length > 0 || !!searchParam || sortField !== 'created_at' || sortOrder !== 'desc',
    [selectedStatuses, searchParam, sortField, sortOrder]
  );

  const filterAndSortLeads = useCallback(
    (leads: Lead[]): Lead[] => {
      let filtered = [...leads];

      // Filter by status
      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((l) => selectedStatuses.includes(l.status));
      }

      // Filter by search query (name + email)
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.name.toLowerCase().includes(query) ||
            l.email.toLowerCase().includes(query)
        );
      }

      // Sort
      filtered.sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === 'created_at') {
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else if (sortField === 'updated_at') {
          cmp = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });

      return filtered;
    },
    [selectedStatuses, debouncedSearch, sortField, sortOrder]
  );

  return {
    searchQuery: searchParam,
    setSearchQuery: setSearchParam,
    selectedStatuses,
    toggleStatus,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
    filterAndSortLeads,
  };
}
