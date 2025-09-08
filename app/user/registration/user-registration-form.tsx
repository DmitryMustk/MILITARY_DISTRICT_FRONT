'use client';

import React, { useCallback, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormFieldInput } from '@/components/ui/form-field';

import { useToast } from '@/hooks/use-toast';
import { registerUserByInvite } from '@/lib/user/registration';
import { redirect } from 'next/navigation';
import { Form, FormFooter } from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import { userRegistrationFormSchema, UserRegistrationFormValues } from '@/lib/user/types';

type UserRegistrationFormProps = {
  inviteId: string;
};

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ inviteId }) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ProviderRegistrationForm');
  const zodTranslations = useTranslations('Zod.providerRegistrationFormSchema');

  const onSubmit = useCallback(
    async (values: UserRegistrationFormValues) => {
      startTransition(async () => {
        await registerUserByInvite(inviteId, values);
        toast({
          title: t(`registrationFinished`),
          description: t(`registrationFinishedDesc`),
        });

        redirect('/auth/signin');
      });
    },
    [inviteId, toast, t]
  );

  const formDefaultValues: UserRegistrationFormValues = {
    username: ``,
    password: ``,
    confirmPassword: ``,
  };

  const form = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationFormSchema(zodTranslations)),
    defaultValues: formDefaultValues,
  });

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldInput control={form.control} name="username" label={t(`username`)} />
        <FormFieldInput control={form.control} name="password" label={t(`password`)} type="password" />
        <FormFieldInput
          control={form.control}
          name="confirmPassword"
          label={t(`passwordConfirmation`)}
          type="password"
        />

        <FormFooter className="justify-end !mt-8">
          <Button className="w-full md:w-auto" size="lg" type="submit" disabled={pending}>
            {t(`signUp`)}
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};

export default UserRegistrationForm;
