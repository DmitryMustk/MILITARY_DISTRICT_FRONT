'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { forbidden, notFound } from 'next/navigation';
import { OpportunityServerInput } from '@/lib/opportunity/types';
import { Attachment } from '../types';
import { fileDelete } from '../files/file-delete';

export async function updateOpportunity(opportunityId: number, opportunity: OpportunityServerInput) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  //compare attachments, delete some when required

  const attachments = await prisma.opportunity.findUnique({
    where: { id: opportunityId, providerId: session.user.providerId },
    select: { attachments: true },
  });

  if (!attachments) {
    notFound();
  }
  if (attachments.attachments) {
    const atts: Attachment[] = attachments.attachments ? (attachments.attachments as Attachment[]) : [];

    const toDelete = atts.filter(
      (a) => !opportunity.attachments.find((existingAttachment) => existingAttachment.value.id === a.value.id)
    );

    await fileDelete(false, ...toDelete.map((a) => a.value.id));
  }

  await prisma.opportunity.update({
    where: {
      providerId: session.user.providerId,
      id: opportunityId,
    },
    data: {
      ...opportunity,
      applicationDeadline: new Date(`${opportunity.applicationDeadline}T12:00:00Z`),
      responseDeadline: opportunity.responseDeadline ? new Date(`${opportunity.responseDeadline}T12:00:00Z`) : null,
    },
  });
}

export async function createOpportunity(opportunity: OpportunityServerInput) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  await prisma.opportunity.create({
    data: {
      ...opportunity,
      applicationDeadline: new Date(`${opportunity.applicationDeadline}T12:00:00Z`),
      responseDeadline: opportunity.responseDeadline ? new Date(`${opportunity.responseDeadline}T12:00:00Z`) : null,
      providerId: session.user.providerId,
    },
  });
}

export async function deleteOpportunity(opportunityId: number) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  const attachments = await prisma.opportunity.findUnique({
    where: { id: opportunityId, providerId: session.user.providerId },
    select: { attachments: true },
  });

  if (!attachments) {
    notFound();
  }
  if (attachments.attachments) {
    const atts: Attachment[] = attachments.attachments ? (attachments.attachments as Attachment[]) : [];

    await fileDelete(false, ...atts.map((a) => a.value.id));
  }

  await prisma.opportunity.delete({
    where: {
      id: opportunityId,
      providerId: session.user.providerId,
    },
  });
}
