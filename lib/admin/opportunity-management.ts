'use server';

import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';

export async function getBannedOpportunitiesPage(page: number, opportunitiesPerPage: number) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  return prisma.$transaction(async () => {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        banned: true,
      },
      include: {
        provider: {
          select: {
            organizationName: true,
          },
        },
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * opportunitiesPerPage,
      take: opportunitiesPerPage,
    });

    const count = await prisma.opportunity.count({
      where: {
        banned: true,
      },
    });

    return [opportunities, count] as const;
  });
}

export async function setOpportunityBanned(id: number, banned: boolean) {
  const session = await auth();
  if (!session?.user?.role.includes(`ADMINISTRATOR`)) {
    forbidden();
  }

  await prisma.opportunity.update({
    where: { id },
    data: { banned },
  });
}
