'use server';

import { forbidden, notFound } from 'next/navigation';
import { auth } from '../auth';
import { ProviderProfileFormValues } from './types';
import { prisma } from '@/prisma/client';
import { Provider } from '@prisma/client';

export async function saveProviderProfile(values: ProviderProfileFormValues) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  await prisma.provider.update({
    where: {
      id: session.user.providerId,
    },
    data: { ...values, updatedAt: new Date() },
  });
}

export async function getMyProfile(): Promise<Provider> {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  return prisma.provider.findUnique({ where: { id: session.user.providerId } }).then((op) => {
    if (op) {
      return op;
    } else {
      notFound();
    }
  });
}
