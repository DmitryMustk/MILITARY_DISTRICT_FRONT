'use client';

import { useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { updateEmailFormSchema, UpdateEmailFormValues } from '@/lib/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormFooter } from '@/components/ui/form';
import { FormFieldInput } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { sendEmailVerification } from '@/lib/user/credentials-reset';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export const UpdateEmailForm = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Component.UpdateEmailForm');
  const { toast } = useToast();

  const zodTranslations = useTranslations('Zod.updateEmailSchema');
  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailFormSchema(zodTranslations)),
    defaultValues: { email: '' },
  });

  const handleSubmit = useCallback(
    async (values: UpdateEmailFormValues) => {
      startTransition(async () => {
        try {
          await sendEmailVerification(values.email);
          toast({
            title: t('emailSent'),
            description: t('emailSentDesc'),
          });
        } catch (error) {
          toast({
            title: t('emailSentError'),
            description: (error as Error).message || t('emailSentErrorDesc'),
            variant: 'destructive',
          });
        }
      });
    },
    [toast, t]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFieldInput control={form.control} name="email" label={t('email')} />
        <FormFooter>
          <Button variant="outline" disabled={isPending}>
            <Link href={'/user/account-settings'}>{t('backSettings')}</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="relative">
            {isPending ? (
              <>
                <span className="animate-pulse">{t('sending')}</span>
                <span className="ml-2 animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              </>
            ) : (
              t('sendMessage')
            )}
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};
