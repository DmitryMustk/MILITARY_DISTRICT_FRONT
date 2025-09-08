'use client';

import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/ui/multi-select';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ArtTheme, Country, Industry, Languages } from '@prisma/client';
import { getSelectOptionsFromEnumTranslated, getURIArrayParam, getURINumberParam } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSetParam } from '@/hooks/use-set-search-param';
import { BudgetType, BudgetTypeValue } from '@/lib/artist/types';

export const ArtistSearchForm = () => {
  const t = useTranslations('Component.ArtistSearchForm');
  const tIndustry = useTranslations('Enum.Industry');
  const tBudgetType = useTranslations('Enum.BudgetType');
  const tArtTheme = useTranslations('Enum.ArtTheme');
  const tCountry = useTranslations('Enum.Country');
  const tLanguages = useTranslations('Enum.Languages');

  const languageSelectorOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(Languages, tLanguages),
    [tLanguages]
  );
  const industrySelectorOptions = useMemo(() => getSelectOptionsFromEnumTranslated(Industry, tIndustry), [tIndustry]);
  const countrySelectorOptions = useMemo(() => getSelectOptionsFromEnumTranslated(Country, tCountry), [tCountry]);
  const artistThemeOptions = useMemo(() => getSelectOptionsFromEnumTranslated(ArtTheme, tArtTheme), [tArtTheme]);
  const budgetBudgetTypeOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(BudgetType, tBudgetType),
    [tBudgetType]
  );

  const searchParams = useSearchParams();
  const search = useSetParam();

  const defaultBudgetFilterTypeValues = useMemo(() => {
    const param = searchParams.get('budget');
    if (!param) {
      return [];
    }
    if (param === 'true') {
      return [{ value: BudgetType.MORE_50000, label: tBudgetType(BudgetType.MORE_50000) }];
    }

    const parsedParam = parseInt(param);
    const value = Object.entries(BudgetTypeValue).find(([, value]) => value === parsedParam);
    const type = value ? BudgetType[value[0] as keyof typeof BudgetType] : undefined;

    return type ? [{ value: type, label: tBudgetType(type) }] : [];
  }, [searchParams, tBudgetType]);

  const defaultLanguageValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('language'));
  }, [searchParams]);

  const defaultIndustryValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('industry')).map((val) => ({
      ...val,
      label: tIndustry(val.label as keyof typeof Industry),
    }));
  }, [searchParams, tIndustry]);

  const defaultAgeFromValues = useMemo(() => {
    return getURINumberParam(searchParams.get('age-from')?.toString());
  }, [searchParams]);

  const defaultAgeToValues = useMemo(() => {
    return getURINumberParam(searchParams.get('age-to')?.toString());
  }, [searchParams]);

  const defaultReachToValues = useMemo(() => {
    return getURINumberParam(searchParams.get('reach-to')?.toString());
  }, [searchParams]);

  const defaultReachFromValues = useMemo(() => {
    return getURINumberParam(searchParams.get('reach-from')?.toString());
  }, [searchParams]);

  const defaultArtistThemeValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('theme')).map((val) => ({
      ...val,
      label: tArtTheme(val.label as keyof typeof ArtTheme),
    }));
  }, [searchParams, tArtTheme]);

  const defaultCountryResidenceValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('country-residence')).map((val) => ({
      ...val,
      label: tCountry(val.label as keyof typeof Country),
    }));
  }, [searchParams, tCountry]);

  const defaultCountryCitizenshipValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('country-citizenship')).map((val) => ({
      ...val,
      label: tCountry(val.label as keyof typeof Country),
    }));
  }, [searchParams, tCountry]);

  const onArtistSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'artist');
  }, 500);

  const onProjectSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'project');
  }, 500);

  const onLanguageSearch = useCallback(
    (options: Option[]) =>
      search(options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``, `language`),
    [search]
  );

  const onIndustrySearch = useCallback(
    (options: Option[]) =>
      search(options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``, `industry`),
    [search]
  );

  const onCountryResidenceSearch = useCallback(
    (options: Option[]) =>
      search(
        options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``,
        `country-residence`
      ),
    [search]
  );

  const onCountryCitizenshipSearch = useCallback(
    (options: Option[]) =>
      search(
        options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``,
        `country-citizenship`
      ),
    [search]
  );

  const onArtistThemeSearch = useCallback(
    (options: Option[]) =>
      search(options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``, `theme`),
    [search]
  );

  const handleChangeBudget = useCallback(
    (options: Option[]) => {
      if (options.length === 0) {
        search(undefined, 'budget');
        return;
      }

      const type =
        options.length === 1
          ? BudgetType[options[0].value as keyof typeof BudgetType]
          : BudgetType[options[1].value as keyof typeof BudgetType];

      if (type === BudgetType.MORE_50000) {
        search('true', 'budget');
        return;
      }
      search(encodeURIComponent(BudgetTypeValue[type]), 'budget');
    },
    [search]
  );

  const onAgeFromSearch = useCallback((option: string) => search(encodeURIComponent(option), 'age-from'), [search]);

  const onAgeToSearch = useCallback((option: string) => search(encodeURIComponent(option), 'age-to'), [search]);

  const onReachFromSearch = useCallback((option: string) => search(encodeURIComponent(option), 'reach-from'), [search]);

  const onReachToSearch = useCallback((option: string) => search(encodeURIComponent(option), 'reach-to'), [search]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
      <Input
        type="search"
        maxLength={36}
        placeholder={t('artistSearch')}
        defaultValue={searchParams.get('artist')?.toString()}
        onChange={(e) => {
          onArtistSearch(e.target.value);
        }}
      />
      <Input
        max={defaultAgeToValues ?? 100}
        min={0}
        type="number"
        placeholder={t('fromAgePlaceholder')}
        defaultValue={defaultAgeFromValues}
        onChange={(e) => {
          onAgeFromSearch(e.target.value);
        }}
      />
      <Input
        max={100}
        min={defaultAgeFromValues ?? 0}
        type="number"
        placeholder={t('toAgePlaceholder')}
        defaultValue={defaultAgeToValues}
        onChange={(e) => {
          onAgeToSearch(e.target.value);
        }}
      />
      <MultipleSelector
        options={languageSelectorOptions}
        value={defaultLanguageValues}
        placeholder={t('selectArtistLanguage')}
        hidePlaceholderWhenSelected
        onChange={onLanguageSearch}
      />
      <MultipleSelector
        options={industrySelectorOptions}
        value={defaultIndustryValues}
        placeholder={t('selectIndustry')}
        hidePlaceholderWhenSelected
        onChange={onIndustrySearch}
      />
      <MultipleSelector
        options={countrySelectorOptions}
        value={defaultCountryResidenceValues}
        placeholder={t('selectCountryResidence')}
        hidePlaceholderWhenSelected
        onChange={onCountryResidenceSearch}
      />
      <MultipleSelector
        options={countrySelectorOptions}
        value={defaultCountryCitizenshipValues}
        placeholder={t('selectCountryCitizenship')}
        hidePlaceholderWhenSelected
        onChange={onCountryCitizenshipSearch}
      />
      <MultipleSelector
        options={artistThemeOptions}
        value={defaultArtistThemeValues}
        placeholder={t('selectArtistTheme')}
        hidePlaceholderWhenSelected
        creatable
        onChange={onArtistThemeSearch}
      />
      <Input
        maxLength={36}
        placeholder={t('projectSearch')}
        defaultValue={searchParams.get('project')?.toString()}
        type="search"
        onChange={(e) => {
          onProjectSearch(e.target.value);
        }}
      />
      <Input
        max={defaultReachToValues}
        min={0}
        type="number"
        placeholder={t('selectMinimumAudience')}
        defaultValue={defaultReachFromValues}
        onChange={(e) => {
          onReachFromSearch(e.target.value);
        }}
      />
      <Input
        min={defaultReachFromValues ?? 0}
        type="number"
        placeholder={t('selectMaximumAudience')}
        defaultValue={defaultReachToValues}
        onChange={(e) => {
          onReachToSearch(e.target.value);
        }}
      />
      <MultipleSelector
        options={budgetBudgetTypeOptions}
        value={defaultBudgetFilterTypeValues}
        placeholder={t('budget')}
        hidePlaceholderWhenSelected
        creatable
        onChange={handleChangeBudget}
        hideClearAllButton
      />
    </div>
  );
};
