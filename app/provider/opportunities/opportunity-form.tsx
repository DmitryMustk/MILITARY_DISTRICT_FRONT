'use client';

import React, { useCallback, useMemo, useTransition } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormFooter, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';
import Link from 'next/link';
import { createOpportunity, deleteOpportunity, updateOpportunity } from '@/lib/opportunity/actions';
import { redirect } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import {
  ArtTheme,
  Country,
  Gender,
  Industry,
  LegalStatus,
  OpportunityVisibility,
  ResidencyOffering,
} from '@prisma/client';
import { isDayPassed, toNormalizedDateString } from '@/lib/date-format';
import {
  OpportunityFormInputValues,
  OpportunityFormOutputValues,
  opportunityFormSchema,
} from '@/lib/opportunity/types';
import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import { useTranslations } from 'next-intl';
import { CalendarButton } from '@/components/common/calendar-button';
import { getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import MultipleSelector from '@/components/ui/multi-select';
import { DateBefore, DateAfter } from 'react-day-picker';
import { FormFieldsAttachments } from '@/components/common/attachments';

type Prp = {
  defaultValues: OpportunityFormInputValues;
  opportunityId?: number;
};

function fromVisibility(visibility: OpportunityVisibility): number {
  switch (visibility) {
    case 'all':
      return 2;
    case 'invited':
      return 1;
    case 'nobody':
    default:
      return 0;
  }
}

function toVisibility(code: number): OpportunityVisibility {
  switch (code) {
    case 2:
      return 'all';
    case 1:
      return 'invited';
    default:
      return 'nobody';
  }
}

const OpportunityForm: React.FC<Prp> = ({ defaultValues, opportunityId }) => {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.OpportunityForm');
  const tLegalStatus = useTranslations('Enum.LegalStatus');
  const tGender = useTranslations('Enum.Gender');
  const tIndustry = useTranslations('Enum.Industry');
  const tArtTheme = useTranslations('Enum.ArtTheme');
  const tCountry = useTranslations('Enum.Country');
  const tResidencyOffering = useTranslations('Enum.ResidencyOffering');

  const zodTranslations = useTranslations('Zod.opportunityFormSchema');
  const form = useForm<OpportunityFormInputValues, undefined, OpportunityFormOutputValues>({
    resolver: zodResolver(opportunityFormSchema(zodTranslations)),
    defaultValues,
    shouldUnregister: true,
    mode: 'onChange',
  });
  const [applicationDeadlineValue, responseDeadlineValue] = form.watch(['applicationDeadline', 'responseDeadline']);

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'attachments',
  });

  const onSuccess = useCallback(
    (id: string, fileName: string, fileType: string, thumbnailId?: string) => {
      thumbnailId = thumbnailId || '';
      append({ value: { id, fileName, fileType, thumbnailId } });
    },
    [append]
  );

  const onRemove = useCallback(
    (id: string) => {
      const index = fields.findIndex((field) => field.value.id === id);
      if (index !== -1) {
        remove(index);
      }
    },
    [fields, remove]
  );

  const handleSubmit = useCallback(
    async (values: OpportunityFormOutputValues) => {
      startTransition(async () => {
        const formattedValues = {
          ...values,
          applicationDeadline: toNormalizedDateString(values.applicationDeadline),
          responseDeadline: values.responseDeadline ? toNormalizedDateString(values.responseDeadline) : null,
        };
        if (opportunityId !== undefined) {
          await updateOpportunity(opportunityId, formattedValues);
        } else {
          await createOpportunity(formattedValues);
        }

        redirect('/provider/opportunities');
      });
    },
    [opportunityId]
  );

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      if (opportunityId !== undefined) {
        await deleteOpportunity(opportunityId);
      }

      redirect('/provider/opportunities');
    });
  }, [opportunityId]);

  const legalStatusOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(LegalStatus, tLegalStatus),
    [tLegalStatus]
  );
  const genderOptions = useMemo(() => getSelectOptionsFromEnumTranslated(Gender, tGender), [tGender]);
  const industryOptions = useMemo(() => getSelectOptionsFromEnumTranslated(Industry, tIndustry), [tIndustry]);
  const countryOptions = useMemo(() => getSelectOptionsFromEnumTranslated(Country, tCountry), [tCountry]);
  const themeOptions = useMemo(() => getSelectOptionsFromEnumTranslated(ArtTheme, tArtTheme), [tArtTheme]);
  const residencyOfferingOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(ResidencyOffering, tResidencyOffering),
    [tResidencyOffering]
  );
  const applicationDeadlineDisabledDates = useMemo(() => {
    if (responseDeadlineValue) {
      return [isDayPassed, { after: responseDeadlineValue } as DateAfter];
    }
    return [isDayPassed];
  }, [responseDeadlineValue]);
  const responseDeadlineDisabledDates = useMemo(() => {
    if (applicationDeadlineValue) {
      return [isDayPassed, { before: applicationDeadlineValue } as DateBefore];
    }
    return [isDayPassed];
  }, [applicationDeadlineValue]);

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-white md:border border-black pt-8 pb-[72px] md:py-10 px-4 md:px-[100px] m-auto max-w-[590px]"
      >
        <FormFieldInput control={form.control} name="title" label={t('title')} />

        <FormFieldTextarea control={form.control} name="description" label={t('description')} />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('opportunityType')}</FormLabel>
              <ToggleGroup
                className="flex flex-wrap justify-start"
                type="single"
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                }}
              >
                <ToggleGroupItem value="grant">{t('grant')}</ToggleGroupItem>
                <ToggleGroupItem value="residency">{t('residency')}</ToggleGroupItem>
                <ToggleGroupItem value="award">{t('award')}</ToggleGroupItem>
                <ToggleGroupItem value="mobility">{t('mobility')}</ToggleGroupItem>
                <ToggleGroupItem value="commission">{t('commission')}</ToggleGroupItem>
                <ToggleGroupItem value="other">{t('other')}</ToggleGroupItem>
              </ToggleGroup>
              {field.value === 'grant' && (
                <div className="flex gap-4">
                  <FormFieldInput
                    control={form.control}
                    name="minGrantAmount"
                    label={t('minGrantAmount')}
                    type="number"
                  />
                  <FormFieldInput
                    control={form.control}
                    name="maxGrantAmount"
                    label={t('maxGrantAmount')}
                    type="number"
                  />
                </div>
              )}
              {field.value === 'residency' && (
                <>
                  <div className="flex gap-4">
                    <FormFieldInput
                      control={form.control}
                      name="minResidencyTime"
                      label={t('minResidencyTime')}
                      type="number"
                      placeholder={t('residencyTimePlaceholder')}
                    />
                    <FormFieldInput
                      control={form.control}
                      name="maxResidencyTime"
                      label={t('maxResidencyTime')}
                      type="number"
                      placeholder={t('residencyTimePlaceholder')}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="residencyOffering"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`residencyOffering`)}</FormLabel>
                        <MultipleSelector
                          options={residencyOfferingOptions}
                          value={field.value}
                          placeholder={t(`residencyOffering`)}
                          hidePlaceholderWhenSelected
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormFieldTextarea
                    control={form.control}
                    name="residencyOfferingDescription"
                    label={t('residencyOfferingDescription')}
                  />
                </>
              )}
              {field.value === 'award' && (
                <>
                  <div className="flex gap-4">
                    <FormFieldInput
                      control={form.control}
                      name="minAwardAmount"
                      label={t('minAwardAmount')}
                      type="number"
                    />
                    <FormFieldInput
                      control={form.control}
                      name="maxAwardAmount"
                      label={t('maxAwardAmount')}
                      type="number"
                    />
                  </div>
                  <FormFieldTextarea control={form.control} name="awardSpecialAccess" label={t('awardSpecialAccess')} />
                </>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="legalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`legalStatus`)}</FormLabel>
              <MultipleSelector
                options={legalStatusOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormFieldInput
            control={form.control}
            name="minAge"
            label={t('minAge')}
            placeholder={t(`noLimitationPlaceholder`)}
            type="number"
          />
          <FormFieldInput
            control={form.control}
            name="maxAge"
            label={t('maxAge')}
            placeholder={t(`noLimitationPlaceholder`)}
            type="number"
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`gender`)}</FormLabel>
              <MultipleSelector
                options={genderOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`industry`)}</FormLabel>
              <MultipleSelector
                options={industryOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryResidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`residenceCountry`)}</FormLabel>
              <MultipleSelector
                options={countryOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryCitizenship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`citizenshipCountry`)}</FormLabel>
              <MultipleSelector
                options={countryOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormFieldTextarea control={form.control} name="locationDescription" label={t('locationLimitations')} />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`themes`)}</FormLabel>
              <MultipleSelector
                options={themeOptions}
                value={field.value}
                placeholder={t(`noLimitationPlaceholder`)}
                hidePlaceholderWhenSelected
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormFieldTextarea control={form.control} name="themeDescription" label={t('themeLimitations')} />

        <FormField
          control={form.control}
          name="applicationDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('applicationDeadline')}</FormLabel>
              <CalendarButton
                disabledDates={applicationDeadlineDisabledDates}
                date={field.value}
                onSelect={field.onChange}
                required
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responseDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('responseDeadline')}</FormLabel>
              <CalendarButton
                disabledDates={responseDeadlineDisabledDates}
                date={field.value}
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`whoCanSee.${field.value}`)}</FormLabel>
              <FormControl className="pt-4">
                <Slider
                  className="w-48"
                  defaultValue={[0]}
                  max={2}
                  step={1}
                  min={0}
                  value={[fromVisibility(field.value)]}
                  onValueChange={(value) => {
                    field.onChange(toVisibility(value[0]));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormFieldsAttachments
            title={t('attachments')}
            buttonTitle={t('addAttachments')}
            fields={fields}
            control={form.control}
            onSuccess={onSuccess}
            onRemove={onRemove}
            attachmentTypeSelector
          />
        </div>

        <FormFooter className="flex flex-wrap">
          <Button type="submit" disabled={pending || !form.formState.isValid}>
            {t('submit')}
          </Button>
          {opportunityId !== undefined && (
            <ButtonWithConfirmation
              cancelLabel={t('deleteCancel')}
              confirmLabel={t('deleteConfirm')}
              label={t('deleteLabel')}
              onClick={handleDelete}
              disabled={pending}
            />
          )}
          <Button variant="outline" asChild>
            <Link href={'/provider/opportunities'}>{t('cancel')}</Link>
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};

export default OpportunityForm;
