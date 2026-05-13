'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lead } from '@/types/lead';

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get<Lead[]>('/leads'),
    staleTime: 30_000,
  });
}
