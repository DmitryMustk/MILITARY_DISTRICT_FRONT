'use client';

import React, { useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { forgotPasswordFormSchema, ForgotPasswordFormValues } from '@/lib/user/types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldInput } from '@/components/ui/form-field';
import { Form, FormFooter } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { sendResetPasswordMessage } from '@/lib/user/credentials-reset';

export const ForgotPasswordForm: React.FC = () => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ForgotPasswordForm');
  const zodTranslations = useTranslations('Zod.forgotPasswordFormSchema');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema(zodTranslations)),
    defaultValues: { email: '' },
  });

  const onSubmit = useCallback(
    async (values: ForgotPasswordFormValues) => {
      startTransition(async () => {
        const res = await sendResetPasswordMessage(values.email);
        if (res.success) {
          toast({
            title: t('emailSent'),
            description: t('emailSentDesc'),
          });
        } else {
          form.setError('email', {
            message: res.error,
          });
        }
      });
    },
    [form, toast, t]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldInput control={form.control} name="email" label={t(`email`)} />

        <FormFooter>
          <Button type="submit" disabled={pending}>
            {t('submit')}
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};
