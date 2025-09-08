'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { forbidden, notFound } from 'next/navigation';
import { $Enums, ModerationStatus } from '@prisma/client';

export async function getMyProject(projectId: string) {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    forbidden();
  }

  const project = await prisma.project.findUnique({
    where: { id: parseInt(projectId), artistId: artistId },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });
  if (!project) {
    notFound();
  }

  return project!;
}

export async function getAvailableProjects(artistId: number) {
  if (
    !(await prisma.artist.findUnique({ where: { id: artistId, moderationStatus: $Enums.ModerationStatus.Approved } }))
  ) {
    forbidden();
  }

  return prisma.project.findMany({
    where: {
      artistId,
      moderationStatus: ModerationStatus.Approved,
      hidden: false,
      banned: false,
    },
  });
}
