'use server';
import { NextRequest, NextResponse } from 'next/server';

import { notFound } from 'next/navigation';
import { mongoClient, mongoDownload } from '@/lib/mongo/mongo-client';

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id');
  const mode = req.nextUrl.searchParams.get('mode');

  if (!id) {
    notFound();
  }

  const session = mongoClient.startSession();
  try {
    const { contentType, fileName, length, readableStream } = await mongoDownload(session, id);

    // Set headers for the response
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', length);
    headers.set('x-file-name', encodeURIComponent(fileName).replace(/'/g, '%27'));

    //make it attachment for non images or when forced
    if ((!mode && !(contentType as string).startsWith('image/')) || mode === 'attachment') {
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName).replace(/'/g, '%27')}"`);
    }

    return new NextResponse(readableStream, { headers });
  } finally {
    session.endSession();
  }
};
