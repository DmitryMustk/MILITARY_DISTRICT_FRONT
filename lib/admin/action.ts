'use server';

import { AdminMark, Role } from '@prisma/client';
import { auth } from '../auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';

export async function lockArtist(artistId: number) {
  const session = await auth();
  if (!session?.user?.role.includes(Role.ADMINISTRATOR)) {
    forbidden();
  }
  await prisma.artist.update({
    where: {
      id: artistId,
    },
    data: {
      user: {
        update: {
          locked: true,
        },
      },
    },
  });
}

export async function unlockArtist(artistId: number) {
  const session = await auth();
  if (!session?.user?.role.includes(Role.ADMINISTRATOR)) {
    forbidden();
  }
  await prisma.artist.update({
    where: {
      id: artistId,
    },
    data: {
      user: {
        update: {
          locked: false,
        },
      },
    },
  });
}

export async function updateArtistAdminMark(artistId: number, newMark: AdminMark) {
  const session = await auth();
  if (!session?.user?.role.includes(Role.ADMINISTRATOR)) {
    forbidden();
  }
  await prisma.artist.update({
    where: {
      id: artistId,
    },
    data: {
      adminMark: newMark,
    },
  });
}
