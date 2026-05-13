'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lead, CreateLeadDTO } from '@/types/lead';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

export function useCreateLead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadDTO) => {
      const now = new Date().toISOString();
      const newLead: Lead = {
        ...data,
        id: generateId(),
        status: 'NEW',
        created_at: now,
        updated_at: now,
      };
      return api.post<Lead>('/leads', newLead);
    },
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ['leads'] });
      const prev = qc.getQueryData<Lead[]>(['leads']);
      const now = new Date().toISOString();
      const optimisticLead: Lead = {
        ...data,
        id: generateId(),
        status: 'NEW',
        created_at: now,
        updated_at: now,
      };
      qc.setQueryData<Lead[]>(['leads'], (old) =>
        old ? [optimisticLead, ...old] : [optimisticLead]
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(['leads'], ctx.prev);
      }
      toast.error('Failed to create lead. Please try again.');
    },
    onSuccess: () => {
      toast.success('Lead created successfully ✓');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
