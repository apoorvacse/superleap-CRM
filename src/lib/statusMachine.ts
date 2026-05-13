// lib/statusMachine.ts — Status transition engine for Superleap CRM

import { LeadStatus } from '@/types/lead';

/**
 * Defines the valid status transitions for each lead status.
 * A lead can only move forward one step at a time in the pipeline,
 * or be moved to LOST from any non-terminal status.
 * CONVERTED and LOST are terminal states with no outgoing transitions.
 */
export const STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW:       ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['CONVERTED', 'LOST'],
  CONVERTED: [],
  LOST:      [],
};

/**
 * Returns the list of valid next statuses for a given current status.
 * This is the single source of truth used by UI components to determine
 * which transition buttons/chips to render — not to filter after rendering.
 */
export function getValidTransitions(current: LeadStatus): LeadStatus[] {
  return STATUS_TRANSITIONS[current];
}

/**
 * Checks whether a status is terminal (no further transitions possible).
 */
export function isTerminal(status: LeadStatus): boolean {
  return status === 'CONVERTED' || status === 'LOST';
}

/**
 * Validates whether a transition from one status to another is allowed.
 */
export function canTransitionTo(from: LeadStatus, to: LeadStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

/**
 * Computes the intersection of valid transitions for multiple leads.
 * Used by bulk actions to determine which transitions are valid
 * when multiple leads are selected.
 * Returns empty array if any selected lead is in a terminal state.
 */
export function getCommonTransitions(statuses: LeadStatus[]): LeadStatus[] {
  if (statuses.length === 0) return [];
  if (statuses.some(isTerminal)) return [];

  const transitionSets = statuses.map(s => new Set(getValidTransitions(s)));
  const first = transitionSets[0];
  
  return Array.from(first).filter(status =>
    transitionSets.every(set => set.has(status))
  );
}
