'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { $Enums } from '@prisma/client';
import { logger } from '../logger';
import { Attachment, ServerActionResult, successResult } from '../types';
import { PosterImageValues, ProjectFormValues } from './types';
import { forbidden, notFound } from 'next/navigation';
import { fileDelete } from '../files/file-delete';
import { revokeInvites } from '../opportunity-application/actions';

export async function createProject(formData: ProjectFormValues): Promise<ServerActionResult> {
  const session = await auth();
  if (!session?.user?.artistId) {
    logger.warn(`Attempt to create project as unauthorized user.`);
    forbidden();
  }

  const artistId = session.user.artistId;
  await prisma.project.create({
    data: {
      artistId: artistId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags.map((tag) => tag.value),
      exclusiveSupport: formData.exclusiveSupport,
      moderationStatus: $Enums.ModerationStatus.Draft,
      moderationComment: '',
      hidden: formData.hidden,
      attachments: formData.attachments,
      budget: formData.budget,
      reach: formData.reach,
      link: formData.link,
      posterImage: formData.posterImage,
    },
  });

  logger.info(`Artist with id ${artistId} successfully created project`);
  return successResult();
}

export async function updateProject(projectId: number, formData: ProjectFormValues): Promise<ServerActionResult> {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    logger.warn(
      `Attempt to change project with id ${projectId}. Failed to change because this action is prohibited for unauthorized users`
    );
    forbidden();
  }

  //compare attachments, delete some when required
  const attachmentRecords = await prisma.project.findUnique({
    where: { id: projectId, artistId: artistId },
    select: { attachments: true, posterImage: true },
  });
  if (!attachmentRecords) {
    notFound();
  }
  if (attachmentRecords.attachments) {
    const attachments: Attachment[] = attachmentRecords.attachments
      ? (attachmentRecords.attachments as Attachment[])
      : [];

    const toDelete = attachments.filter(
      (a) => !formData.attachments.find((existingAttachment) => existingAttachment.value.id === a.value.id)
    );

    await fileDelete(false, ...toDelete.map((a) => a.value.id));
  }

  // delete old poster image if need
  const lastPosterImageId = (attachmentRecords.posterImage as PosterImageValues).value?.id;
  if (lastPosterImageId && lastPosterImageId !== formData.posterImage.value?.id) {
    await fileDelete(false, lastPosterImageId);
  }

  await prisma.project.update({
    where: {
      id: projectId,
      artistId: artistId,
    },
    data: {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags.map((tag) => tag.value),
      exclusiveSupport: formData.exclusiveSupport,
      moderationStatus: $Enums.ModerationStatus.Draft,
      moderationComment: '',
      hidden: formData.hidden,
      attachments: formData.attachments,
      budget: formData.budget,
      reach: formData.reach,
      link: formData.link ?? null,
      posterImage: formData.posterImage,
    },
  });

  logger.info(`Artist with id ${session.user!.artistId} successfully updated project with id ${projectId}`);
  return successResult();
}

export async function deleteProject(projectId: number): Promise<ServerActionResult> {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    logger.warn(
      `Attempt to delete project with id ${projectId}. Failed to delete because this action is prohibited for unauthorized users`
    );
    forbidden();
  }

  const projectAttachments = await prisma.project.findUnique({
    where: { id: projectId, artistId: artistId },
    select: { attachments: true },
  });

  if (!projectAttachments) {
    notFound();
  }
  if (projectAttachments.attachments) {
    const attachments: Attachment[] = projectAttachments.attachments
      ? (projectAttachments.attachments as Attachment[])
      : [];

    await fileDelete(false, ...attachments.map((a) => a.value.id));
  }

  const applications = await prisma.opportunityApplication.findMany({
    where: { projectId: projectId, artistId: artistId },
    select: { id: true, attachments: true },
  });

  for (const application of applications) {
    const atts: Attachment[] = application.attachments ? (application.attachments as Attachment[]) : [];
    await fileDelete(false, ...atts.map((a) => a.value.id));
    await revokeInvites(application.id, artistId);
  }

  await prisma.opportunityApplication.deleteMany({
    where: { projectId: projectId, artistId: artistId },
  });

  await prisma.project.delete({
    where: {
      id: projectId,
      artistId: artistId,
    },
  });

  logger.info(`Artist with id ${artistId} successfully deleted project with id ${projectId}`);
  return successResult();
}

export async function sendConfirmProject(projectId: number): Promise<ServerActionResult> {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    logger.warn(
      `Attempt to send project with id ${projectId} to confirm. Failed to send because this action is prohibited for unauthorized users`
    );
    forbidden();
  }

  await prisma.project.update({
    where: {
      id: projectId,
      artistId: artistId,
    },
    data: {
      moderationStatus: $Enums.ModerationStatus.OnModeration,
    },
  });

  logger.info(`Artist with id ${artistId} successfully sent project with id ${projectId} to confirm`);
  return successResult();
}
