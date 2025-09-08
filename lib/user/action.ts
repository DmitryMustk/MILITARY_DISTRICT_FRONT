'use server';

import { forbidden } from 'next/navigation';
import { auth } from '../auth';
import { UserPasswordFormValues } from './types';
import { prisma } from '@/prisma/client';
import bcrypt from 'bcryptjs';

export async function updatePassword(formData: UserPasswordFormValues) {
  const session = await auth();
  if (!session?.user?.id || session.user.oauthExternalId) {
    forbidden();
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: bcrypt.hashSync(formData.password),
    },
  });
}

export async function clearUrlHomePage(username: string) {
  await prisma.user.update({
    where: { username: username },
    data: {
      urlHomePage: null,
    },
  });
}

export async function clearUrlHomePageOAuth() {
  const session = await auth();
  if (!session?.user?.oauthExternalId) {
    forbidden();
  }
  await prisma.user.update({
    where: { oauthExternalId: session.user.oauthExternalId },
    data: {
      urlHomePage: null,
    },
  });
}
