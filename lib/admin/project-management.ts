'use server';

import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';

export async function getBannedProjectsPage(page: number, projectsPerPage: number) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  return prisma.$transaction(async () => {
    const projects = await prisma.project.findMany({
      where: {
        banned: true,
      },
      include: {
        artist: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * projectsPerPage,
      take: projectsPerPage,
    });

    const count = await prisma.project.count({
      where: {
        banned: true,
      },
    });

    return [projects, count] as const;
  });
}

export async function setProjectBanned(id: number, banned: boolean) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  await prisma.project.update({
    where: { id },
    data: { banned },
  });
}
