import { NextResponse } from 'next/server';
import { purgeExpired } from '@/lib/checkin/db';

// Vercel cron sends Authorization: Bearer <CRON_SECRET>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const purged = await purgeExpired();
  console.log(`[cron] purged ${purged} check-in link(s) past retention`);
  return NextResponse.json({ purged });
}
