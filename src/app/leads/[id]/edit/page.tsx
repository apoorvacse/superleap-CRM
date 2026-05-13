'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLead } from '@/hooks/useLead';
import { useUpdateLead } from '@/hooks/useUpdateLead';
import { LeadForm } from '@/components/leads/LeadForm';
import { CreateLeadFormData } from '@/lib/validators';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';


export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: lead, isLoading, isError, error } = useLead(id);
  const { mutateAsync } = useUpdateLead();

  const handleSubmit = async (data: CreateLeadFormData) => {
    await mutateAsync({ id, data });
    router.push(`/leads/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-32 h-6" />
          </div>
        </header>
        <div className="flex-1 px-6 py-8">
          <div className="max-w-lg mx-auto glass-card p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center gap-4 px-6 py-4">
            <button onClick={() => router.back()} className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-display text-xl font-bold text-text-primary">Lead not found</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
            <p className="text-sm text-text-muted">{error?.message || 'Could not load lead.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-4 px-6 py-4">
          <button onClick={() => router.back()} className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150" aria-label="Go back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display text-xl font-bold text-text-primary tracking-tight">
            Edit: {lead.name}
          </h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-6">
            <LeadForm
              defaultValues={{ name: lead.name, email: lead.email, phone: lead.phone || '', source: lead.source || '', notes: lead.notes || '' }}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              isEdit
            />
          </div>
        </div>
      </div>
    </div>
  );
}
