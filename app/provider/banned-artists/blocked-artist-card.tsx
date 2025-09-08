'use client';

import { useCallback, useTransition } from 'react';
import { Artist } from '@prisma/client';
import { ArtistCard } from '@/components/artist/artist-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unblockArtist } from '@/lib/opportunity-application/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';

interface BlockedArtistCardProps {
  artist: Artist;
}

export const BlockedArtistCard = ({ artist }: BlockedArtistCardProps) => {
  const t = useTranslations('Component.BlockedArtistCard');
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const handleUnblock = useCallback(() => {
    startTransition(async () => {
      await unblockArtist(artist.id);
      toast({ title: t('artistUnblocked') });
      router.refresh();
    });
  }, [artist.id, toast, t, router]);

  return (
    <ArtistCard artist={artist}>
      <div className="flex flex-col gap-2">
        <Button className="block max-w-min">
          <Link href={`/artists/${artist.id}`}>{t('viewProfile')}</Link>
        </Button>
        <ButtonWithConfirmation
          className="block"
          variant="outline"
          disabled={pending}
          onClick={handleUnblock}
          label={t('restore')}
          cancelLabel={t('restoreCancel')}
          confirmLabel={t('restoreConfirm')}
          closeOnClick={true}
        />
      </div>
    </ArtistCard>
  );
};
