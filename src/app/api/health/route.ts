import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'SporTrip',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
}
