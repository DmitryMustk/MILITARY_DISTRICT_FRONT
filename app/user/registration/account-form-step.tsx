import { FormProvider } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { FormFieldInput } from '../../../components/ui/form-field';
import { useTranslations } from 'next-intl';
import { useMultiStepFormContext } from '../../../components/ui/multi-step-form';
import React from 'react';

export const AccountStep = () => {
  const t = useTranslations('Component.ProviderRegistrationForm');
  const { form, nextStep, isStepValid } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormFieldInput control={form.control} name="account.username" label={t(`username`)} />
        <FormFieldInput control={form.control} name="account.password" label={t(`password`)} type="password" />
        <FormFieldInput
          control={form.control}
          name="account.confirmPassword"
          label={t(`passwordConfirmation`)}
          type="password"
        />
      </div>
      <div className="flex justify-end mt-8 md:mt-10">
        <Button size="lg" onClick={nextStep} disabled={!isStepValid()}>
          {t('next')}
        </Button>
      </div>
    </FormProvider>
  );
};
