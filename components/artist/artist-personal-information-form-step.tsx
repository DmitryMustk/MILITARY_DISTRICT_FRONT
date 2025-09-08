import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormFieldInput, FormFieldSelect } from '../ui/form-field';
import { cn, getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import CalendarIcon from '../../public/images/calendar.svg';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useMultiStepFormContext } from '../ui/multi-step-form';
import Link from 'next/link';
import { Country } from '@prisma/client';
import React from 'react';

const minDate = new Date('1900-01-01');

export const ArtistPersonalInformationFormStep = ({
  backLink,
  showModerationWarning,
}: {
  backLink?: string;
  showModerationWarning?: boolean;
}) => {
  const t = useTranslations('Component.ArtistPersonalInformationFormStep');
  const tCountry = useTranslations('Enum.Country');
  const { form, nextStep, isStepValid, prevStep, isFirstStep } = useMultiStepFormContext();
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <FormFieldInput control={form.control} name="personal.firstName" label={t('firstName')} />
          <FormFieldInput control={form.control} name="personal.lastName" label={t('lastName')} />
        </div>
        <FormField
          control={form.control}
          name="personal.birthDay"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('dateBirth')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'min-h-[52px] pl-4 text-left font-normal rounded-none',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>{t('pickDate')}</span>}
                      <CalendarIcon className="ml-auto h-6 w-6" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    defaultMonth={field.value || Date.now()}
                    selected={field.value}
                    onSelect={field.onChange}
                    onMonthChange={field.onChange}
                    disabled={(date) => date > new Date() || date < minDate}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>{t('dateBirthDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFieldInput
          control={form.control}
          name="personal.phone"
          label={t('phoneNumber')}
          placeholder="+1 (000) 000-0000"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <FormFieldSelect
            control={form.control}
            name="personal.countryCitizenship"
            options={getSelectOptionsFromEnumTranslated(Country, tCountry)}
            label={t('countryCitizenship')}
            description={t('countryCitizenshipDesc')}
          />
          <FormFieldSelect
            control={form.control}
            name="personal.countryResidence"
            options={getSelectOptionsFromEnumTranslated(Country, tCountry)}
            label={t('countryResidence')}
            description={t('countryResidenceDesc')}
          />
        </div>
        {showModerationWarning && <p className="text-red">{t('moderationWarning')}</p>}
        <div className="flex justify-between gap-3 items-center !mt-8 md:!mt-10">
          <div className="flex justify-between w-full">
            {!!backLink && (
              <Button variant="outline" size="lg">
                <Link href={backLink}>{t('backLink')}</Link>
              </Button>
            )}
            {!isFirstStep && (
              <Button variant="outline" size="lg" onClick={prevStep} disabled={!isStepValid()}>
                {t('back')}
              </Button>
            )}
            <Button size="lg" onClick={nextStep} disabled={!isStepValid()}>
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
