import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      console.warn("Vercel KV is not configured. Skipping online save.");
      return NextResponse.json({ success: true, message: "KV not configured, using local storage only." });
    }
    
    // Fetch existing submissions
    const existing = await kv.get('oral_submissions') || [];
    
    // Filter out any duplicates just in case (by ID)
    const filtered = existing.filter(sub => sub.id !== data.id);
    
    // Append new submission
    filtered.push(data);
    
    // Save back to KV
    await kv.set('oral_submissions', filtered);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Online DB Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json({ submissions: [] });
    }
    const submissions = await kv.get('oral_submissions') || [];
    return NextResponse.json({ submissions });
  } catch (err) {
    return NextResponse.json({ submissions: [], error: err.message });
  }
}
