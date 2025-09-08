import { ClientSession, Document, GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import { Readable } from 'stream';
import { ReadableStream as WebReadableStream } from 'stream/web';
import { logger } from '../logger';

export const mongoClient = new MongoClient(process.env.MONGODB_URL || 'mongodb://127.0.0.1');

function createIndexes() {
  const session = mongoClient.startSession();
  try {
    const database = mongoClient.db(process.env.MONGODB_DATABASE || 'asa');

    const filesCollection = database.collection(`fs.files`);
    filesCollection.createIndex({ 'metadata.author': 1 });
  } finally {
    session.endSession();
  }
}

if (process.env.NEXT_PUBLIC_FILE_STORAGE !== 's3') {
  createIndexes();
}

/**
 *
 * @param file Upload file to mongo, supplying it with 2 metadata parameters: content-type (taken from the file) and author - taken from the current session
 * @param metadata - additional metadat values
 * @returns id of the new file
 */
export async function mongoUpload(file: File, metadata?: Document): Promise<string> {
  const blob = (file as Blob) || null;

  const session = mongoClient.startSession();
  try {
    const database = mongoClient.db(process.env.MONGODB_DATABASE || 'asa');

    const bucket = new GridFSBucket(database);

    const readableStream = Readable.fromWeb(blob.stream() as unknown as WebReadableStream);

    const uploadStream = bucket.openUploadStream(file.name, { metadata });

    const id = uploadStream.id;

    readableStream.pipe(uploadStream);

    await new Promise<void>((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve();
      });

      uploadStream.on('error', (err) => {
        reject(err);
      });
    });

    return id.toString();
  } finally {
    session.endSession();
  }
}

/**
 * delete a set of files by id. If force is false, delete only files created by the current user
 * @param mode
 *   false - only delete if it was created by me
 *   true - always delete
 *   string - delete only if groupId is equal to the parameter's value one
 * @param ids - one or more ids of files to delete
 * @returns the number of files that was deleted (in case of force===false or in case when some files already do not exist,
 * the number can be less than the number of ids passed)
 */
export async function mongoDelete(mode: boolean | string, userId: string, ...ids: string[]): Promise<number> {
  const session = mongoClient.startSession();
  try {
    const database = mongoClient.db(process.env.MONGODB_DATABASE || 'asa');

    const filesCollection = database.collection(`fs.files`);

    const files = filesCollection.find({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
      'metadata.author': mode === true ? undefined : userId,
      'metadata.groupId': typeof mode === 'string' ? mode : undefined,
    });

    const bucket = new GridFSBucket(database);

    let counter = 0;

    for await (const file of files) {
      const thumbnailId = file.metadata?.thumbnailId;
      if (thumbnailId) {
        await bucket.delete(ObjectId.createFromHexString(thumbnailId.toString()));
      }

      await bucket.delete(file._id);
      counter++;
    }

    return counter;
  } finally {
    session.endSession();
  }
}

/**
 * Downloads file from mongo by its ID
 * @param _session - mongo session. You must create it explicitely because the method returns readable stream and you must read it BEFORE closing the session,
 * so the method can't close the session and therefore should not open it itself
 * Create session as: mongoClient.startSession()
 * Then call mongoDownload within try/finally block
 * Then close the session in finally block AFTER reading the stream like: session.endSession();
 * @param id - id of the file to download
 * @returns  readableStream to pipe to NextResponse or to some file or whatever you want
 * + some metadata:
 *   length - the file length
 *   contentType - the file content type
 *   author - the id of file author
 *   fileName - the name of the file
 *   metadata - all the document's metadata (including author and contentType, yes they are duplicated)
 */
export async function mongoDownload(_session: ClientSession, id: string) {
  const database = mongoClient.db(process.env.MONGODB_DATABASE || 'asa');

  const bucket = new GridFSBucket(database);

  const downloadStream = bucket.openDownloadStream(new ObjectId(id));

  const filesCollection = database.collection(`fs.files`); // Access the files collection

  const fileDoc = await filesCollection.findOne({ _id: new ObjectId(id) });

  if (!fileDoc) {
    notFound();
  }

  const readableStream = new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });

      downloadStream.on('end', () => {
        controller.close();
      });

      downloadStream.on('error', (err) => {
        logger.error('Download mongo stream error:', err);
        controller.error(err);
      });
    },
  });

  return {
    readableStream,
    length: fileDoc.length,
    contentType: fileDoc.metadata.contentType as string,
    author: fileDoc.metadata.author as string,
    fileName: fileDoc.filename as string,
    metadata: fileDoc.metadata as Document,
  };
}
