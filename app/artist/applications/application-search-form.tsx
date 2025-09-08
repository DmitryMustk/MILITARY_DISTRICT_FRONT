'use client';

import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const applicationTypeValuesToLabelMap: { [key: string]: string } = {
  ' ': 'actual',
  new: 'new',
  sent: 'sent',
  shortlisted: 'shortlisted',
  viewlater: 'underConsideration',
  archivedByArtist: 'archivedByArtist',
  archived: 'archived',
  rejected: 'rejected',
};

export const ApplicationSearchForm = ({ initialValue }: { initialValue: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [applicationType, setApplicationType] = useState(initialValue || ' ');
  const t = useTranslations('Page.OpportunityApplicationsPage');

  const handleApplicationTypeChange = useCallback(
    (value: string) => {
      setApplicationType(value);
      if (value === ' ') {
        router.push(pathname);
      } else {
        router.push(`${pathname}?st=${value}`);
      }
    },
    [pathname, router]
  );

  return (
    <Select onValueChange={handleApplicationTypeChange} defaultValue={applicationType}>
      <SelectTrigger className="w-auto min-w-[200px]">
        {/* @ts-expect-error correct keys */}
        <SelectValue>{t(applicationTypeValuesToLabelMap[applicationType])}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(applicationTypeValuesToLabelMap).map((value) => (
          <SelectItem value={value} key={value}>
            {/* @ts-expect-error correct keys */}
            {t(applicationTypeValuesToLabelMap[value])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
