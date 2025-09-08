'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateArtistAdminMark } from '@/lib/admin/action';
import { $Enums, AdminMark } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useTransition } from 'react';

interface ArtistAdminMarkSelectProps {
  initialValue: AdminMark;
  artistId: number;
}

export const ArtistAdminMarkSelect = ({ initialValue, artistId }: ArtistAdminMarkSelectProps) => {
  const [mark, setMark] = useState<AdminMark>(initialValue);
  const tAdminMark = useTranslations('Enum.AdminMark');
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations('Component.ArtistAdminMarkSelect');

  const handleValueChange = useCallback(
    (newValue: AdminMark) => {
      startTransition(async () => {
        setMark(newValue);
        await updateArtistAdminMark(artistId, newValue);
        toast({ title: t('successfullyAdminMark') });
      });
    },
    [artistId, t, toast]
  );

  return (
    <Select
      disabled={pending}
      defaultValue={mark}
      onValueChange={(e) => handleValueChange(AdminMark[e as keyof typeof AdminMark])}
    >
      <SelectTrigger>
        <SelectValue>{tAdminMark(mark)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values($Enums.AdminMark).map((mark) => (
          <SelectItem value={mark} key={mark}>
            {tAdminMark(mark)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
