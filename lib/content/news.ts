'use server';

import { prisma } from '@/prisma/client';
import { NewsFormValues } from './types';
import { auth } from '../auth';
import { forbidden } from 'next/navigation';
import { Block } from '@blocknote/core';
import { fixAttachmentsLinks, sanitizeNonTrustedHtml } from '../html-utils';
import { getIdFromDownloadUrl } from '@/lib/mongo/download-url';
import { fileDelete } from '../files/file-delete';

function mongoIdsFromBlocks(blocks: Block[]): string[] {
  return blocks
    .filter((item) => item.type === 'audio' || item.type === 'file' || item.type === 'image' || item.type === 'video')
    .map((item) => getIdFromDownloadUrl(item.props.url))
    .filter((i) => i !== null);
}

export async function createNews(values: NewsFormValues, uuid: string, text?: Block[], html?: string) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager || !session) {
    forbidden();
  }

  const sanitizedHtml = sanitizeNonTrustedHtml(html);
  const fixedHtml = fixAttachmentsLinks(sanitizedHtml);

  const created = await prisma.news.create({
    data: { ...values, authorId: session.user!.id, blocks: JSON.stringify(text), html: fixedHtml, uuid },
  });

  return created.id;
}

export async function updateNews(values: NewsFormValues, newsId: number, text?: Block[], html?: string) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager || !session) {
    forbidden();
  }

  const ret = await prisma.news.findUnique({ where: { id: newsId } });

  if (values.mainPictureId !== ret?.mainPictureId && ret?.mainPictureId) {
    await fileDelete(ret.uuid, ret.mainPictureId);
  }

  if (ret?.blocks) {
    const existingIds = mongoIdsFromBlocks(JSON.parse(ret.blocks));
    //console.log('Existing ids ' + JSON.stringify(existingIds) + ' files from the news text');
    if (existingIds.length > 0) {
      if (text && text.length > 0) {
        const newIds = mongoIdsFromBlocks(text);
        const idsToRemove = existingIds.filter((existing) => !newIds.includes(existing));
        await fileDelete(ret.uuid, ...idsToRemove);
        //console.log('Deleted ' + number + ' files from the news text');
      } else {
        await fileDelete(ret.uuid, ...existingIds);
        //console.log('Deleted ' + number + ' files from the news text');
      }
    }
  }

  const sanitizedHtml = sanitizeNonTrustedHtml(html);
  const fixedHtml = fixAttachmentsLinks(sanitizedHtml);

  await prisma.news.update({
    data: { ...values, authorId: session.user!.id, blocks: JSON.stringify(text), html: fixedHtml },
    where: { id: newsId },
  });
}

export async function deleteNews(id: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager || !session) {
    forbidden();
  }

  const ret = await prisma.news.findUnique({ where: { id } });

  if (ret?.blocks) {
    const existingIds = mongoIdsFromBlocks(JSON.parse(ret.blocks));
    //console.log('Existing ids ' + JSON.stringify(existingIds) + ' files from the news text');
    if (existingIds.length > 0) {
      await fileDelete(ret.uuid, ...existingIds);
      //console.log('Deleted ' + number + ' files from the news text');
    }
  }

  if (ret?.mainPictureId) {
    //Only delete if it belongs to this news
    await fileDelete(ret.uuid, ret.mainPictureId);
  }

  await prisma.news.delete({ where: { id } });
}
