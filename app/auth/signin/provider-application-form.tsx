'use client';

import { Button } from '@/components/ui/button';
import { Form, FormErrorMessage, FormFooter } from '@/components/ui/form';
import { FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { PropsWithChildren, useCallback, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { providerRegistrationRequestFormSchema, ProviderRegistrationRequestFormValues } from '@/lib/provider/types';
import { sendProviderApplication } from '@/lib/provider/registration';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface ProviderApplicationFormProps extends PropsWithChildren {
  onSuccessAction(): void;
}

export const ProviderApplicationForm: React.FC<ProviderApplicationFormProps> = ({ onSuccessAction, children }) => {
  const { toast } = useToast();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ProviderApplicationForm');

  const zodTranslations = useTranslations('Zod.providerRegistrationRequestFormSchema');
  const form = useForm<ProviderRegistrationRequestFormValues>({
    resolver: zodResolver(providerRegistrationRequestFormSchema(zodTranslations)),
    defaultValues: {
      email: '',
      phone: '',
      representativeName: '',
      organizationName: '',
      information: '',
    },
  });

  const handleSubmit = useCallback(
    (values: ProviderRegistrationRequestFormValues) =>
      startTransition(async () => {
        const result = await sendProviderApplication(values);
        if (result?.error) {
          setError(result.error);
        } else {
          toast({
            title: t('applicationSent'),
            description: t('applicationSentDesc'),
          });

          onSuccessAction();
        }
      }),
    [onSuccessAction, toast, t]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldInput control={form.control} name="email" label={t('email')} />
        <FormFieldInput control={form.control} name="phone" label={t('phone')} placeholder="+1 (000) 000-0000" />
        <FormFieldInput control={form.control} name="representativeName" label={t('representativeName')} />
        <FormFieldInput control={form.control} name="organizationName" label={t('organizationName')} />
        <FormFieldTextarea control={form.control} name="information" label={t('information')} />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <FormFooter>
          <Button type="submit" disabled={pending}>
            {t('submit')}
          </Button>
          {children}
        </FormFooter>
      </Form>
    </FormProvider>
  );
};
