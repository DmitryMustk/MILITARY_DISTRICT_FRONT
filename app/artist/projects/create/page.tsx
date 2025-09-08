'use server';

import React from 'react';
import { ProjectFormValues } from '@/lib/project/types';
import ProjectForm from '@/components/project/project-form';

export default async function AddProjectPage() {
  const defaultValues: ProjectFormValues = {
    title: '',
    description: '',
    tags: [],
    exclusiveSupport: false,
    hidden: false,
    attachments: [],
    reach: 0,
    budget: 0,
    link: undefined,
    posterImage: { value: undefined },
  };

  return (
    <div className="main-no-padding flex bg-cover bg-center md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)] max-md:!bg-none">
      <ProjectForm defaultValues={defaultValues} />
    </div>
  );
}
