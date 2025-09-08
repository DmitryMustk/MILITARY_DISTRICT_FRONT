'use server';

import { prisma } from '@/prisma/client';
import { notFound } from 'next/navigation';
import { auth } from '../auth';

const PAGE_SIZE = 12;

export async function getPublicNews(page: number, forHome: boolean) {
  const skip = page * PAGE_SIZE;
  const take = PAGE_SIZE;

  const count = await prisma.news.count();

  return {
    pagesTotal: Math.ceil(count / PAGE_SIZE),
    news: (
      await prisma.news.findMany({
        where: { showAtHomePage: forHome ? true : undefined, showAtNewsPage: forHome ? undefined : true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      })
    ).map((item) => {
      //hide uuid for security reason
      return { ...item, uuid: '' };
    }),
  };
}

export async function getPublicNewsById(id: number) {
  const ret = await prisma.news.findUnique({ where: { id } });

  if (!ret) {
    notFound();
  }

  if (!ret.showAtHomePage && !ret.showAtNewsPage) {
    const session = await auth();

    const isManager = session?.user?.role.includes('CONTENT_MANAGER');

    if (!isManager) {
      notFound();
    }
  }

  return { ...ret, uuid: '' };
}
