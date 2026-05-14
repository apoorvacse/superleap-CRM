import seedData from '../../../db/seed.json';
import { Lead } from '@/types/lead';

// Shared in-memory store for Next.js API routes (Vercel deployment mock)
// Note: In a serverless environment, this will reset on cold starts,
// but it is perfectly suitable for a mock assessment deployment.
export const mockDb = {
  leads: [...(seedData.leads as Lead[])],
};
