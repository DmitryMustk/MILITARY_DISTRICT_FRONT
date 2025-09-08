'use client';

import { SearchSelect } from '@/components/common/search-select';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import { ModerationDateFilter, ModerationEntityFilter } from '@/lib/moderation/queries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ModerationSearchForm() {
  const t = useTranslations('Component.ModerationSearchForm');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const entityOptions = useMemo(() => getSelectOptionsFromEnumTranslated(ModerationEntityFilter, t), [t]);
  const dateOptions = useMemo(() => getSelectOptionsFromEnumTranslated(ModerationDateFilter, t), [t]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (!searchParams.get('entity')) {
      newSearchParams.set('entity', entityOptions[0].value);
    }
    if (!searchParams.get('date')) {
      newSearchParams.set('date', dateOptions[0].value);
    }
    replace(`${pathname}?${newSearchParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!searchParams.size) {
    return null;
  }

  return (
    <div className="flex gap-y-4 gap-x-3 flex-col md:flex-row flex-wrap">
      <SearchSelect options={entityOptions} paramName="entity" resetPagination />
      <SearchSelect options={dateOptions} paramName="date" resetPagination />
    </div>
  );
}
