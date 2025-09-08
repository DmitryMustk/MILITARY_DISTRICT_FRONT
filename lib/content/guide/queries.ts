import { prisma } from '@/prisma/client';
import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';

export async function getManagersGuides() {
  const guides = await prisma.guide.findMany({
    orderBy: {
      order: 'desc',
    },
  });

  return { guides };
}

export async function getManagersGuideById(id: number) {
  const session = await auth();

  const isManager = session?.user?.role.includes('CONTENT_MANAGER');

  if (!isManager) {
    forbidden();
  }

  const ret = await prisma.guide.findUnique({ where: { id } });

  if (!ret) {
    notFound();
  }

  return ret;
}
