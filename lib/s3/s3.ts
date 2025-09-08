import { Document } from 'mongodb';

import { DeleteObjectsCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { ReadableStream as WebReadableStream } from 'stream/web';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function s3Upload(file: File, metadata?: Document): Promise<string> {
  const id = randomUUID() + '/' + file.name;

  const blob = (file as Blob) || null;

  const readableStream = Readable.fromWeb(blob.stream() as unknown as WebReadableStream);
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: id,
        Body: readableStream,
        ContentType: file.type,
        ACL: 'public-read',
        Metadata: metadata,
        ContentLength: file.size,
        ContentDisposition: file.type.startsWith('image/')
          ? undefined
          : `attachment; filename="${encodeURIComponent(file.name).replace(/'/g, '%27')}"`,
      })
    );
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }

  return id;
}

async function doDelete(ids: string[]): Promise<number> {
  const command = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET!,
    Delete: {
      Objects: ids.map((id) => ({
        Key: id,
      })),
    },
  });

  const response = await s3.send(command);

  return response.Deleted?.length || 0;
}

/*
{
  author: '30',
  contenttype: 'image/jpeg',
  groupid: '9dc82ac3-e32c-4cfb-9b86-fdeca9370a03'
}
*/
export async function s3Delete(mode: boolean | string, userId: string, ...ids: string[]): Promise<number> {
  if (mode === true) {
    const toDelete = new Set<string>(ids);
    for (const id of ids) {
      const command = new HeadObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: id });
      const response = await s3.send(command);
      const thubmnailId = response.Metadata?.thubmnailid;
      if (thubmnailId) {
        toDelete.add(thubmnailId);
      }
    }
    return await doDelete(Array.from(toDelete));
  }

  const toDelete = new Set<string>();
  for (const id in ids) {
    const command = new HeadObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: id });
    const response = await s3.send(command);

    const canDelete = mode === false ? response.Metadata?.author === userId : response.Metadata?.groupId === mode;
    if (canDelete) {
      toDelete.add(id);
      const thumbnailId = response.Metadata?.thumbnailid;
      if (thumbnailId) {
        toDelete.add(thumbnailId);
      }
    }
  }

  return await doDelete(Array.from(toDelete));
}
