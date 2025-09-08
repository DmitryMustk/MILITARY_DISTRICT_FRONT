'use client';

import React, { useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { userPasswordFormSchema, UserPasswordFormValues } from '@/lib/user/types';
import { Form } from '@/components/ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldInput } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/lib/user/credentials-reset';

type ResetPasswordFormProps = {
  requestId: string;
};

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ requestId }) => {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ResetPasswordForm');
  const zodTranslations = useTranslations('Zod.resetPasswordFormSchema');

  const form = useForm<UserPasswordFormValues>({
    resolver: zodResolver(userPasswordFormSchema(zodTranslations)),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = useCallback(
    async (values: UserPasswordFormValues) => {
      startTransition(async () => {
        const res = await resetPassword(requestId, values);
        if (res.success) {
          redirect('/auth/signin');
        } else {
          form.setError('password', {
            message: res.error,
          });
        }
      });
    },
    [form, requestId]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldInput control={form.control} name="password" label={t('password')} type="password" />
        <FormFieldInput
          control={form.control}
          name="confirmPassword"
          label={t('passwordConfirmation')}
          type="password"
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={pending}>
            {t('update')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};
