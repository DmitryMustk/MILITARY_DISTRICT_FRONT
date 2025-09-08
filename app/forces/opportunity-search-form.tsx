'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { fromNormalizedDateString, isDayPassed, toNormalizedDateString } from '@/lib/date-format';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useSetParam } from '@/hooks/use-set-search-param';
import { User } from 'next-auth';
import {
  ArtTheme,
  Country,
  Gender,
  Industry,
  LegalStatus,
  OpportunityType,
  ResidencyOffering,
  Role,
} from '@prisma/client';
import { CalendarButton } from '@/components/common/calendar-button';
import { getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import { SearchSelect } from '@/components/common/search-select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEBOUNCE_MS = 500;

type OpportunitySearchFormProps = {
  user: User | undefined;
};

export function OpportunitySearchForm({ user }: OpportunitySearchFormProps) {
  const t = useTranslations('Component.OpportunitySearchForm');
  const tOpportunityType = useTranslations('Enum.OpportunityType');
  const tLegalStatus = useTranslations('Enum.LegalStatus');
  const tGender = useTranslations('Enum.Gender');
  const tIndustry = useTranslations('Enum.Industry');
  const tArtTheme = useTranslations('Enum.ArtTheme');
  const tCountry = useTranslations('Enum.Country');
  const tResidencyOffering = useTranslations('Enum.ResidencyOffering');

  const searchParams = useSearchParams();
  const search = useSetParam();
  const [hidden, setHidden] = useState(false);

  const keyword = searchParams.get(`keyword`) || undefined;
  const grantFrom = searchParams.get(`grant-from`) || undefined;
  const grantTo = searchParams.get(`grant-to`) || undefined;
  const residencyTime = searchParams.get(`residency-time`) || undefined;
  const awardFrom = searchParams.get(`award-from`) || undefined;
  const awardTo = searchParams.get(`award-to`) || undefined;
  const type = searchParams.get(`type`) || `all`;
  const invite = searchParams.get(`invite`) || `all`;

  const dateFromParam = searchParams.get(`application-from`);
  const dateFrom = dateFromParam ? fromNormalizedDateString(dateFromParam) : null;

  const dateToParam = searchParams.get(`application-to`);
  const dateTo = dateToParam ? fromNormalizedDateString(dateToParam) : null;

  const age = searchParams.get(`age`) || undefined;

  const searchAndOpenFirstPage = useCallback(
    (...params: Parameters<typeof search>) => {
      search(...params);
      search(``, `page`);
    },
    [search]
  );

  const handleKeywordChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'keyword'),
    DEBOUNCE_MS
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      searchAndOpenFirstPage(value !== `all` ? value : ``, `type`);
      if (value !== `grant`) {
        search(``, `grant-from`);
        search(``, `grant-to`);
      }
      if (value !== `residency`) {
        search(``, `residency-time`);
        search(``, `residency-offering`);
      }
      if (value !== `award`) {
        search(``, `award-from`);
        search(``, `award-to`);
      }
    },
    [searchAndOpenFirstPage, search]
  );

  const handleInviteChange = useCallback(
    (value: string) => searchAndOpenFirstPage(value !== `all` ? value : ``, `invite`),
    [searchAndOpenFirstPage]
  );

  const handleGrantFromChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'grant-from'),
    DEBOUNCE_MS
  );

  const handleGrantToChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'grant-to'),
    DEBOUNCE_MS
  );

  const handleResidencyTimeChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'residency-time'),
    DEBOUNCE_MS
  );

  const handleAwardFromChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'award-from'),
    DEBOUNCE_MS
  );

  const handleAwardToChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'award-to'),
    DEBOUNCE_MS
  );

  const handleDateFromSelect = useCallback(
    (value: Date | null) =>
      searchAndOpenFirstPage(value ? toNormalizedDateString(value) : undefined, `application-from`),
    [searchAndOpenFirstPage]
  );

  const handleDateToSelect = useCallback(
    (value: Date | null) => searchAndOpenFirstPage(value ? toNormalizedDateString(value) : undefined, `application-to`),
    [searchAndOpenFirstPage]
  );

  const handleAgeChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => searchAndOpenFirstPage(e.target.value, 'age'),
    DEBOUNCE_MS
  );

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
  const opportunityTypeOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(OpportunityType, tOpportunityType),
    [tOpportunityType]
  );

  return (
    <>
      {!hidden ? (
        <div className="flex gap-4 flex-col">
          <div className="flex">
            <Button className="text-xl font-archivo-narrow font-bold" variant="ghost" onClick={() => setHidden(true)}>
              {t('hideFilter')} <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <Input
              defaultValue={keyword}
              onChange={handleKeywordChange}
              maxLength={36}
              placeholder={t('fullTextSearch')}
              type="search"
            />

            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder={t(`opportunityType`)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'all'}>{t('showAllTypes')}</SelectItem>
                {opportunityTypeOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CalendarButton
              placeholder={t('deadlineAfter')}
              disabledDates={isDayPassed}
              date={dateFrom}
              onSelect={handleDateFromSelect}
            />

            <CalendarButton
              placeholder={t('deadlineBefore')}
              disabledDates={isDayPassed}
              date={dateTo}
              onSelect={handleDateToSelect}
            />

            <Input
              defaultValue={age}
              onChange={handleAgeChange}
              maxLength={10}
              placeholder={t('age')}
              type={`number`}
            />

            <SearchSelect placeholder={t(`gender`)} options={genderOptions} paramName="gender" resetPagination />

            <SearchSelect
              placeholder={t(`residenceCountry`)}
              options={countryOptions}
              paramName="country-residence"
              resetPagination
            />

            <SearchSelect
              placeholder={t(`citizenshipCountry`)}
              options={countryOptions}
              paramName="country-citizenship"
              resetPagination
            />

            <SearchSelect
              placeholder={t(`legalStatus`)}
              options={legalStatusOptions}
              paramName="legal-status"
              resetPagination
            />

            <SearchSelect placeholder={t(`industry`)} options={industryOptions} paramName="industry" resetPagination />

            <SearchSelect placeholder={t(`theme`)} options={themeOptions} paramName="theme" resetPagination />

            {type === 'grant' && (
              <Input
                defaultValue={grantFrom}
                onChange={handleGrantFromChange}
                maxLength={10}
                placeholder={t('amountFrom')}
                type={`number`}
              />
            )}

            {type === 'grant' && (
              <Input
                defaultValue={grantTo}
                onChange={handleGrantToChange}
                maxLength={10}
                placeholder={t('amountTo')}
                type={`number`}
              />
            )}

            {type === 'residency' && (
              <Input
                defaultValue={residencyTime}
                onChange={handleResidencyTimeChange}
                maxLength={10}
                placeholder={t('residencyTime')}
                type={`number`}
              />
            )}

            {type === 'residency' && (
              <SearchSelect
                placeholder={t(`residencyOffering`)}
                options={residencyOfferingOptions}
                paramName="residency-offering"
                resetPagination
              />
            )}

            {type === 'award' && (
              <Input
                defaultValue={awardFrom}
                onChange={handleAwardFromChange}
                maxLength={10}
                placeholder={t('awardFrom')}
                type={`number`}
              />
            )}

            {type === 'award' && (
              <Input
                defaultValue={awardTo}
                onChange={handleAwardToChange}
                maxLength={10}
                placeholder={t('awardTo')}
                type={`number`}
              />
            )}

            {user?.role.includes(Role.ARTIST) && (
              <Select value={invite} onValueChange={handleInviteChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('mode')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'all'}>{t('showAll')}</SelectItem>
                  <SelectItem value={'invites'}>{t('invites')}</SelectItem>
                  <SelectItem value={'in-progress'}>{t('in-progress')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Button className="text-xl font-archivo-narrow font-bold" variant="ghost" onClick={() => setHidden(false)}>
            {t('showFilter')} <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
}
