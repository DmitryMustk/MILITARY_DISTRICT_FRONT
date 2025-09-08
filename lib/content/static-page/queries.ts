'use server';

import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import { prisma } from '@/prisma/client';

export async function getManagersStaticPages() {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');
  if (!isManager) {
    forbidden();
  }

  const pages = await prisma.staticPage.findMany({
    orderBy: {
      order: 'desc',
    },
  });

  return { pages };
}

export async function getManagersStaticPageById(id: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');
  if (!isManager) {
    forbidden();
  }

  const ret = await prisma.staticPage.findUnique({
    where: { id },
  });

  if (!ret) {
    notFound();
  }

  return ret;
}

export async function getStaticPageBySlug(slug: string) {
  const ret = await prisma.staticPage.findUnique({
    where: { slug },
  });

  if (!ret) {
    notFound();
  }

  return ret;
}

export async function getStaticPagesForMenu() {
  const pages = await prisma.staticPage.findMany({
    where: {
      AND: [{ title: { not: null } }, { title: { not: '' } }],
    },
    orderBy: {
      order: 'desc',
    },
    select: {
      slug: true,
      title: true,
    },
  });

  return pages.map((page) => ({
    href: `/page/${page.slug}`,
    name: page.title!,
  }));
}

export async function isSlugUnique(slug: string, excludeId?: number): Promise<boolean> {
  const page = await prisma.staticPage.findUnique({
    where: { slug },
  });

  return !page || (excludeId !== undefined && page.id === excludeId);
}
