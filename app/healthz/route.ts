import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/config';

const processStartTime = Date.now();

export async function GET() {
  const now = Date.now();
  const uptimeSeconds = Math.floor((now - processStartTime) / 1000);

  return NextResponse.json({
    ok: true,
    version: APP_VERSION,
    uptimeSeconds,
    timestamp: new Date().toISOString(),
  });
}