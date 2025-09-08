import { forbidden } from 'next/navigation';
import { auth } from '../auth';
import { mongoDelete } from '../mongo/mongo-client';
import { s3Delete } from '../s3/s3';

export async function fileDelete(mode: boolean | string, ...ids: string[]): Promise<number> {
  const authSession = await auth();

  if (!authSession || !authSession.user) {
    forbidden();
  }

  if (process.env.NEXT_PUBLIC_FILE_STORAGE === 's3') {
    return s3Delete(mode, '' + authSession.user.id, ...ids);
  } else {
    return mongoDelete(mode, '' + authSession.user.id, ...ids);
  }
}
