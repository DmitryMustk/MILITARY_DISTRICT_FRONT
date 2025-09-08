'use server';
import { forbidden, notFound } from 'next/navigation';
import { auth } from '../auth';
import { prisma } from '@/prisma/client';
import { Role } from '@prisma/client';

const PAGE_SIZE = 12;

export type UserFilter = {
  email?: string;
  username?: string;
  roles?: Role[];
  locked?: boolean;
};

export async function getUsersDetails(userId: number) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  const ret = prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: { artist: true, provider: true },
  });

  if (!ret) {
    notFound();
  }

  return ret;
}

export async function getUsersForManagement(page: number, filter: UserFilter) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  const skip = page * PAGE_SIZE;
  const take = PAGE_SIZE;

  const where = {
    email: filter.email,
    username: filter.username,
    role: filter.roles ? { hasSome: filter.roles } : undefined,
    locked: filter.locked,
  };
  const include = {
    artist: true,
  };
  return prisma.$transaction(async () => {
    const count = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip,
      omit: { password: true },
      take,
      include,
      orderBy: { id: 'desc' },
    });

    const pagesTotal = Math.ceil(count / PAGE_SIZE);

    return [pagesTotal, users] as const;
  });
}

export async function setUserLocked(id: number, locked: boolean) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  await prisma.user.update({
    where: { id },
    data: { locked },
  });
}
