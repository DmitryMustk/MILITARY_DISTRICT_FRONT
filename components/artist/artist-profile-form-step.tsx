import { FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormFieldInput, FormFieldTextarea } from '../ui/form-field';
import { useTranslations } from 'next-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import React, { useCallback } from 'react';
import { useMultiStepFormContext } from '../ui/multi-step-form';
import Link from 'next/link';

interface ArtistProfileStepProps {
  pending?: boolean;
  backLink?: string;
  showModerationWarning?: boolean;
}

export const ArtistProfileStep = ({ pending, backLink, showModerationWarning }: ArtistProfileStepProps) => {
  const t = useTranslations('Component.ArtistProfileStep');
  const { form, prevStep, isStepValid } = useMultiStepFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'profile.links',
  });

  const handleClickAdd = useCallback(() => {
    append({ value: '' });
  }, [append]);

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormFieldInput control={form.control} name="profile.artistName" label={t('artistName')} />
        <div className="flex flex-col gap-1">
          <FormLabel>{t('links')}</FormLabel>
          {fields.map((_, idx) => (
            <FormField
              control={form.control}
              key={idx}
              name={`profile.links.${idx}.value`}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormControl>
                    <Input {...field} placeholder="https://" onClear={() => remove(idx)} />
                  </FormControl>
                  <FormMessage className="text-red capitalize" />
                </FormItem>
              )}
            />
          ))}
          <div>
            <Button onClick={handleClickAdd} variant="outline">
              {t('addLink')}
            </Button>
          </div>
        </div>
        <FormFieldTextarea rows={5} control={form.control} name="profile.bio" label={t('bio')} />
        <FormFieldTextarea
          control={form.control}
          name="profile.statement"
          label={t('statement')}
          description={t('statementDesc')}
        />
        {showModerationWarning && <p className="text-red">{t('moderationWarning')}</p>}
        <div className="flex justify-between gap-4">
          <div className="flex justify-between w-full mt-8 md:mt-10">
            {!!backLink && (
              <Button variant="outline" size="lg" disabled={pending}>
                <Link href={backLink}>{t('backLink')}</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={prevStep} disabled={!isStepValid() || pending}>
              {t('back')}
            </Button>
            <Button type="submit" size="lg" disabled={!form.formState.isValid || pending}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
