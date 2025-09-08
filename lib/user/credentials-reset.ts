'use server';

import { prisma } from '@/prisma/client';
import { sendMail } from '@/lib/send-mail';
import { getTranslations } from 'next-intl/server';
import { logger } from '@/lib/logger';
import { UserPasswordFormValues } from '@/lib/user/types';
import { forbidden, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { errorResult, ServerActionResult, successResult } from '@/lib/types';

const RESET_PASSWORD_COOLDOWN_MS =
  parseInt(process.env.RESET_PASSWORD_COOLDOWN_MINUTES || '1', 10) * 60 * 1000 || 5 * 60 * 1000;

export async function sendResetPasswordMessage(email: string): Promise<ServerActionResult> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('This email is not registered');
  }
  const t = await getTranslations('Action.sendResetEmail');

  const existingRequest = await prisma.passwordResetRequest.findUnique({
    where: { email },
  });

  if (existingRequest) {
    const timeSinceLastSent = new Date().getTime() - existingRequest.createdAt.getTime();
    if (timeSinceLastSent < RESET_PASSWORD_COOLDOWN_MS) {
      const remainingTimeMs = RESET_PASSWORD_COOLDOWN_MS - timeSinceLastSent;
      const totalSeconds = Math.floor(remainingTimeMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      logger.warn(`Attempt to send reset password email to ${email} failed due to cooldown`);
      return errorResult(t('cooldownError', { formattedTime }));
    }
  }

  await prisma.passwordResetRequest.deleteMany({ where: { email: email } });

  const resetRequest = await prisma.passwordResetRequest.create({
    data: { email },
  });

  const resetUrl = process.env.RESET_PASSWORD_URL + resetRequest.id;

  const status = await sendMail(email, t('resetEmailMessageSubject'), t('resetEmailMessage', { resetUrl: resetUrl }));
  if (!status?.messageId) {
    throw new Error(`Unable to send email to ${email}`);
  }

  return successResult();
}

export async function getPasswordResetRequest(id: string) {
  return prisma.passwordResetRequest.findUnique({ where: { id } });
}

export async function getEmailResetRequest(id: string) {
  return prisma.emailResetRequest.findUnique({ where: { id } });
}

export async function resetPassword(requestId: string, values: UserPasswordFormValues) {
  const session = await auth();
  if (session) {
    forbidden();
  }
  const t = await getTranslations('Action.resetPassword');

  const request = await prisma.passwordResetRequest.findUnique({ where: { id: requestId } });
  if (!request) {
    logger.warn(`Request with id ${requestId} not found`);
    notFound();
  }

  const user = await prisma.user.findUnique({ where: { email: request.email } });
  if (!user) {
    logger.warn(`User with email ${request.email} not found`);
    notFound();
  }

  if (user.password) {
    const isSamePassword = await bcrypt.compare(values.password, user.password);
    if (isSamePassword) {
      return errorResult(t('samePasswordError'));
    }
  }

  await prisma.$transaction(async () => {
    await prisma.user.update({
      where: { email: request.email },
      data: {
        password: bcrypt.hashSync(values.password),
      },
    });

    await prisma.passwordResetRequest.delete({
      where: {
        id: requestId,
      },
    });
  });

  return successResult();
}

export async function resetEmail(requestId: string) {
  const session = await auth();
  const t = await getTranslations('Action.resetEmail');
  if (!session?.user) {
    forbidden();
  }

  const request = await prisma.emailResetRequest.findUnique({ where: { id: requestId } });
  if (!request) {
    logger.warn(`Request with id ${requestId} not found`);
    return errorResult(t('requestNotExistError'));
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (request.currentEmail !== user?.email) {
    logger.warn(`User ${user?.id} tries to change email by request ${request.id}`);
    return errorResult(t('someoneElseVerifyLinkError'));
  }

  await prisma.$transaction(async () => {
    await prisma.user.update({
      where: { email: request.currentEmail },
      data: {
        email: request.newEmail,
      },
    });

    await prisma.emailResetRequest.delete({
      where: { id: requestId },
    });
  });

  return successResult();
}

export async function sendEmailVerification(email: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    forbidden();
  }
  const user = await prisma.user.findUnique({ where: { id: session?.user.id } });
  if (user == null || user.email == null) {
    forbidden();
  }

  await prisma.emailResetRequest.deleteMany({ where: { newEmail: email } });

  const resetEmailRequest = await prisma.emailResetRequest.create({
    data: {
      currentEmail: user.email,
      newEmail: email,
    },
  });

  const t = await getTranslations('Action.sendEmailVerification');
  const verificationUrl = process.env.EMAIL_VERIFICATION_URL + resetEmailRequest.id;
  const status = await sendMail(
    email,
    t('emailVerificationMessageSubject'),
    t('verifyEmailMessage', { verificationUrl: verificationUrl })
  );
  if (!status?.messageId) {
    throw new Error(`Unable to send email to ${email}`);
  }
}
