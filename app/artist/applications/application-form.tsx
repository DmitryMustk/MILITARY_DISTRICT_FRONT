'use client';

import React, { useCallback, useMemo, useTransition } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormFieldSelect, FormFieldTextarea } from '@/components/ui/form-field';
import Link from 'next/link';

import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import {
  opportunityApplicationFormSchema,
  OpportunityApplicationFormValues,
} from '@/lib/opportunity-application/types';
import {
  archiveMyApplication,
  createOpportunityApplication,
  deleteMyApplication,
  revokeMyApplication,
  sendMyApplication,
  unarchiveMyApplication,
  updateMyApplication,
} from '@/lib/opportunity-application/actions';
import { redirect, useRouter } from 'next/navigation';
import { ModerationStatus, OpportunityApplicationStatus } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { FormFieldsAttachments } from '@/components/common/attachments';

type Prp = {
  defaultValues: OpportunityApplicationFormValues;
  opportunityId?: number;
  application?: {
    id: number;
    status: OpportunityApplicationStatus;
  };
  projects: { id: number; title: string; banned: boolean; moderationStatus: ModerationStatus }[];
  hasApplicationWithoutProject?: boolean;
  referer?: string | null;
  blockSending: boolean;
};

const OpportunityApplicationForm: React.FC<Prp> = ({
  defaultValues,
  opportunityId,
  application,
  projects,
  hasApplicationWithoutProject,
  referer,
  blockSending,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.OpportunityApplicationForm');

  const prevPath = useMemo(() => {
    if (referer) {
      try {
        const url = new URL(referer);
        return url.pathname + url.search;
      } catch {
        return referer;
      }
    }
  }, [referer]);

  const zodTranslations = useTranslations('Zod.opportunityApplicationFormSchema');
  const form = useForm<OpportunityApplicationFormValues>({
    resolver: zodResolver(opportunityApplicationFormSchema(zodTranslations)),
    defaultValues,
    mode: 'onChange',
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'attachments',
  });

  const availableProjects = useMemo(() => {
    const _projects = projects.map(({ id, title }) => ({ value: id.toString(), label: title }));
    if (!hasApplicationWithoutProject) {
      _projects.unshift({ value: '-', label: t('projectPlaceholder') });
    }

    return _projects;
  }, [hasApplicationWithoutProject, projects, t]);
  const enableUpdate = useMemo(() => !application || application?.status === 'new', [application]);

  const onSubmit = useCallback(
    async (values: OpportunityApplicationFormValues) => {
      const formValues = { ...values };
      if (values.projectId) {
        formValues.projectId = values.projectId === '-' ? undefined : values.projectId;
      }

      startTransition(async () => {
        if (application) {
          await updateMyApplication(application.id, formValues);

          redirect(`/artist/applications`);
        } else if (opportunityId !== undefined) {
          const id = await createOpportunityApplication(formValues, opportunityId);

          redirect(`/artist/applications/edit/${id}`);
        }
      });
    },
    [application, opportunityId]
  );

  const doDelete = useCallback(async () => {
    if (application) {
      startTransition(async () => {
        await deleteMyApplication(application.id);
        redirect('/artist/applications');
      });
    }
  }, [application]);

  const doSend = useCallback(
    async (values: OpportunityApplicationFormValues) => {
      if (application) {
        startTransition(async () => {
          await sendMyApplication(application.id, values);
          toast({ title: t('sent'), description: t('sentDesc') });
          router.refresh();
        });
      }
    },
    [application, router, toast, t]
  );

  const doRevoke = useCallback(async () => {
    if (application) {
      startTransition(async () => {
        await revokeMyApplication(application.id);
        toast({ title: t('revoked'), description: t('revokedDesc') });
        router.refresh();
      });
    }
  }, [application, router, toast, t]);

  const doArchive = useCallback(async () => {
    if (application) {
      startTransition(async () => {
        await archiveMyApplication(application.id);
        toast({ title: t('archived'), description: t('archivedDesc') });
        router.refresh();
      });
    }
  }, [application, router, toast, t]);

  const doUnarchive = useCallback(async () => {
    if (application) {
      startTransition(async () => {
        await unarchiveMyApplication(application.id);
        toast({ title: t('unarchived'), description: t('unarchivedDesc') });
        router.refresh();
      });
    }
  }, [application, router, toast, t]);

  const onSuccess = useCallback(
    (id: string, fileName: string, fileType: string) => {
      append({ value: { id, fileName, fileType } });
    },
    [append]
  );

  const onRemove = useCallback(
    (id: string) => {
      const index = fields.findIndex((field) => field.value.id === id);
      if (index !== -1) {
        remove(index);
      }
    },
    [fields, remove]
  );

  const selectedProjectIsAttachable = useCallback(() => {
    const selectedProjectId = form.getValues().projectId;
    const selectedProject = projects.find((p) => p.id.toString() === selectedProjectId);
    return (
      !selectedProjectId ||
      selectedProjectId === '-' ||
      (selectedProject?.moderationStatus === 'Approved' && !selectedProject?.banned)
    );
  }, [form, projects]);

  const showProjectSelect =
    (hasApplicationWithoutProject && !!availableProjects.length) || availableProjects.length > 1;

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white md:py-10 px-4 !py-0 md:px-[24px] m-auto max-w-[590px]"
      >
        {enableUpdate && (
          <>
            <FormFieldTextarea control={form.control} name="message" label={t('message')} />

            {showProjectSelect && (
              <FormFieldSelect
                control={form.control}
                name="projectId"
                options={availableProjects}
                label={t('project')}
                placeholder={t('projectPlaceholder')}
              />
            )}

            <div className="mt-10">
              <FormFieldsAttachments
                title={t('attachments')}
                buttonTitle={t('addAttachments')}
                fields={fields}
                control={form.control}
                onSuccess={onSuccess}
                onRemove={onRemove}
                attachmentTypeSelector
              />
            </div>
          </>
        )}

        <div className="flex gap-4 flex-wrap">
          {enableUpdate && (
            <Button
              type="submit"
              disabled={
                pending ||
                (hasApplicationWithoutProject && !form.getValues().projectId) ||
                !selectedProjectIsAttachable() ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
            >
              {application ? t('save') : t('submit')}
            </Button>
          )}

          {application?.status === 'new' && (
            <ButtonWithConfirmation
              className="whitespace-normal min-h-[38px] h-fit"
              cancelLabel={t('sendCancel')}
              confirmLabel={t('sendConfirm')}
              label={t('sendLabel')}
              disabled={pending || !selectedProjectIsAttachable() || blockSending}
              onClick={form.handleSubmit(doSend)}
            />
          )}

          {application?.status === 'sent' && (
            <ButtonWithConfirmation
              cancelLabel={t('revokeCancel')}
              confirmLabel={t('revokeConfirm')}
              label={t('revokeLabel')}
              onClick={doRevoke}
              disabled={pending}
            />
          )}

          {application &&
            application?.status !== 'rejected' &&
            application?.status !== 'archivedByArtist' &&
            application?.status !== 'archived' && (
              <ButtonWithConfirmation
                cancelLabel={t('archiveCancel')}
                confirmLabel={t('archiveConfirm')}
                label={t('archiveLabel')}
                onClick={doArchive}
                disabled={pending}
              />
            )}

          {application?.status === 'archivedByArtist' && (
            <ButtonWithConfirmation
              cancelLabel={t('unarchiveCancel')}
              confirmLabel={t('unarchiveConfirm')}
              label={t('unarchiveLabel')}
              onClick={doUnarchive}
              disabled={pending}
            />
          )}

          {application && (
            <ButtonWithConfirmation
              cancelLabel={t('deleteCancel')}
              confirmLabel={t('deleteConfirm')}
              label={t('deleteLabel')}
              disabled={pending}
              onClick={doDelete}
            />
          )}

          {prevPath && (
            <Button variant="outline" asChild>
              <Link href={prevPath}>{t('goBack')}</Link>
            </Button>
          )}
        </div>
      </Form>
      {application?.status === 'new' && blockSending && (
        <div className="flex self-center bg-warn w-fit p-[10px] rounded-sm mt-5">{t('warningSendingIsBlocked')}</div>
      )}
    </FormProvider>
  );
};

export default OpportunityApplicationForm;
