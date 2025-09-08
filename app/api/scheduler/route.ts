import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { notifyArtistsOpportunityInvite } from '@/lib/notification/action';

export async function POST(req: NextRequest) {
  try {
    const token = (await req.json()).token;

    await handleSchedulerCycle(token);

    logger.http(`Running scheduler finished successfully`);
    return NextResponse.json({ data: 'Success', status: 200 });
  } catch (error) {
    logger.http(`Failed to run scheduler\nError ${error}`);
    return NextResponse.json({ status: 500 });
  }
}

const handleSchedulerCycle = async (token: string) => {
  await notifyArtistsOpportunityInvite(token);
};
