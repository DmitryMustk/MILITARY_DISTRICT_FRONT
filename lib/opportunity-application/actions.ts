'use server';

import { forbidden, notFound } from 'next/navigation';
import { auth } from '../auth';
import { prisma } from '@/prisma/client';
import { endOfDay } from 'date-fns';
import { OpportunityApplicationFormValues } from './types';
import { Attachment } from '@/lib/types';
import { sendMail } from '../send-mail';
import { logger } from '../logger';
import { getTranslations } from 'next-intl/server';
import { $Enums, OpportunityApplicationStatus } from '@prisma/client';
import { getAvailableOpportunity } from '@/lib/opportunity/queries';
import { fileDelete } from '../files/file-delete';
import { getMyApplications } from '@/lib/opportunity-application/queries';
import { InternalUser } from '@/types/next-auth';
import { ISODateString, Session } from 'next-auth';

export async function createOpportunityApplication(
  values: OpportunityApplicationFormValues,
  opportunityId: number
): Promise<number> {
  const session = await auth();
  const artistId = session?.user?.artistId;
  const projectId = values.projectId ? Number.parseInt(values.projectId) : undefined;

  const previousApplications = await getMyApplications(opportunityId, projectId || null, undefined);

  if (artistId === undefined || previousApplications.length > 0) {
    forbidden();
  }

  const opportunity = await getAvailableOpportunity(opportunityId);

  if (
    projectId !== undefined &&
    !(await prisma.project.findUnique({
      where: { id: projectId, artistId, moderationStatus: $Enums.ModerationStatus.Approved },
    }))
  ) {
    notFound();
  }

  //TODO - add invite only opportunities
  const now = new Date();
  if (endOfDay(opportunity.applicationDeadline).getTime() > now.getTime()) {
    const data = await prisma.opportunityApplication.create({
      data: {
        ...values,
        projectId,
        status: 'new',
        artistId,
        opportunityId,
        createdAt: now,
        updatedAt: now,
      },
    });

    return data.id;
  } else {
    forbidden();
  }
}

async function artistIsApproved(
  session:
    | {
        user?: InternalUser | undefined;
        oauthExternalId?: string | undefined;
        expires: ISODateString | undefined;
      }
    | Session
) {
  return (
    !!session?.user?.artistId &&
    !!(await prisma.artist.findUnique({
      where: { id: session.user.artistId, moderationStatus: $Enums.ModerationStatus.Approved },
    }))
  );
}

async function projectCanBeAttached(
  excludedApplicationId?: number,
  artistId?: number,
  projectId?: number,
  opportunityId?: number
) {
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        banned: false,
        moderationStatus: $Enums.ModerationStatus.Approved,
      },
    });
    if (!project) {
      return false;
    }
  }
  const existingApplication = await prisma.opportunityApplication.findFirst({
    where: {
      artistId: artistId,
      projectId: projectId || null,
      opportunityId: opportunityId,
      NOT: {
        OR: [{ id: excludedApplicationId }, { status: OpportunityApplicationStatus.rejected }],
      },
    },
  });
  return !existingApplication;
}

export async function sendMyApplication(applicationId: number, values: OpportunityApplicationFormValues) {
  const session = await auth();
  const projectId = values.projectId ? Number.parseInt(values.projectId) : undefined;
  if (!session?.user || !(await artistIsApproved(session))) {
    forbidden();
  }

  const application = await prisma.opportunityApplication.findUnique({
    where: { id: applicationId },
    select: { opportunityId: true },
  });

  if (!application) {
    forbidden();
  }

  if (!(await projectCanBeAttached(applicationId, session.user.artistId, projectId, application.opportunityId))) {
    forbidden();
  }

  await prisma.opportunityApplication.update({
    where: { id: applicationId, artistId: session.user.artistId, status: 'new' },
    data: {
      ...values,
      status: 'sent',
      updatedAt: new Date(),
      projectId: projectId || null,
    },
  });

  await prisma.opportunityInvite.updateMany({
    where: {
      artistId: session.user.artistId,
      opportunityId: application?.opportunityId,
    },
    data: {
      status: $Enums.OpportunityInviteStatus.accepted,
    },
  });

  sendEmailProviderByApplicationId(applicationId).catch((err) => {
    logger.warn(err);
  });
}

export async function sendEmailProviderByApplicationId(applicationId: number) {
  const t = await getTranslations('Action.sendEmailProviderByApplicationId');
  const providerRecord = await prisma.opportunityApplication.findUnique({
    where: { id: applicationId },
    select: {
      opportunity: {
        select: {
          id: true,
          provider: {
            select: {
              user: true,
            },
          },
        },
      },
    },
  });
  if (!providerRecord?.opportunity?.provider) {
    throw new Error(`Failed to find provider`);
  }

  const url = process.env.PROVIDER_OPPORTUNITY_APPLICATION_URL;
  const msg = t('applicationMessage', { url: url + `${providerRecord.opportunity.id}` });
  const email = providerRecord.opportunity.provider.user.email;
  if (!email) {
    throw new Error(`Provider email is not verified`);
  }
  const status = await sendMail(email, 'ASA | Opportunity', msg);
  if (!status?.messageId) {
    throw new Error(`Failed to send email`);
  }
}

export async function updateMyApplication(applicationId: number, values: OpportunityApplicationFormValues) {
  const session = await auth();

  if (
    !session?.user?.artistId ||
    (values.projectId !== undefined &&
      !(await prisma.project.findUnique({
        where: {
          id: Number(values.projectId),
          artistId: session.user.artistId,
          moderationStatus: $Enums.ModerationStatus.Approved,
        },
      })))
  ) {
    forbidden();
  }

  const application = await prisma.opportunityApplication.findUnique({
    where: { id: applicationId },
    select: { opportunityId: true },
  });

  if (
    !(await projectCanBeAttached(
      applicationId,
      session.user.artistId,
      values.projectId ? Number(values.projectId) : undefined,
      application?.opportunityId
    ))
  ) {
    forbidden();
  }

  //compare attachments, delete some when required

  const attachments = await prisma.opportunityApplication.findUnique({
    where: { id: applicationId, artistId: session.user.artistId },
    select: { attachments: true },
  });

  if (!attachments) {
    notFound();
  }

  if (attachments.attachments) {
    const atts: Attachment[] = attachments.attachments ? (attachments.attachments as Attachment[]) : [];

    const toDelete = atts.filter(
      (a) => !values.attachments.find((existingAttachment) => existingAttachment.value.id === a.value.id)
    );

    await fileDelete(false, ...toDelete.map((a) => a.value.id));
  }

  await prisma.opportunityApplication.update({
    where: { id: applicationId, artistId: session.user.artistId, status: 'new' },
    data: {
      ...values,
      updatedAt: new Date(),
      projectId: values.projectId ? Number(values.projectId) : null,
    },
  });
}

export async function revokeInvites(revokedApplicationId: number, myArtistId: number) {
  const revokedApplication = await prisma.opportunityApplication.findUnique({
    where: { id: revokedApplicationId },
    select: { opportunityId: true },
  });
  if (!revokedApplication) {
    forbidden();
  }
  const remainingApplications = await prisma.opportunityApplication.findMany({
    where: {
      opportunityId: revokedApplication.opportunityId,
      NOT: {
        id: revokedApplicationId,
      },
      status: {
        in: ['sent', 'shortlisted', 'viewlater'],
      },
    },
    select: { opportunityId: true },
  });
  if (remainingApplications.length === 0) {
    await prisma.opportunityInvite.updateMany({
      where: {
        artistId: myArtistId,
        opportunityId: revokedApplication.opportunityId,
      },
      data: {
        status: $Enums.OpportunityInviteStatus.pending,
      },
    });
  }
}

export async function revokeMyApplication(applicationId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }
  const myArtistId = session.user.artistId;

  await revokeInvites(applicationId, myArtistId);

  await prisma.opportunityApplication.update({
    where: { id: applicationId, artistId: myArtistId, status: 'sent' },
    data: {
      status: 'new',
      updatedAt: new Date(),
    },
  });
}

export async function archiveMyApplication(applicationId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }
  const myArtistId = session.user.artistId;
  await revokeInvites(applicationId, myArtistId);

  await prisma.opportunityApplication.update({
    where: {
      id: applicationId,
      artistId: myArtistId,
      status: {
        in: [
          OpportunityApplicationStatus.new,
          OpportunityApplicationStatus.sent,
          OpportunityApplicationStatus.shortlisted,
          OpportunityApplicationStatus.viewlater,
        ],
      },
    },
    data: {
      status: 'archivedByArtist',
      updatedAt: new Date(),
    },
  });
}

export async function unarchiveMyApplication(applicationId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }

  await prisma.opportunityApplication.update({
    where: { id: applicationId, artistId: session.user.artistId },
    data: {
      status: 'new',
      updatedAt: new Date(),
    },
  });
}

export async function deleteMyApplication(applicationId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }
  const myArtistId = session.user.artistId;
  await revokeInvites(applicationId, myArtistId);

  const attachments = await prisma.opportunityApplication.findUnique({
    where: { id: applicationId, artistId: myArtistId },
    select: { attachments: true },
  });

  if (!attachments) {
    notFound();
  }

  if (attachments.attachments) {
    const atts: Attachment[] = attachments.attachments ? (attachments.attachments as Attachment[]) : [];

    await fileDelete(false, ...atts.map((a) => a.value.id));
  }

  await prisma.opportunityApplication.delete({ where: { id: applicationId, artistId: myArtistId } });
}

// For providers:

export async function rejectApplication(applicationId: number, blockApplicant?: boolean) {
  const session = await auth();
  const providerId = session?.user?.providerId;
  if (!providerId) {
    forbidden();
  }

  await prisma.$transaction(async () => {
    const updatedApplication = await prisma.opportunityApplication.update({
      where: {
        id: applicationId,
        opportunity: {
          providerId: providerId,
        },
      },
      data: {
        status: 'rejected',
        updatedAt: new Date(),
      },
    });
    if (blockApplicant) {
      await prisma.provider.update({
        where: {
          id: providerId,
        },
        data: {
          blockedArtists: { connect: { id: updatedApplication.artistId } },
        },
      });
    }
  });
}

export async function removeRejectedApplication(applicationId: number) {
  const session = await auth();
  const providerId = session?.user?.providerId;
  if (!providerId) {
    forbidden();
  }

  await prisma.$transaction(async () => {
    const updatedApplication = await prisma.opportunityApplication.update({
      where: {
        id: applicationId,
        opportunity: {
          providerId: providerId,
        },
        status: { notIn: ['archivedByArtist'] },
      },
      data: {
        status: 'sent',
        updatedAt: new Date(),
      },
    });
    await prisma.provider.update({
      where: {
        id: providerId,
      },
      data: {
        blockedArtists: { disconnect: { id: updatedApplication.artistId } },
      },
    });
  });
}

export async function unblockArtist(artistId: number) {
  const session = await auth();
  const providerId = session?.user?.providerId;
  if (!providerId) {
    forbidden();
  }
  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      blockedArtists: { disconnect: { id: artistId } },
    },
  });
}

export async function changeApplicationStatusByProvider(
  applicationId: number,
  status: Exclude<Exclude<OpportunityApplicationStatus, 'new'>, 'rejected'>
) {
  const session = await auth();
  if (!session?.user?.providerId) {
    forbidden();
  }

  await prisma.opportunityApplication.update({
    where: {
      id: applicationId,
      opportunity: {
        providerId: session.user.providerId,
      },
      status: { notIn: ['rejected', 'new', 'archivedByArtist'] },
    },
    data: {
      status: status,
      updatedAt: new Date(),
    },
  });
}
