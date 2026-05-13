// lib/validators.ts — Zod schemas for form validation

import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s\-().]{7,20}$/.test(val),
      'Please enter a valid phone number'
    ),
  source: z.string().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
