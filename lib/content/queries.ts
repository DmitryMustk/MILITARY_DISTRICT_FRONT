'use server';

import { prisma } from '@/prisma/client';
import { auth } from '../auth';
import { forbidden, notFound } from 'next/navigation';

const PAGE_SIZE = 12;

export async function getManagersNews(page: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager) {
    forbidden();
  }

  const skip = page * PAGE_SIZE;
  const take = PAGE_SIZE;

  const count = await prisma.news.count();

  return {
    pagesTotal: Math.ceil(count / PAGE_SIZE),
    news: await prisma.news.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
  };
}

export async function getManagersNewsById(id: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager) {
    forbidden();
  }

  const ret = await prisma.news.findUnique({ where: { id } });

  if (!ret) {
    notFound();
  }

  return ret;
}
