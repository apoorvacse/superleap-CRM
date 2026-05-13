'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lead } from '@/types/lead';

export function useLead(id: string) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => api.get<Lead>(`/leads/${id}`),
    enabled: !!id,
  });
}
