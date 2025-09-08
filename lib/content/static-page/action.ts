'use server';

import { StaticPageFormValues } from '@/lib/content/static-page/types';
import { Block } from '@blocknote/core';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { fixAttachmentsLinks, sanitizeNonTrustedHtml } from '@/lib/html-utils';
import { prisma } from '@/prisma/client';
import { fileDelete } from '@/lib/files/file-delete';
import { getIdFromDownloadUrl } from '@/lib/mongo/download-url';

function mongoIdsFromBlocks(blocks: Block[]): string[] {
  return blocks
    .filter((item) => item.type === 'audio' || item.type === 'file' || item.type === 'image' || item.type === 'video')
    .map((item) => getIdFromDownloadUrl(item.props.url))
    .filter((i) => i !== null);
}

export async function createStaticPage(
  values: StaticPageFormValues,
  uuid: string,
  text?: Block[],
  html?: string
): Promise<number> {
  const session = await auth();
  const isManager = session?.user?.role.includes('CONTENT_MANAGER');
  if (!isManager || !session?.user?.id) {
    forbidden();
  }

  const sanitizedHtml = sanitizeNonTrustedHtml(html);
  const fixedHtml = fixAttachmentsLinks(sanitizedHtml);

  const staticPage = await prisma.staticPage.create({
    data: {
      slug: values.slug,
      title: values.title,
      order: values.order,
      blocks: JSON.stringify(text),
      html: fixedHtml,
      uuid,
      authorId: session.user.id,
    },
  });

  return staticPage.id;
}

export async function updateStaticPage(
  values: StaticPageFormValues,
  pageId: number,
  text?: Block[],
  html?: string
): Promise<number> {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager) {
    forbidden();
  }

  const ret = await prisma.staticPage.findUnique({ where: { id: pageId } });

  if (ret?.blocks) {
    const existingIds = mongoIdsFromBlocks(JSON.parse(ret.blocks));
    if (existingIds.length > 0) {
      if (text && text.length > 0) {
        const newIds = mongoIdsFromBlocks(text);
        const idsToRemove = existingIds.filter((existing) => !newIds.includes(existing));
        await fileDelete(ret.uuid, ...idsToRemove);
      } else {
        await fileDelete(ret.uuid, ...existingIds);
      }
    }
  }

  const sanitizedHtml = sanitizeNonTrustedHtml(html);
  const fixedHtml = fixAttachmentsLinks(sanitizedHtml);

  const staticPage = await prisma.staticPage.update({
    data: {
      slug: values.slug,
      title: values.title,
      order: values.order,
      blocks: JSON.stringify(text),
      html: fixedHtml,
    },
    where: { id: pageId },
  });

  return staticPage.id;
}

export async function deleteStaticPage(id: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager) {
    forbidden();
  }

  const ret = await prisma.staticPage.findUnique({ where: { id } });

  if (ret?.blocks) {
    const existingIds = mongoIdsFromBlocks(JSON.parse(ret.blocks));
    if (existingIds.length > 0) {
      await fileDelete(ret.uuid, ...existingIds);
    }
  }

  await prisma.staticPage.delete({ where: { id } });
}
