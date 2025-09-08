import { FormProvider } from 'react-hook-form';
import { useMultiStepFormContext } from '../ui/multi-step-form';
import { Button } from '../ui/button';
import { FormFieldMultiSelect, FormFieldSelect } from '../ui/form-field';
import { useTranslations } from 'next-intl';
import { getSelectOptionsFromEnum, getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import { $Enums, ArtistTitle, ArtTheme, Industry } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export const ArtistProfessionalAccountStep = ({
  backLink,
  showModerationWarning,
}: {
  backLink?: string;
  showModerationWarning?: boolean;
}) => {
  const t = useTranslations('Component.ArtistProfessionalAccountStep');
  const tIndustry = useTranslations('Enum.Industry');
  const tArtTheme = useTranslations('Enum.ArtTheme');
  const tArtistTitle = useTranslations('Enum.ArtistTitle');
  const { form, nextStep, isStepValid, prevStep } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormFieldSelect
          control={form.control}
          name="professional.title"
          options={getSelectOptionsFromEnumTranslated(ArtistTitle, tArtistTitle)}
          label={t('title')}
        />
        <FormFieldMultiSelect
          control={form.control}
          name="professional.theme"
          label={t('theme')}
          options={getSelectOptionsFromEnumTranslated(ArtTheme, tArtTheme)}
          creatable
          description={t('themesDesc')}
          placeholder={t('none')}
          hidePlaceholderWhenSelected
        />
        <FormFieldMultiSelect
          control={form.control}
          name="professional.languages"
          label={t('languages')}
          options={getSelectOptionsFromEnum($Enums.Languages)}
          placeholder={t('none')}
          hidePlaceholderWhenSelected
        />
        <FormFieldMultiSelect
          control={form.control}
          name="professional.industry"
          options={getSelectOptionsFromEnumTranslated(Industry, tIndustry)}
          label={t('industry')}
          placeholder={t('none')}
          hidePlaceholderWhenSelected
        />
        {showModerationWarning && <p className="text-red">{t('moderationWarning')}</p>}
        <div className="flex justify-between gap-3 !mt-8 md:!mt-10">
          <div className="flex justify-between w-full">
            {!!backLink && (
              <Button variant="outline" size="lg">
                <Link href={backLink}>{t('backLink')}</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={prevStep} disabled={!isStepValid()}>
              {t('back')}
            </Button>
            <Button size="lg" onClick={nextStep} disabled={!isStepValid()}>
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
