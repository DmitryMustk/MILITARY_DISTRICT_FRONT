'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { userPasswordFormSchema, UserPasswordFormValues } from '@/lib/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from '@/lib/user/action';
import { Form } from '@/components/ui/form';
import { FormFieldInput } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export const UpdatePasswordForm = () => {
  const router = useRouter();
  const zodTranslations = useTranslations('Zod.userPasswordFormSchema');
  const form = useForm<UserPasswordFormValues>({
    resolver: zodResolver(userPasswordFormSchema(zodTranslations)),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.UpdatePasswordForm');
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (values: UserPasswordFormValues) => {
      startTransition(async () => {
        await updatePassword(values);
        toast({
          title: t('updated'),
          description: t('updatedDesc'),
        });
        router.push('/user/account-settings');
      });
    },
    [t, toast, router]
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
        <div className="flex gap-4 justify-between">
          <Button variant="outline" disabled={pending}>
            <Link href={'/user/account-settings'}>{t('backSettings')}</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {t('update')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};
