'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteLead } from '@/hooks/useDeleteLead';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  onSuccess?: () => void;
}

export function DeleteLeadDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  onSuccess,
}: DeleteLeadDialogProps) {
  const { mutate, isPending } = useDeleteLead();

  const handleDelete = () => {
    mutate(leadId, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border/50 sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-2">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <DialogTitle className="text-center font-display text-text-primary">
            Delete Lead
          </DialogTitle>
          <DialogDescription className="text-center text-text-muted">
            Are you sure you want to delete <strong className="text-text-primary">{leadName}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:justify-center mt-4">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-text-primary bg-surface-raised hover:bg-surface-hover border border-border/50 rounded-lg transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-danger/90 rounded-lg transition-all duration-150"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
