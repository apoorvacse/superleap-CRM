'use client';

import { useRouter } from 'next/navigation';
import { useCreateLead } from '@/hooks/useCreateLead';
import { LeadForm } from '@/components/leads/LeadForm';
import { CreateLeadFormData } from '@/lib/validators';
import { ArrowLeft } from 'lucide-react';


export default function NewLeadPage() {
  const router = useRouter();
  const { mutateAsync } = useCreateLead();

  const handleSubmit = async (data: CreateLeadFormData) => {
    await mutateAsync(data);
    router.push('/leads');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display text-xl font-bold text-text-primary tracking-tight">
            New Lead
          </h1>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-6">
            <LeadForm onSubmit={handleSubmit} submitLabel="Create Lead" />
          </div>
        </div>
      </div>
    </div>
  );
}
