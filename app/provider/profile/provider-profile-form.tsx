'use client';

import React, { useCallback, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';

import { providerProfileFormSchema, ProviderProfileFormValues } from '@/lib/provider/types';
import { saveProviderProfile } from '@/lib/provider/profile';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

type ProviderProfileFormProps = {
  defaultValues: ProviderProfileFormValues;
};

const ProviderProfileForm: React.FC<ProviderProfileFormProps> = ({ defaultValues }) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ProviderProfileForm');

  const onSubmit = useCallback(
    async (values: ProviderProfileFormValues) => {
      startTransition(async () => {
        await saveProviderProfile(values);

        toast({
          title: t('updated'),
          description: t('updatedDesc'),
        });

        window.location.reload();
      });
    },
    [toast, t]
  );

  const zodTranslations = useTranslations('Zod.providerProfileFormSchema');
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileFormSchema(zodTranslations)),
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldInput control={form.control} name="organizationName" label={t('organizationName')} />
        <FormFieldInput control={form.control} name="representativeName" label={t('representativeName')} />
        <FormFieldTextarea control={form.control} name="information" label={t('shortInformation')} />
        <FormFieldInput control={form.control} name="website" label={t('website')} />
        <FormFieldInput control={form.control} name="phone" label={t('phone')} />

        <div className="flex gap-4">
          <Button type="submit" disabled={pending || !form.formState.isDirty || !form.formState.isValid}>
            {t('save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProviderProfileForm;
