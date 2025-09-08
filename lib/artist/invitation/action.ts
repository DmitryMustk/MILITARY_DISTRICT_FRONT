'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { logger } from '@/lib/logger';
import { randomUUID } from 'crypto';
import { ArtistInvitationFormValues } from '@/lib/artist/types';
import { sendMail } from '@/lib/send-mail';
import { errorResult, successResult } from '@/lib/types';
import { forbidden } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const EMAIL_MIN_TIMEOUT = 5 * 60 * 1000;

export async function inviteArtist(formData: ArtistInvitationFormValues) {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const t = await getTranslations('Action.inviteArtist');
  const email = formData.email;

  const invitationOrError = await prisma.$transaction(async () => {
    const artist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (artist) {
      logger.warn(
        `Attempt to create invite with email ${email}. Failed to create because artist with this email already exists.`
      );

      return {
        errorResult: errorResult(t('artistExists')),
      };
    }

    let invitation = await prisma.inviteArtist.findUnique({
      where: {
        email,
      },
    });

    if (invitation && invitation.sentAt) {
      const passedInterval = new Date().valueOf() - invitation.sentAt.valueOf();
      if (passedInterval < EMAIL_MIN_TIMEOUT) {
        logger.warn(
          `Attempt to create invite with email ${email}. Failed to create because the timeout has not passed.`
        );

        return {
          errorResult: errorResult(
            t('emailTimeout', { timeoutMinutes: Math.ceil((EMAIL_MIN_TIMEOUT - passedInterval) / 1000 / 60) })
          ),
        };
      }
    }

    if (!invitation) {
      invitation = await prisma.inviteArtist.create({
        data: {
          email: email,
          id: randomUUID(),
        },
      });

      logger.info(`Created invite with id ${invitation?.id} for email ${email}`);
    }

    return { invitation };
  });

  if (invitationOrError.errorResult) {
    return invitationOrError.errorResult;
  }

  const { invitation } = invitationOrError;

  try {
    await sendInvite(invitation.id, email);
  } catch (error) {
    logger.error(`Unable to send invitation: ${error}`);

    return errorResult(t(`emailError`));
  }

  await prisma.inviteArtist.update({
    where: {
      id: invitation.id,
    },
    data: {
      sentAt: new Date(),
    },
  });

  return successResult();
}

async function sendInvite(uuid: string, email: string) {
  const inviteUrl = process.env.ARTIST_INVITE_URL + uuid;
  const t = await getTranslations('Action.sendInvite');
  const message = t('inviteMessage', { inviteUrl: inviteUrl });

  const status = await sendMail(email, 'ASA | Registration', message);

  if (!status?.messageId) {
    throw new Error(`Unable to send email to ${email}`);
  }
}
