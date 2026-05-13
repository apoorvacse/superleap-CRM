'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, CreateLeadFormData } from '@/lib/validators';
import { LEAD_SOURCES, SOURCE_LABELS } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LeadFormProps {
  defaultValues?: Partial<CreateLeadFormData>;
  onSubmit: (data: CreateLeadFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

export function LeadForm({ defaultValues, onSubmit, submitLabel = 'Create Lead' }: LeadFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      source: defaultValues?.source || '',
      notes: defaultValues?.notes || '',
    },
    mode: 'onChange',
  });

  const onFormSubmit = async (data: CreateLeadFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-3 p-3 bg-danger/10 border border-danger/20 rounded-lg animate-fade-in" role="alert">
          <AlertCircle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
          <p className="text-sm text-danger">{serverError}</p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="lead-name" className="text-sm font-medium text-text-primary">
          Name <span className="text-danger">*</span>
        </label>
        <Input
          id="lead-name"
          placeholder="e.g., Priya Sharma"
          className={cn(
            'bg-surface border-border/50 text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:ring-accent/20',
            errors.name && 'border-danger focus:border-danger focus:ring-danger/20'
          )}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="lead-email" className="text-sm font-medium text-text-primary">
          Email <span className="text-danger">*</span>
        </label>
        <Input
          id="lead-email"
          type="text"
          placeholder="e.g., priya@acmecorp.com"
          className={cn(
            'bg-surface border-border/50 text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:ring-accent/20',
            errors.email && 'border-danger focus:border-danger focus:ring-danger/20'
          )}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label htmlFor="lead-phone" className="text-sm font-medium text-text-primary">
          Phone
        </label>
        <Input
          id="lead-phone"
          type="tel"
          placeholder="e.g., +91-98765-43210"
          className={cn(
            'bg-surface border-border/50 text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:ring-accent/20',
            errors.phone && 'border-danger focus:border-danger focus:ring-danger/20'
          )}
          {...register('phone')}
        />
        {errors.phone && (
          <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Source */}
      <div className="space-y-1.5">
        <label htmlFor="lead-source" className="text-sm font-medium text-text-primary">
          Source
        </label>
        <select
          id="lead-source"
          className="flex h-9 w-full rounded-md border border-border/50 bg-surface px-3 py-1 text-sm text-text-primary shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
          {...register('source')}
        >
          <option value="">Select source...</option>
          {LEAD_SOURCES.map((source) => (
            <option key={source} value={source}>
              {SOURCE_LABELS[source] || source}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="lead-notes" className="text-sm font-medium text-text-primary">
          Notes
        </label>
        <Textarea
          id="lead-notes"
          placeholder="Any additional context..."
          rows={3}
          className="bg-surface border-border/50 text-text-primary placeholder:text-text-muted/50 focus:border-accent focus:ring-accent/20 resize-none"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="text-xs text-danger mt-1">{errors.notes.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          isSubmitting || !isValid
            ? 'bg-accent/50 text-white/50 cursor-not-allowed'
            : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20'
        )}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
