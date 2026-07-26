import { NextResponse } from 'next/server';
import { getSubmissions } from '@/app/lib/db';

export async function GET() {
  try {
    const submissions = getSubmissions();
    // Sort by date descending
    submissions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
