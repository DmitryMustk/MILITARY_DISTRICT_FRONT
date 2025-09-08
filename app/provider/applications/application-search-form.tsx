'use client';

import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/ui/multi-select';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Opportunity } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSetParam } from '@/hooks/use-set-search-param';
import { getSelectOptionsFromEnumTranslated } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProviderOpportunityApplicationSearchFormProps {
  opportunities: Opportunity[];
}

enum OpportunityApplicationStatus {
  sent = 'sent',
  shortlisted = 'shortlisted',
  rejected = 'rejected',
  archived = 'archived',
  viewlater = 'viewlater',
}

export const ProviderOpportunityApplicationSearchForm = ({
  opportunities,
}: ProviderOpportunityApplicationSearchFormProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [hidden, setHidden] = useState(false);
  const t = useTranslations('Component.ProviderOpportunityApplicationSearchForm');
  const tStatus = useTranslations('Enum.OpportunityApplicationStatus');
  const opportunitiesOptions = useMemo(
    () => opportunities.map((op) => ({ value: String(op.id), label: op.title })),
    [opportunities]
  );
  const applicationStatusOptions = useMemo(() => {
    return getSelectOptionsFromEnumTranslated(OpportunityApplicationStatus, tStatus);
  }, [tStatus]);

  const searchParams = useSearchParams();
  const search = useSetParam();

  const defaultOpportunityStatus = useMemo(() => {
    const param = searchParams.get('applicationStatus');
    if (!param) {
      return [];
    }

    const statuses = decodeURIComponent(param).split(',');
    return statuses.map((status) => ({
      value: status,
      label: tStatus(OpportunityApplicationStatus[status as keyof typeof OpportunityApplicationStatus]),
    }));
  }, [searchParams, tStatus]);

  const defaultOpportunities = useMemo(() => {
    const param = searchParams.get('opportunities');
    if (!param) {
      return [];
    }

    const opportunitiesIds = decodeURIComponent(param).split(',');
    return opportunitiesIds.map((id) => ({
      value: id,
      label: opportunities.find((o) => o.id === parseInt(id))?.title ?? '',
    }));
  }, [searchParams, opportunities]);

  const onApplicationMessageSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'applicationMessage');
  }, 500);

  const onApplicantNameSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'applicantName');
  }, 500);

  const onProjectDescriptionSearch = useDebouncedCallback((searchString: string) => {
    search(searchString, 'projectDescription');
  }, 500);

  const onShowBlockChange = useCallback(
    (showBlock: boolean) => {
      search(String(showBlock), 'showBlock');
    },
    [search]
  );

  const onApplicationStatusSearch = useCallback(
    (options: Option[]) => {
      const params = new URLSearchParams(searchParams);
      if (options.length) {
        params.set('applicationStatus', encodeURIComponent(options.map((option) => option.value).join(',')));
      } else {
        params.delete('applicationStatus');
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );

  const onOpportunitySearch = useCallback(
    (options: Option[]) => {
      const params = new URLSearchParams(searchParams);
      if (options.length) {
        params.set('opportunities', encodeURIComponent(options.map((option) => option.value).join(',')));
      } else {
        params.delete('opportunities');
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );

  return (
    <div>
      {!hidden ? (
        <div className="flex gap-4 flex-col">
          <div className="flex">
            <Button className="text-xl font-archivo-narrow font-bold" variant="ghost" onClick={() => setHidden(true)}>
              {t('hideFilter')} <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <Input
              maxLength={36}
              type="search"
              placeholder={t('applicantNameSearch')}
              defaultValue={searchParams.get('applicantName')?.toString()}
              onChange={(e) => {
                onApplicantNameSearch(e.target.value);
              }}
            />
            <Input
              maxLength={36}
              type="search"
              placeholder={t('messageSearch')}
              defaultValue={searchParams.get('applicationMessage')?.toString()}
              onChange={(e) => {
                onApplicationMessageSearch(e.target.value);
              }}
            />
            <Input
              type="search"
              maxLength={36}
              placeholder={t('projectDescriptionSearch')}
              defaultValue={searchParams.get('projectDescription')?.toString()}
              onChange={(e) => {
                onProjectDescriptionSearch(e.target.value);
              }}
            />
            <MultipleSelector
              options={applicationStatusOptions}
              value={defaultOpportunityStatus}
              placeholder={t('selectProjectStatus')}
              hidePlaceholderWhenSelected
              onChange={onApplicationStatusSearch}
            />
            <MultipleSelector
              options={opportunitiesOptions}
              value={defaultOpportunities}
              placeholder={t('selectOpportunity')}
              hidePlaceholderWhenSelected
              onChange={onOpportunitySearch}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={searchParams.get('showBlock')?.toString() === 'true'}
                onCheckedChange={onShowBlockChange}
                id="showBlockId"
              />
              <Label
                htmlFor="showBlockId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('showBlockApplicants')}
              </Label>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Button className="text-xl font-archivo-narrow font-bold" variant="ghost" onClick={() => setHidden(false)}>
            {t('showFilter')} <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
