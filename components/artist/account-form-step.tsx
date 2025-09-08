import { FormProvider } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormFieldInput } from '../ui/form-field';
import { useTranslations } from 'next-intl';
import { useMultiStepFormContext } from '../ui/multi-step-form';

export const ArtistAccountStep = () => {
  const t = useTranslations('Component.ArtistAccountStep');
  const { form, nextStep, isStepValid } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <FormFieldInput control={form.control} name="account.username" label={t('username')} />
      <FormFieldInput
        className="mt-4"
        control={form.control}
        name="account.password"
        label={t('password')}
        type="password"
        description={t('passwordPlaceholder')}
      />
      <FormFieldInput
        className="mt-4"
        control={form.control}
        name="account.confirmPassword"
        label={t('passwordConfirmation')}
        type="password"
      />
      <div className="flex justify-end mt-8 md:mt-10">
        <Button size="lg" onClick={nextStep} disabled={!isStepValid()}>
          {t('next')}
        </Button>
      </div>
    </FormProvider>
  );
};
