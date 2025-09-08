'use server';

import { prisma } from '@/prisma/client';
import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import { startOfDay } from 'date-fns';
import { $Enums } from '@prisma/client';

export async function getArtistOpportunityInvites() {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }

  return prisma.opportunityInvite.findMany({
    where: {
      artistId: session.user.artistId,
      opportunity: {
        banned: false,
        applicationDeadline: { gte: new Date() },
        provider: {
          user: {
            locked: false,
          },
        },
      },
    },
    include: {
      opportunity: true,
    },
  });
}

export async function getProviderOpportunityInvites(opportunityId: number) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: {
      id: opportunityId,
      providerId: session.user.providerId,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const invites = await prisma.opportunityInvite.findMany({
    where: {
      opportunityId,
      artist: {
        user: {
          locked: false,
        },
        moderationStatus: $Enums.ModerationStatus.Approved,
      },
    },
    include: {
      artist: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const invitesUnregistered = await prisma.opportunityInviteUnregisteredArtist.findMany({
    where: {
      opportunityId: opportunityId,
    },
    select: {
      artistInvite: {
        select: {
          email: true,
        },
      },
      message: true,
      id: true,
      artistInviteId: true,
      opportunityId: true,
    },
    orderBy: {
      artistInvite: {
        createdAt: 'desc',
      },
    },
  });

  const applications = await prisma.opportunityApplication.findMany({
    where: {
      opportunityId,
    },
  });

  return { opportunity, invites, invitesUnregistered, applications };
}

export async function getOpportunityInvitesArtist(artistId: number) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  const artist = await prisma.artist.findUnique({
    where: {
      id: artistId,
      user: {
        locked: false,
      },
    },
  });

  if (!artist) {
    notFound();
  }

  const invites = await prisma.opportunityInvite.findMany({
    where: {
      opportunity: {
        providerId: session.user.providerId,
        applicationDeadline: { gt: startOfDay(new Date()) },
        banned: false,
      },
      artist: {
        id: artistId,
        user: {
          locked: false,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      opportunity: true,
    },
  });

  const applications = await prisma.opportunityApplication.findMany({
    where: {
      opportunityId: { in: invites.map((invite) => invite.id) },
    },
  });

  return { invites, artist, applications };
}

export async function getMyOpportunitiesWithInvites() {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  return prisma.opportunity.findMany({
    where: {
      providerId: session.user.providerId,
      banned: false,
      applicationDeadline: { gt: startOfDay(new Date()) },
    },
    orderBy: {
      id: 'desc',
    },
    include: {
      invites: true,
    },
  });
}
