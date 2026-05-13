// types/lead.ts — Core data model for Superleap CRM

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export type LeadSource = 'website' | 'referral' | 'campaign' | 'cold_outreach' | 'event' | string;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: LeadSource;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type CreateLeadDTO = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type UpdateLeadDTO = Partial<CreateLeadDTO> & { status?: LeadStatus };

export const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export const LEAD_SOURCES: LeadSource[] = ['website', 'referral', 'campaign', 'cold_outreach', 'event'];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  CONVERTED: 'Converted',
  LOST: 'Lost',
};

export const SOURCE_LABELS: Record<string, string> = {
  website: 'Website',
  referral: 'Referral',
  campaign: 'Campaign',
  cold_outreach: 'Cold Outreach',
  event: 'Event',
};
