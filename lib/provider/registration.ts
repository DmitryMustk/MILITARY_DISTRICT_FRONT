'use server';

import { errorResult } from '@/lib/types';
import { logger } from '@/lib/logger';
import { ProviderRegistrationFormValues, ProviderRegistrationRequestFormValues } from '@/lib/provider/types';
import { sendMail } from '@/lib/send-mail';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma/client';
import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import bcrypt from 'bcryptjs';

const ADMIN_MAILS = process.env.ADMIN_MAILS;

export async function sendProviderApplication(values: ProviderRegistrationRequestFormValues) {
  const t = await getTranslations('Action.sendProviderApplication');
  const message = t('msgNewOpportunityProviderApplication', {
    email: values.email,
    organizationName: values.organizationName || 'N/D',
    representativeName: values.representativeName || 'N/D',
    phone: values.phone || 'N/D',
    information: values.information,
  });

  if (!ADMIN_MAILS) {
    throw new Error(t('adminMailNotSpecified'));
  }

  const statuses = await Promise.all(
    ADMIN_MAILS.split(` `).map((adminMail) => sendMail(adminMail, t('opportunityProviderApplication'), message))
  );
  if (statuses.some((status) => !status?.messageId)) {
    logger.warn(`Some emails have not been sent`);

    return errorResult(t('errorSubmit'));
  }
}

export async function getUserInvite(id: string) {
  return prisma.inviteUser.findUnique({ where: { id } });
}

export async function registerUserByInvite(inviteId: string, values: ProviderRegistrationFormValues) {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const invite = await prisma.inviteUser.findUnique({ where: { id: inviteId } });
  if (!invite) {
    logger.warn(`Invitation with id ${inviteId} not found`);

    notFound();
  }

  await prisma.$transaction(async () => {
    await prisma.user.create({
      data: {
        username: values.account.username,
        password: bcrypt.hashSync(values.account.password),
        email: invite.email,
        role: invite.roles,
        urlHomePage: '/',
        provider: {
          create: {
            organizationName: values.professional.organizationName,
            representativeName: values.professional.representativeName,
            website: values.professional.website,
            information: values.professional.information,
            phone: values.professional.phone,
          },
        },
      },
    });

    await prisma.inviteUser.delete({
      where: {
        id: inviteId,
      },
    });
  });
}
