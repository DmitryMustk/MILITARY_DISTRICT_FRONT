'use client';

import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormErrorMessage, FormHeader } from '@/components/ui/form';
import Link from 'next/link';
import { FormFieldCheckbox, FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';
import { createProject, updateProject } from '@/lib/project/action';
import { projectFormSchema, ProjectFormValues } from '@/lib/project/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { FormFieldAttachment, FormFieldsAttachments } from '@/components/common/attachments';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { imageExtension } from '@/lib/utils';
import { Tags } from '@/components/project/tags';

interface ProjectFormProps {
  projectId?: string;
  defaultValues: ProjectFormValues;
  showWarning?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, defaultValues, showWarning }) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('Component.ProjectForm');
  const zodTranslation = useTranslations('Zod.projectFormSchema');
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema(zodTranslation)),
    defaultValues,
  });
  const [link, setLink] = useState<CheckedState>(defaultValues?.link !== undefined);
  const checkboxId = useMemo(() => 'project-form-link-checkbox', []);

  const attachmentField = useFieldArray({
    control: form.control,
    name: 'attachments',
  });

  const onSuccessAttachments = useCallback(
    (id: string, fileName: string, fileType: string) => {
      attachmentField.append({ value: { id, fileName, fileType } });
    },
    [attachmentField]
  );

  const onRemoveAttachments = useCallback(
    (id: string) => {
      const index = attachmentField.fields.findIndex((field) => field.value.id === id);
      if (index !== -1) {
        attachmentField.remove(index);
      }
    },
    [attachmentField]
  );

  const onSuccessPoster = useCallback(
    (id: string, fileName: string, fileType: string) => {
      form.setValue('posterImage', { value: { id, fileName, fileType } });
    },
    [form]
  );

  const onRemovePoster = useCallback(() => {
    form.setValue('posterImage', { value: undefined });
  }, [form]);

  const handleCreateUpdateProjectAction = useCallback(
    async (values: ProjectFormValues) => {
      startTransition(async () => {
        const result = projectId ? await updateProject(parseInt(projectId!), values) : await createProject(values);

        if (result.success) {
          toast({
            title: projectId ? t('projectUpdated') : t('projectCreated'),
          });

          router.push(`/artist/projects`);
        }

        setError(result.error);
      });
    },
    [toast, router, projectId, t]
  );

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setLink(checked);
      if (!checked) {
        form.setValue('link', undefined);
      } else {
        form.setValue('link', '');
      }
    },
    [form]
  );

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(handleCreateUpdateProjectAction)}
        className="bg-white md:border border-black pt-8 pb-[72px] md:py-10 px-4 md:px-[100px] m-auto max-w-[590px]"
      >
        <FormHeader>{projectId ? t('updateProjectTitle') : t('addProjectTitle')}</FormHeader>
        <FormFieldInput control={form.control} name="title" label={t('title')} />
        <FormFieldTextarea control={form.control} name="description" label={t('description')} rows={4} />
        <Tags form={form} />
        <FormFieldInput
          control={form.control}
          name="budget"
          type="number"
          label={t('budget')}
          description={t('budgetDesc')}
        />
        <FormFieldInput
          control={form.control}
          name="reach"
          type="number"
          label={t('reach')}
          description={t('reachDesc')}
        />
        <div className="flex gap-2 items-center">
          <Checkbox id={checkboxId} checked={link} onCheckedChange={handleCheckedChange} />
          <Label htmlFor={checkboxId}>{t('link')}</Label>
        </div>
        {link && <FormFieldInput control={form.control} name="link" />}
        <FormFieldCheckbox
          control={form.control}
          name="exclusiveSupport"
          label={t('exclusiveSupport')}
          description={t('exclusiveSupportDescription')}
        />
        <FormFieldCheckbox
          control={form.control}
          name="hidden"
          label={t('hidden')}
          description={t('hiddenDescription')}
        />

        <div className="flex flex-col gap-2">
          <FormFieldAttachment
            title={t('posterImage')}
            buttonTitle={t('uploadPosterImage')}
            name="posterImage"
            control={form.control}
            onSuccess={onSuccessPoster}
            onRemove={onRemovePoster}
            accept={imageExtension}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FormFieldsAttachments
            title={t('attachments')}
            buttonTitle={t('addAttachments')}
            fields={attachmentField.fields}
            control={form.control}
            onSuccess={onSuccessAttachments}
            onRemove={onRemoveAttachments}
          />
        </div>

        {showWarning && (
          <div className="flex self-center bg-warn w-fit p-[10px] rounded-sm">{t('updateProjectWarning')}</div>
        )}

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <div className="flex gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? t('sending') : t('submit')}
          </Button>
          <Button variant="secondary" disabled={pending} asChild>
            <Link href={`/artist/projects`}>{t('cancel')}</Link>
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default ProjectForm;
