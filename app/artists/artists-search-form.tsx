'use client';

import { useState } from 'react';
import { ArtistProjectViewerSwitcher } from './artist-project-viewer-switcher';
import { Button } from '@/components/ui/button';
import { ArtistSearchForm } from '@/components/artist/search-form';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ArtistsSearchForm = () => {
  const [hidden, setHidden] = useState(false);
  const t = useTranslations('Component.ArtistsSearchForm');

  return (
    <div>
      {!hidden ? (
        <div className="flex gap-4 flex-col">
          <div className="flex">
            <Button className="text-xl font-archivo-narrow font-bold" variant="ghost" onClick={() => setHidden(true)}>
              {t('hideFilter')} <ChevronUp className="h-6 w-6" />
            </Button>
          </div>
          <ArtistProjectViewerSwitcher />
          <ArtistSearchForm />
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
