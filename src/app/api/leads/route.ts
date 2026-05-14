import { NextResponse } from 'next/server';
import { mockDb } from '../mockDb';
import { Lead } from '@/types/lead';

export async function GET() {
  return NextResponse.json(mockDb.leads);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLead: Lead = {
      ...body,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add to the beginning of the array
    mockDb.leads.unshift(newLead);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
