'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lead, UpdateLeadDTO } from '@/types/lead';
import { toast } from 'sonner';

export function useUpdateLead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDTO }) =>
      api.patch<Lead>(`/leads/${id}`, { ...data, updated_at: new Date().toISOString() }),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['leads'] });
      await qc.cancelQueries({ queryKey: ['leads', id] });

      const prevList = qc.getQueryData<Lead[]>(['leads']);
      const prevSingle = qc.getQueryData<Lead>(['leads', id]);

      qc.setQueryData<Lead[]>(['leads'], (old) =>
        old?.map((l) =>
          l.id === id
            ? { ...l, ...data, updated_at: new Date().toISOString() }
            : l
        )
      );

      qc.setQueryData<Lead>(['leads', id], (old) =>
        old ? { ...old, ...data, updated_at: new Date().toISOString() } : old
      );

      return { prevList, prevSingle };
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prevList) {
        qc.setQueryData(['leads'], ctx.prevList);
      }
      if (ctx?.prevSingle) {
        qc.setQueryData(['leads', id], ctx.prevSingle);
      }
      toast.error('Failed to update lead. Please try again.');
    },
    onSuccess: (_data, { data }) => {
      if (data.status) {
        toast.success(`Status updated to ${data.status} ✓`);
      } else {
        toast.success('Changes saved ✓');
      }
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leads', id] });
    },
  });
}
