'use server';

import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import { prisma } from '@/prisma/client';
import { $Enums } from '@prisma/client';
import { errorResult, ServerActionResult, successResult } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { sendMail } from '@/lib/send-mail';
import { logger } from '@/lib/logger';
import { UnregisteredArtistInviteFormValues } from './types';
import { randomUUID } from 'crypto';
import { startOfDay } from 'date-fns';

export async function createOpportunityInvites(
  opportunityId: number,
  message: string,
  invites: {
    artistId: number;
    message?: string;
  }[]
) {
  const session = await auth();
  const t = await getTranslations('Action.createOpportunityInvites');

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

  if (opportunity.banned) {
    forbidden();
  }

  for (let i = 0; i < invites.length; ++i) {
    if (
      !(await prisma.artist.findUnique({
        where: { id: invites[i].artistId, moderationStatus: $Enums.ModerationStatus.Approved },
      }))
    ) {
      forbidden();
    }
  }

  await prisma.opportunityInvite.createMany({
    data: invites.map((invite) => ({
      artistId: invite.artistId,
      opportunityId,
      message: invite.message || message,
      status: $Enums.OpportunityInviteStatus.pending,
    })),
  });

  const emails = await prisma.artist.findMany({
    where: {
      id: { in: invites.map((invite) => invite.artistId) },
    },
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const url = process.env.ARTISTS_OPPORTUNITY_INVITES_URL;

  Promise.all(
    emails.map((artist, idx) => {
      const msg = t('inviteMessage', { msg: invites[idx].message || message, url: url });
      const email = artist.user.email;
      if (email) {
        return sendMail(email, 'ASA | Opportunity Invite', msg);
      }
    })
  ).then((statuses) => {
    if (statuses.some((status) => !status?.messageId)) {
      logger.warn(`Some emails have not been sent`);
    }
  });
}

export async function createArtistOpportunityInvites(
  artistId: number,
  message: string,
  invites: {
    opportunityId: number;
    message?: string;
  }[]
) {
  const session = await auth();
  const t = await getTranslations('Action.createArtistOpportunityInvites');

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
    include: {
      user: true,
    },
  });

  if (!artist) {
    notFound();
  }

  const opportunityIds = await prisma.opportunity.findMany({
    where: {
      id: { in: invites.map((invite) => invite.opportunityId) },
      banned: false,
      applicationDeadline: { gt: startOfDay(new Date()) },
    },
    select: {
      id: true,
    },
  });

  if (opportunityIds.length !== invites.length) {
    // For the case when the user sends incorrect data directly.
    forbidden();
  }

  await prisma.opportunityInvite.createMany({
    data: invites.map((invite) => ({
      artistId: artistId,
      opportunityId: invite.opportunityId,
      message: invite.message || message,
      status: $Enums.OpportunityInviteStatus.pending,
    })),
  });

  const url = process.env.ARTISTS_OPPORTUNITY_INVITES_URL;

  Promise.all(
    invites.map((invite) => {
      const msg = t('inviteMessage', { msg: invite.message || message, url: url });
      const email = artist.user.email;
      if (email) {
        return sendMail(email, 'ASA | Opportunity Invite', msg);
      }
    })
  ).then((statuses) => {
    if (statuses.some((status) => !status?.messageId)) {
      logger.warn(`Some emails have not been sent`);
    }
  });
}

export async function deleteOpportunityInvite(opportunityInviteId: number): Promise<ServerActionResult> {
  const session = await auth();
  const t = await getTranslations('Action.deleteOpportunityInvite');

  if (!session?.user?.providerId) {
    forbidden();
  }

  const opportunityInvite = await prisma.opportunityInvite.findUnique({
    where: {
      id: opportunityInviteId,
      opportunity: {
        providerId: session.user.providerId,
      },
    },
  });

  if (!opportunityInvite) {
    notFound();
  }

  if (opportunityInvite.status !== $Enums.OpportunityInviteStatus.pending) {
    return errorResult(t('failedDelete'));
  }

  await prisma.opportunityInvite.delete({
    where: {
      id: opportunityInviteId,
      opportunity: {
        providerId: session.user.providerId,
      },
    },
  });

  return successResult();
}

export async function createOpportunityInvitesUnregistered(
  values: UnregisteredArtistInviteFormValues,
  opportunityId: number
): Promise<ServerActionResult<string>> {
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

  if (opportunity.banned) {
    forbidden();
  }

  const t = await getTranslations('Action.createOpportunityInvitesUnregistered');
  const emails = values.invites.map((val) => val.email);
  const existedEmails = await prisma.artist.findMany({
    where: {
      user: { email: { in: emails } },
    },
    select: {
      user: { select: { email: true } },
    },
  });
  if (existedEmails.length !== 0) {
    return errorResult(t('artistsWithEmailExist', { emails: existedEmails.map((val) => val.user.email).join(', ') }));
  }

  const existedInvites = await prisma.inviteArtist.findMany({
    where: {
      email: { in: emails },
      opportunityInvites: {
        some: {
          opportunityId: opportunityId,
        },
      },
    },
    select: {
      email: true,
    },
  });
  if (existedInvites.length !== 0) {
    return errorResult(t('invitesWithEmailExist', { emails: existedInvites.map((val) => val.email).join(', ') }));
  }

  await prisma.$transaction(async () => {
    for (const invite of values.invites) {
      const msg = invite.message === '' ? values.message : invite.message;
      await prisma.inviteArtist.upsert({
        where: {
          email: invite.email,
        },
        update: {
          opportunityInvites: {
            create: {
              message: msg,
              opportunityId: opportunityId,
            },
          },
        },
        create: {
          email: invite.email,
          id: randomUUID(),
          createdByArtist: false,
          opportunityInvites: {
            create: {
              message: msg,
              opportunityId: opportunityId,
            },
          },
        },
      });
    }
  });

  const invites = await prisma.inviteArtist.findMany({
    where: {
      email: { in: emails },
    },
    select: {
      id: true,
      opportunityInvites: {
        where: {
          opportunityId: opportunityId,
        },
      },
      email: true,
    },
  });

  Promise.all(
    invites.map((val, idx) => {
      const url = process.env.ARTIST_INVITE_URL + val.id;
      const message = val.opportunityInvites[0].message === '' ? values.message : val.opportunityInvites[0].message;
      const msg = opportunity.maxGrantAmount
        ? t('inviteMessageWithMaxAmount', {
            msg: message,
            inviteUrl: url,
            desc: opportunity.description,
            maxAmount: opportunity.maxGrantAmount,
          })
        : t('inviteMessageWithoutMaxAmount', {
            msg: message,
            inviteUrl: url,
            desc: opportunity.description,
          });
      const subject =
        values.invites[idx].subject === ''
          ? values.subject === ''
            ? t('asa')
            : values.subject
          : values.invites[idx].subject;
      return sendMail(val.email, subject, msg);
    })
  ).then((statuses) => {
    if (statuses.some((status) => !status?.messageId)) {
      logger.warn(`Some emails have not been sent`);
    }
  });

  return successResult();
}

export async function deleteOpportunityInviteUnregistered(opportunityId: number) {
  const session = await auth();
  const t = await getTranslations('Action.deleteOpportunityInviteUnregistered');
  const providerId = session?.user?.providerId;
  if (!providerId) {
    forbidden();
  }

  const invite = await prisma.opportunityInviteUnregisteredArtist.findUnique({
    where: {
      id: opportunityId,
      opportunity: {
        providerId: session.user!.providerId,
      },
    },
    select: {
      artistInvite: {
        select: {
          opportunityInvites: true,
          createdByArtist: true,
          id: true,
          email: true,
        },
      },
    },
  });

  if (!invite) {
    return notFound();
  }

  if (invite.artistInvite.opportunityInvites.length === 1 && !invite.artistInvite.createdByArtist) {
    await prisma.inviteArtist.delete({
      where: { id: invite.artistInvite.id },
    });
    const res = await sendMail(invite.artistInvite.email, 'ASA | Registration', t('inviteCancelled'));
    if (!res?.messageId) {
      logger.warn(`Failed to send mail to ${invite.artistInvite.email}.`);
    }
    return;
  }
  await prisma.opportunityInviteUnregisteredArtist.delete({
    where: { id: opportunityId },
  });
}

export async function rejectOpportunityInvite(opportunityId: number) {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    forbidden();
  }

  await prisma.opportunityInvite.updateMany({
    where: {
      artistId,
      opportunityId,
      status: 'pending',
    },
    data: {
      status: 'rejected',
    },
  });
}

export async function cancelOpportunityInviteRejection(opportunityId: number) {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    forbidden();
  }

  await prisma.opportunityInvite.updateMany({
    where: {
      artistId,
      opportunityId,
      status: 'rejected',
    },
    data: {
      status: 'pending',
    },
  });
}
