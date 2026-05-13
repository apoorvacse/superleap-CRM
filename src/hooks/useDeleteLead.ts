'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

export function useDeleteLead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<Record<string, never>>(`/leads/${id}`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['leads'] });

      const prev = qc.getQueryData<Lead[]>(['leads']);
      qc.setQueryData<Lead[]>(['leads'], (old) =>
        old?.filter((l) => l.id !== id)
      );

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(['leads'], ctx.prev);
      }
      toast.error('Failed to delete lead. Please try again.');
    },
    onSuccess: () => {
      toast.success('Lead deleted');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
