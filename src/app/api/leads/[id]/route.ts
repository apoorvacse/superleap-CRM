import { NextResponse } from 'next/server';
import { mockDb } from '../../mockDb';
import { Lead } from '@/types/lead';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const lead = mockDb.leads.find((l) => l.id === params.id);
  if (!lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(lead);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const index = mockDb.leads.findIndex((l) => l.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedLead: Lead = {
      ...mockDb.leads[index],
      ...body,
      updated_at: new Date().toISOString(),
    };

    mockDb.leads[index] = updatedLead;
    return NextResponse.json(updatedLead);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const index = mockDb.leads.findIndex((l) => l.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  mockDb.leads.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
