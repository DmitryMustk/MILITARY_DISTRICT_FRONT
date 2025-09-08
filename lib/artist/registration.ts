'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { errorResult, ServerActionResult, successResult } from '@/lib/types';
import { ArtistRegistrationFormValues, ArtistRegistrationOAuthFormValues } from '@/lib/artist/types';
import { forbidden, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { $Enums } from '@prisma/client';

export type ArtistInvitedBy = 'himself' | 'provider';

const opportunityInvitesUrl = '/opportunities?invite=invites';

export async function registerArtistByInvite(
  invitationId: string,
  values: ArtistRegistrationFormValues
): Promise<ServerActionResult> {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const invitation = await prisma.inviteArtist.findUnique({
    where: {
      id: invitationId,
    },
    include: {
      opportunityInvites: true,
    },
  });
  if (!invitation) {
    logger.warn(`Invitation with id ${invitationId} not found`);

    notFound();
  }
  const invitedBy = invitation.opportunityInvites.length > 0 ? 'provider' : 'himself';

  const t = await getTranslations('Action.registerArtistByInvite');
  const userByUsername = await prisma.user.findUnique({ where: { username: values.account.username } });
  if (userByUsername) {
    logger.warn(
      `Attempt to register artist with email ${invitation.email} is failed because username ${values.account.username} is busy.`
    );

    return errorResult(t('usernameBusy'));
  }

  const userByEmail = await prisma.user.findUnique({ where: { email: invitation.email } });
  if (userByEmail) {
    logger.warn(`Attempt to register artist with email: ${invitation.email} is failed because email is busy.`);

    return errorResult(t('emailBusy'));
  }

  await prisma.$transaction(async () => {
    const createdUser = await prisma.user.create({
      select: {
        artist: {
          select: {
            id: true,
          },
        },
      },
      data: {
        username: values.account.username,
        password: bcrypt.hashSync(values.account.password),
        email: invitation.email,
        role: ['ARTIST'],
        urlHomePage: invitedBy === 'provider' ? opportunityInvitesUrl : '/',
        artist: {
          create: {
            active: true,
            bio: values.profile.bio,
            languages: values.professional.languages.map((lang) => lang.value),
            firstName: values.personal.firstName,
            lastName: values.personal.lastName,
            phone: values.personal.phone,
            industry: values.professional.industry.map((i) => i.value),
            links: values.profile.links.map((val) => val.value),
            title: values.professional.title,
            countryResidence: values.personal.countryResidence,
            countryCitizenship: values.personal.countryCitizenship,
            artistName: values.profile.artistName,
            theme: values.professional.theme.map((val) => val.value),
            statement: values.profile.statement,
            birthDay: values.personal.birthDay,
            moderationStatus: $Enums.ModerationStatus.Draft,
            moderationComment: '',
          },
        },
      },
    });

    if (invitedBy === 'provider') {
      const opportunityInvites = await prisma.opportunityInviteUnregisteredArtist.findMany({
        where: {
          artistInviteId: invitation.id,
        },
        select: {
          opportunityId: true,
          message: true,
        },
      });
      await prisma.opportunityInvite.createMany({
        data: opportunityInvites.map((invite) => ({
          artistId: createdUser.artist!.id,
          opportunityId: invite.opportunityId,
          message: invite.message,
          status: $Enums.OpportunityInviteStatus.pending,
        })),
      });
    }

    await prisma.inviteArtist.delete({
      where: {
        id: invitationId,
      },
    });
  });

  return successResult();
}

export async function registerOAuthArtistByInvite(
  values: ArtistRegistrationOAuthFormValues
): Promise<ServerActionResult> {
  const session = await auth();
  const externalId = session?.oauthExternalId;
  if (!session || session.user || !externalId) {
    forbidden();
  }

  const invitation = await prisma.inviteArtist.findUnique({
    where: {
      oauthExternalId: externalId,
    },
    include: {
      opportunityInvites: true,
    },
  });
  if (!invitation) {
    logger.warn(`Invitation with external id ${externalId} not found`);

    notFound();
  }
  const invitedBy = invitation.opportunityInvites.length > 0 ? 'provider' : 'himself';

  const t = await getTranslations('Action.registerOauthArtistByInvite');
  const userByUsername = await prisma.user.findUnique({ where: { username: values.account.username } });
  if (userByUsername) {
    logger.warn(
      `Attempt to register artist with email ${invitation.email} is failed because username ${values.account.username} is busy.`
    );

    return errorResult(t('usernameBusy'));
  }

  const userByEmail = await prisma.user.findUnique({ where: { email: invitation.email } });
  if (userByEmail) {
    logger.warn(`Attempt to register artist with email: ${invitation.email} is failed because email is busy.`);

    return errorResult(t('emailBusy'));
  }

  await prisma.$transaction(async () => {
    const createdUser = await prisma.user.create({
      select: {
        artist: {
          select: {
            id: true,
          },
        },
      },
      data: {
        oauthExternalId: externalId,
        username: values.account.username,
        role: ['ARTIST'],
        urlHomePage: invitedBy === 'provider' ? opportunityInvitesUrl : '/',
        email: invitation.email,
        artist: {
          create: {
            active: true,
            bio: values.profile.bio,
            languages: values.professional.languages.map((lang) => lang.value),
            firstName: values.personal.firstName,
            lastName: values.personal.lastName,
            phone: values.personal.phone,
            industry: values.professional.industry.map((i) => i.value),
            links: values.profile.links.map((val) => val.value),
            title: values.professional.title,
            countryResidence: values.personal.countryResidence,
            countryCitizenship: values.personal.countryCitizenship,
            artistName: values.profile.artistName,
            theme: values.professional.theme.map((val) => val.value),
            statement: values.profile.statement,
            birthDay: values.personal.birthDay,
            moderationStatus: $Enums.ModerationStatus.Draft,
            moderationComment: '',
          },
        },
      },
    });

    if (invitedBy === 'provider') {
      const opportunityInvites = await prisma.opportunityInviteUnregisteredArtist.findMany({
        where: {
          artistInviteId: invitation.id,
        },
        select: {
          opportunityId: true,
          message: true,
        },
      });
      await prisma.opportunityInvite.createMany({
        data: opportunityInvites.map((invite) => ({
          artistId: createdUser.artist!.id,
          opportunityId: invite.opportunityId,
          message: invite.message,
          status: $Enums.OpportunityInviteStatus.pending,
        })),
      });
    }

    await prisma.inviteArtist.delete({
      where: {
        oauthExternalId: externalId,
      },
    });
  });

  return successResult();
}
