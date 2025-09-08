'use client';

import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/ui/multi-select';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Role } from '@prisma/client';
import { getSelectOptionsFromEnum, getURIArrayParam } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSetParam } from '@/hooks/use-set-search-param';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const UserSearchForm = () => {
  const t = useTranslations('Component.UserSearchForm');

  const roleSelectionOptions = useMemo(() => getSelectOptionsFromEnum(Role), []);

  const searchParams = useSearchParams();
  const search = useSetParam();

  const defaultRoleValues = useMemo(() => {
    return getURIArrayParam(searchParams.get('roles'));
  }, [searchParams]);

  const onEmailSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'email');
  }, 500);

  const onUsernameSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'username');
  }, 500);

  const onRolesSearch = useCallback(
    (options: Option[]) =>
      search(options.length ? encodeURIComponent(options.map((option) => option.value).join(',')) : ``, `roles`),
    [search]
  );

  const onLockedSearch = useCallback(
    (value: string) => {
      search(value !== 'undefined' ? encodeURIComponent(value) : undefined, 'locked');
    },
    [search]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:height-[52px]">
      <Input
        className="w-full md:w-auto min-h-10"
        type="search"
        maxLength={36}
        placeholder={t('emailSearch')}
        defaultValue={searchParams.get('email')?.toString()}
        onChange={(e) => {
          onEmailSearch(e.target.value);
        }}
      />
      <Input
        className="w-full md:w-auto min-h-10"
        type="search"
        maxLength={36}
        placeholder={t('usernameSearch')}
        defaultValue={searchParams.get('username')?.toString()}
        onChange={(e) => {
          onUsernameSearch(e.target.value);
        }}
      />
      <MultipleSelector
        options={roleSelectionOptions}
        value={defaultRoleValues}
        placeholder={t('roleSearch')}
        hidePlaceholderWhenSelected
        onChange={onRolesSearch}
      />
      <Select defaultValue={searchParams.get('locked') || 'undefined'} onValueChange={(e) => onLockedSearch(e)}>
        <SelectTrigger className="min-h-10 mr-4">
          <SelectValue placeholder={t('locked')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value="undefined">
            Show all
          </SelectItem>
          <SelectItem key="locked" value="true">
            Locked only
          </SelectItem>
          <SelectItem key="active" value="false">
            Active only
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
