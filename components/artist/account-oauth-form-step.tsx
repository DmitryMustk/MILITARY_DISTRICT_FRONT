import { FormProvider } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormFieldInput } from '../ui/form-field';
import { useTranslations } from 'next-intl';
import { useMultiStepFormContext } from '../ui/multi-step-form';

export const ArtistOAuthAccountStep = () => {
  const t = useTranslations('Component.ArtistOAuthAccountStep');
  const { form, nextStep, isStepValid } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormFieldInput control={form.control} name="account.username" label={t('username')} />
        <div className="flex justify-end">
          <Button variant="outline" onClick={nextStep} disabled={!isStepValid()}>
            {t('next')}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
