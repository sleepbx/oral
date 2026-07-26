import { NextResponse } from 'next/server';
import { addSubmission } from '@/app/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    addSubmission(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
