import { NextResponse } from 'next/server';
import { publicEnvStatus, r2EnvStatus, serverEnvStatus } from '@/lib/env';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'clawtube',
    now: new Date().toISOString(),
    env: {
      ...publicEnvStatus(),
      ...serverEnvStatus(),
      ...r2EnvStatus(),
    },
  });
}
