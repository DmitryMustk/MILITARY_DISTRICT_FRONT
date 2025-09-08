import { getTranslations } from 'next-intl/server';
import { getUsersDetails } from '@/lib/admin/user-managements';
import { ArtistCard } from '@/components/artist/artist-card';
import LockUnlockButton from '../lock-unlock-button';
import { ProviderCard } from '@/components/provider/provider-card';
import { BackButton } from '@/components/common/back-button';

export default async function UsersPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const t = await getTranslations('Page.UserPage');

  const details = await getUsersDetails(parseInt(userId));

  return (
    <div className="space-y-8 mb-8">
      <h1 className="font-bold">
        {' '}
        {details?.artist ? t('artistDetails') : t('providerDetails')}: {details?.username}{' '}
      </h1>
      {details?.artist && (
        <ArtistCard artist={details.artist}>
          <div className="pt-4 flex justify-between items-center gap-3">
            <LockUnlockButton isLocked={details.locked} userId={details.id} />
            <BackButton variant={'outline'}>{t('backUsers')}</BackButton>
          </div>
        </ArtistCard>
      )}
      {details?.provider && (
        <ProviderCard provider={details.provider}>
          <LockUnlockButton isLocked={details.locked} userId={details.id} />
          <BackButton variant={'outline'}>{t('backUsers')}</BackButton>
        </ProviderCard>
      )}
    </div>
  );
}
