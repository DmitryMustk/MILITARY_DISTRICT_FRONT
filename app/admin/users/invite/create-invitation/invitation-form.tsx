'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { Form, FormFooter } from '@/components/ui/form';
import { FormFieldInput, FormFieldMultiSelect, FormFieldTextarea } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import React, { PropsWithChildren, useCallback, useTransition } from 'react';
import { userInvitationFormSchema, UserInvitationFormValues } from '@/lib/admin/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { inviteUser } from '@/lib/admin/provider-invitation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Option } from '@/components/ui/multi-select';
import { $Enums } from '@prisma/client';
import { getRoleLabel } from '@/lib/admin/utils';

const allowedRoles = ['PROVIDER', 'ADMINISTRATOR', 'CONTENT_MANAGER', 'MODERATOR'];

const roles: Option[] = Object.entries($Enums.Role)
  .filter(([key]) => allowedRoles.includes(key))
  .map(([, value]) => ({
    value,
    label: getRoleLabel(value as $Enums.Role),
  }));

interface UserInvitationFormProps extends PropsWithChildren {
  onSubmitAction(): void;
}

export default function UserInvitationForm({ onSubmitAction, children }: UserInvitationFormProps) {
  const t = useTranslations('Component.UserInvitationForm');
  const zodTranslations = useTranslations('Zod.userInvitationFormSchema');

  const { toast } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<UserInvitationFormValues>({
    resolver: zodResolver(userInvitationFormSchema(zodTranslations)),
    defaultValues: { organizationName: '', email: '', messageSubject: '' },
  });
  const handleSubmit = useCallback(
    (values: UserInvitationFormValues) =>
      startTransition(async () => {
        await inviteUser(values);
        router.refresh();
        toast({
          title: t(`successToastTitle`),
        });

        onSubmitAction();
      }),
    [onSubmitAction, router, toast, t]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldInput control={form.control} name="organizationName" label={t(`organizationNameLabel`)} />
        <FormFieldInput control={form.control} name="email" label={t(`emailLabel`)} />
        <FormFieldMultiSelect control={form.control} name="roles" label={t('rolesLabel')} options={roles} />
        <FormFieldInput control={form.control} name="messageSubject" label={t('messageSubjectLabel')} />
        <FormFieldTextarea control={form.control} name="message" label={t('messageLabel')} />
        <FormFooter>
          <Button type="submit" disabled={pending}>
            {t(pending ? `submitButtonPending` : `submitButton`)}
          </Button>
          {children}
        </FormFooter>
      </Form>
    </FormProvider>
  );
}
