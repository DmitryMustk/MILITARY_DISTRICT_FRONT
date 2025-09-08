import { mongoUpload } from '../mongo/mongo-client';
import { Document } from 'mongodb';
import { s3Upload } from '../s3/s3';
import { forbidden } from 'next/navigation';
import { auth } from '../auth';
import sharp from 'sharp';
import { logger } from '../logger';

export async function fileUpload(file: File, metadata?: Document): Promise<{ id: string; thumbnailId?: string }> {
  const authSession = await auth();

  if (!authSession || !authSession.user) {
    forbidden();
  }

  const md = { ...metadata, contentType: file.type, author: '' + authSession.user.id, thumbnailId: '' };

  let thumbnailId;
  if (file.type.startsWith('image/')) {
    try {
      const buffer = await file.arrayBuffer();
      const image = sharp(buffer);
      const meta = await image.metadata();

      const tnThresholdPx = parseInt(process.env.THUMBNAIL_THRESHOLD_PX || '1000', 10);

      if ((meta.width && meta.width > tnThresholdPx) || (meta.height && meta.height > tnThresholdPx)) {
        const thumbnailBuf = await image
          .resize({
            width: parseInt(process.env.THUMBNAIL_WIDTH_PX || '800', 10),
            height: parseInt(process.env.THUMBNAIL_HEIGHT_PX || '800', 10),
            fit: 'inside',
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        const thumbnailFile = new File([thumbnailBuf], 'thumbnail_' + file.name, { type: 'image/jpeg' });
        if (process.env.NEXT_PUBLIC_FILE_STORAGE === 's3') {
          thumbnailId = await s3Upload(thumbnailFile);
        } else {
          thumbnailId = await mongoUpload(thumbnailFile);
        }

        md.thumbnailId = thumbnailId;
      }
    } catch (e) {
      logger.warn('Error while creating thumnail:', e);
    }
  }

  let id;
  if (process.env.NEXT_PUBLIC_FILE_STORAGE === 's3') {
    id = await s3Upload(file, md);
  } else {
    id = await mongoUpload(file, md);
  }

  return { id, thumbnailId };
}
