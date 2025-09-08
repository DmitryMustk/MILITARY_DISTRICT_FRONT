import { FormProvider } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { FormFieldInput } from '../../../components/ui/form-field';
import { useTranslations } from 'next-intl';
import { useMultiStepFormContext } from '../../../components/ui/multi-step-form';
import React from 'react';
import { FormFieldTextarea } from '@/components/ui/form-field';

export const ProfessionalStep = ({ pending }: { pending: boolean }) => {
  const t = useTranslations('Component.ProviderRegistrationForm');
  const { form, prevStep } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormFieldInput control={form.control} name="professional.organizationName" label={t(`organizationName`)} />
        <FormFieldInput control={form.control} name="professional.representativeName" label={t(`representativeName`)} />
        <FormFieldTextarea control={form.control} name="professional.information" label={t(`shortInformation`)} />
        <FormFieldInput control={form.control} name="professional.website" label={t(`website`)} />
        <FormFieldInput control={form.control} name="professional.phone" label={t(`phone`)} />
      </div>
      <div className="flex justify-between w-full mt-8 md:mt-10">
        <Button variant="outline" size="lg" onClick={prevStep} disabled={pending}>
          {t('back')}
        </Button>
        <Button type="submit" size="lg" disabled={!form.formState.isValid || pending}>
          {t('signUp')}
        </Button>
      </div>
    </FormProvider>
  );
};
