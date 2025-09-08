'use server';

import React from 'react';
import { PosterImageValues, ProjectFormValues } from '@/lib/project/types';
import { getMyProject } from '@/lib/project/queries';
import { Attachment } from '@/lib/types';
import ProjectForm from '@/components/project/project-form';

export default async function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getMyProject(projectId);

  const defaultValues: ProjectFormValues = {
    title: project.title,
    description: project.description,
    tags: project.tags.map((val) => ({ value: val })),
    exclusiveSupport: project.exclusiveSupport,
    hidden: project.hidden,
    attachments: project.attachments as Attachment[],
    budget: project.budget,
    reach: project.reach,
    link: project.link ?? undefined,
    posterImage: project.posterImage as PosterImageValues,
  };

  return (
    <div className="main-no-padding flex bg-cover bg-center md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)] max-md:!bg-none">
      <ProjectForm projectId={projectId} defaultValues={defaultValues} showWarning={!!project._count.applications} />
    </div>
  );
}
