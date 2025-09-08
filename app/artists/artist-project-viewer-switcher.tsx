'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSetParam } from '@/hooks/use-set-search-param';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

enum ViewType {
  ARTISTS_ONLY = 'ARTISTS_ONLY',
  PROJECTS_ONLY = 'PROJECTS_ONLY',
}

export const ArtistProjectViewerSwitcher = () => {
  const t = useTranslations('Component.ArtistProjectViewerSwitcher');

  const searchParams = useSearchParams();
  const search = useSetParam();

  const defaultViewType = useMemo(() => {
    return searchParams.get('include-project') ? ViewType.PROJECTS_ONLY : ViewType.ARTISTS_ONLY;
  }, [searchParams]);

  const onViewTypeChangeSearch = useCallback(
    (type: ViewType) => {
      search(type === ViewType.PROJECTS_ONLY ? 'true' : undefined, `include-project`);
      search('1', 'page');
    },
    [search]
  );

  return (
    <div className="flex gap-5">
      <div className="flex gap-2">
        <Checkbox
          variant="circle"
          checked={defaultViewType === ViewType.ARTISTS_ONLY}
          onCheckedChange={(e) => e && onViewTypeChangeSearch(ViewType.ARTISTS_ONLY)}
        />
        <Label>{t('artistsOnly')}</Label>
      </div>
      <div className="flex gap-2">
        <Checkbox
          variant="circle"
          checked={defaultViewType === ViewType.PROJECTS_ONLY}
          onCheckedChange={(e) => e && onViewTypeChangeSearch(ViewType.PROJECTS_ONLY)}
        />
        <Label>{t('projectsOnly')}</Label>
      </div>
    </div>
  );
};
