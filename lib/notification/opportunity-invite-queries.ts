import { prisma } from '@/prisma/client';
import { $Enums } from '@prisma/client';
import { forbidden } from 'next/navigation';

export async function getOpportunityInvitesNotificationHistory(token: string) {
  const schedulerToken = process.env.SCHEDULER_TOKEN;
  if (!schedulerToken || token !== schedulerToken) {
    forbidden();
  }

  return await prisma.opportunityInvite.findMany({
    select: {
      id: true,
      notificationHistory: {
        select: {
          createdAt: true,
        },
      },
      opportunity: {
        select: {
          title: true,
          applicationDeadline: true,
        },
      },
      artist: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    where: {
      opportunity: {
        banned: false,
        visibility: { not: $Enums.OpportunityVisibility.nobody },
        applicationDeadline: {
          gte: new Date(),
        },
      },
      artist: {
        active: true,
        moderationStatus: $Enums.ModerationStatus.Approved,
      },
      status: $Enums.OpportunityInviteStatus.pending,
    },
  });
}
