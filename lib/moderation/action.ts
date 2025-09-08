'use server';

import { $Enums } from '@prisma/client';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';

export async function updateArtistModerationStatus(
  artistId: string,
  moderationStatus: $Enums.ModerationStatus,
  moderationComment: string
) {
  const session = await auth();
  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  await prisma.artist.update({
    where: { id: Number(artistId) },
    data: {
      moderationStatus,
      moderationComment,
      moderatorId: session.user?.moderatorId,
    },
  });
}

export async function updateProjectModerationStatus(
  projectId: string,
  moderationStatus: $Enums.ModerationStatus,
  moderationComment: string
) {
  const session = await auth();
  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  await prisma.project.update({
    where: { id: Number(projectId) },
    data: {
      moderationStatus,
      moderationComment,
      moderatorId: session.user?.moderatorId,
    },
  });
}
