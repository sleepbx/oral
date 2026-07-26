import { NextResponse } from 'next/server';
import { clearSubmissions } from '@/app/lib/db';

export async function DELETE() {
  try {
    clearSubmissions();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset submissions' }, { status: 500 });
  }
}
