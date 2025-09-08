'use server';

import { prisma } from '@/prisma/client';
import { auth } from '../auth';
import { forbidden } from 'next/navigation';

export async function getUrlHomePage(username: string) {
  return await prisma.user.findUnique({
    where: { username: username },
    select: {
      urlHomePage: true,
    },
  });
}

export async function getUrlHomePageOAuth() {
  const session = await auth();
  if (!session?.user?.oauthExternalId) {
    forbidden();
  }
  return await prisma.user.findUnique({
    where: { oauthExternalId: session.user.oauthExternalId },
    select: {
      urlHomePage: true,
    },
  });
}

export async function isEmailRegistered(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  // cast to boolean
  return !!user;
}

export async function getUserRolesByUsername(username: string) {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      role: true,
    },
  });
}
