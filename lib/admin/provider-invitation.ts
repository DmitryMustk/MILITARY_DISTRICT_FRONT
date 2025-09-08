'use server';

import { UserInvitationFormValues } from '@/lib/admin/types';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';
import { logger } from '@/lib/logger';
import { errorResult } from '@/lib/types';
import { randomUUID } from 'crypto';
import { sendMail } from '@/lib/send-mail';
import { getTranslations } from 'next-intl/server';
import { Role } from '@prisma/client';

export async function getAllProviderInvites() {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  return prisma.inviteUser.findMany();
}

export async function inviteUser(formData: UserInvitationFormValues) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  const email = formData.email;
  const organizationName = formData.organizationName;
  const messageSubject = formData.messageSubject;
  const message = formData.message;
  const roles = formData.roles.map((role: { value: string }) => role.value as Role);
  const invitation = await prisma.inviteUser.create({
    data: {
      id: randomUUID(),
      email,
      organizationName,
      messageSubject: messageSubject || null,
      message: message,
      roles,
    },
  });

  logger.info(`Created invite with id ${invitation?.id} for email ${email}`);

  await sendUserInvite(invitation.id, email, roles, messageSubject, message);
}

async function sendUserInvite(uuid: string, email: string, roles: Role[], messageSubject?: string, message?: string) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  const t = await getTranslations('Action.sendUserInvite');

  const inviteUrl = process.env.USER_INVITE_URL + uuid;
  const msgSubject = messageSubject
    ? t('inviteMessageSubject', { messageSubject })
    : t('defaultInviteMessageSubject', {
        role: roles[0]
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      });
  const msg = message
    ? t(`inviteMessage`, { inviteUrl: inviteUrl, message: message })
    : t('defaultInviteMessage', { inviteUrl: inviteUrl });

  const status = await sendMail(email, msgSubject, msg);
  if (!status?.messageId) {
    throw new Error(`Unable to send email to ${email}`);
  }
}

export async function revokeInvitation(id: string) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  await prisma.inviteUser.delete({ where: { id } });
}

export async function resendInvitation(id: string) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  const t = await getTranslations('Action.resendInvitation');

  const invitation = await prisma.inviteUser.findUnique({ where: { id } });
  if (!invitation) {
    logger.warn(`Attempt to resend invitation with id ${id}, but there is no existing invitation for that id.`);

    return errorResult(t(`invitationNotFound`));
  }

  await sendUserInvite(
    invitation.id,
    invitation.email,
    invitation.roles,
    invitation.messageSubject ?? undefined,
    invitation.message ?? undefined
  );
}
