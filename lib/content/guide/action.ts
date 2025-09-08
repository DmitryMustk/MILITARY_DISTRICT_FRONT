'use server';

import { GuideFormValues } from '@/lib/content/guide/types';
import { auth } from '@/lib/auth';
import { ResourceType, Role } from '@prisma/client';
import { logger } from '@/lib/logger';
import { forbidden, notFound } from 'next/navigation';
import { prisma } from '@/prisma/client';
import { fileDelete } from '@/lib/files/file-delete';

export async function createGuide(formData: GuideFormValues): Promise<number> {
  const session = await auth();
  if (!session?.user?.role.includes(Role.CONTENT_MANAGER)) {
    logger.warn("Attempt to create guide by a user who isn't Content Manager");
    forbidden();
  }

  const guide = await prisma.guide.create({
    data: {
      title: formData.title.trim(),
      resourceType: formData.resourceType,
      order: formData.order,
      resource: formData.resourceType == ResourceType.LINK ? { url: formData.link } : { file: formData.file },
      authorId: session.user.id,
    },
  });

  logger.info(`Content Manager with id ${session?.user?.id} successfully created guide`);
  return guide.id;
}

export async function updateGuide(guideId: number, formData: GuideFormValues): Promise<number> {
  const session = await auth();
  if (!session?.user?.role.includes(Role.CONTENT_MANAGER)) {
    logger.warn(`Unauthorized update attempt for guide ${guideId}`);
    forbidden();
  }

  const existingGuide = await prisma.guide.findUnique({
    where: { id: guideId },
    select: {
      resourceType: true,
      resource: true,
    },
  });

  if (!existingGuide) {
    notFound();
  }

  const existingResource =
    typeof existingGuide.resource === 'string' ? JSON.parse(existingGuide.resource) : existingGuide.resource || {};

  if (
    existingGuide.resourceType == ResourceType.FILE &&
    existingResource.file?.value?.id &&
    (formData.resourceType !== ResourceType.FILE || formData.file?.value?.id !== existingResource.file.value.id)
  ) {
    await fileDelete(false, existingResource.file.value.id);
  }

  const guide = await prisma.guide.update({
    where: { id: guideId },
    data: {
      title: formData.title.trim(),
      order: formData.order,
      resourceType: formData.resourceType,
      resource: formData.resourceType === ResourceType.LINK ? { url: formData.link } : { file: formData.file },
    },
  });

  logger.info(`Guide ${guideId} updated by ${session.user.id}`);
  return guide.id;
}

export async function deleteGuide(guideId: number) {
  const session = await auth();
  if (!session?.user?.role.includes(Role.CONTENT_MANAGER)) {
    logger.warn(`Unauthorized delete attempt for guide ${guideId}`);
    forbidden();
  }

  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    select: {
      resourceType: true,
      resource: true,
    },
  });

  if (!guide) {
    notFound();
  }

  if (guide.resourceType == ResourceType.FILE) {
    const resource = typeof guide.resource === 'string' ? JSON.parse(guide.resource) : guide.resource || {};
    await fileDelete(false, resource.file.value.id);
  }

  await prisma.guide.delete({
    where: { id: guideId },
  });

  logger.info(`Guide ${guideId} deleted by ${session.user.id}`);
}
