'use server';

import { prisma } from '@/prisma/client';
import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { UserRegistrationFormValues } from '@/lib/user/types';

export async function isUsernameAvailable(username: string): Promise<boolean> {
  if (!username) return true;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  return !existingUser;
}

export async function registerUserByInvite(inviteId: string, values: UserRegistrationFormValues) {
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
        username: values.username,
        password: bcrypt.hashSync(values.password),
        email: invite.email,
        role: invite.roles,
        urlHomePage: '/',
      },
    });

    await prisma.inviteUser.delete({
      where: {
        id: inviteId,
      },
    });
  });
}
