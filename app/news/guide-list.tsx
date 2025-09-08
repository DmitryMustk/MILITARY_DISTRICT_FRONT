'use client';

import { Guide } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NewsGuideCard } from './news-guide-card';

interface GuideListProps {
  guides: Guide[];
}

const MAX_GUIDE_COUNT = 10;

export const GuideList = ({ guides }: GuideListProps) => {
  const t = useTranslations('Component.GuideList');
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 flex-col w-full max-w-2xl">
      {guides.length <= MAX_GUIDE_COUNT ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{t('guides')}</h2>
          <div className="flex flex-col space-y-2">
            {guides.map((guide, key) => (
              <NewsGuideCard guide={guide} key={key} />
            ))}
          </div>
        </>
      ) : open ? (
        <>
          <div className="flex">
            <Button className="text-2xl font-bold mb-4" variant="ghost" onClick={() => setOpen(false)}>
              {t('hideGuides')} <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            {guides.map((guide, key) => (
              <NewsGuideCard guide={guide} key={key} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex">
          <Button className="text-2xl font-bold mb-4" variant="ghost" onClick={() => setOpen(true)}>
            {t('showGuides')} <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
