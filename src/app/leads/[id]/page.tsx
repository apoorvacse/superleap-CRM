'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLead } from '@/hooks/useLead';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { LeadStatusTransition } from '@/components/leads/LeadStatusTransition';
import { DeleteLeadDialog } from '@/components/leads/DeleteLeadDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { generateInitials, formatDate, formatRelativeTime, cn } from '@/lib/utils';
import { SOURCE_LABELS } from '@/types/lead';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function getAvatarColor(name: string): string {
  const colors = [
    'bg-accent/20 text-accent',
    'bg-status-new-bg text-status-new',
    'bg-status-contacted-bg text-status-contacted',
    'bg-status-qualified-bg text-status-qualified',
    'bg-status-converted-bg text-status-converted',
    'bg-[#EC489920] text-[#EC4899]',
    'bg-[#06B6D420] text-[#06B6D4]',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: lead, isLoading, isError, error, refetch } = useLead(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-40 h-6" />
                  <Skeleton className="w-24 h-5" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
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
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-display text-xl font-bold text-text-primary">Lead not found</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
            <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
              {error?.message || 'Lead not found'}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              The lead you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-150 mr-2"
            >
              Retry
            </button>
            <Link
              href="/leads"
              className="px-4 py-2 bg-surface-raised hover:bg-surface-hover text-text-primary text-sm font-medium rounded-lg border border-border/50 transition-all duration-150"
            >
              Back to leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-display text-xl font-bold text-text-primary tracking-tight">
              {lead.name}
            </h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/leads/${lead.id}/edit`}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-primary bg-surface-raised hover:bg-surface-hover border border-border/50 rounded-lg transition-all duration-150"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger bg-danger/10 hover:bg-danger/20 border border-danger/20 rounded-lg transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          {/* Profile card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-5 mb-6">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold',
                  getAvatarColor(lead.name)
                )}
              >
                {generateInitials(lead.name)}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-text-primary">
                  {lead.name}
                </h2>
                <p className="text-sm text-text-muted mt-0.5">
                  ID: <span className="font-mono text-xs">{lead.id}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/50">
                <Mail className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="text-sm text-text-primary">{lead.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/50">
                <Phone className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="text-sm text-text-primary">
                    {lead.phone || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/50">
                <Globe className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Source</p>
                  <p className="text-sm text-text-primary">
                    {lead.source ? (SOURCE_LABELS[lead.source] || lead.source) : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/50">
                <Calendar className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Created</p>
                  <p className="text-sm text-text-primary">{formatDate(lead.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              Last updated {formatRelativeTime(lead.updated_at)}
            </div>
          </div>

          {/* Status Transition */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Status Transition
            </h3>
            <LeadStatusTransition leadId={lead.id} currentStatus={lead.status} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">Notes</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete dialog */}
      <DeleteLeadDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        leadId={lead.id}
        leadName={lead.name}
        onSuccess={() => router.push('/leads')}
      />
    </div>
  );
}
