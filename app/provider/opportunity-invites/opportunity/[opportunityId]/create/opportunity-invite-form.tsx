'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { Artist } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { OpportunityInviteArtistStep } from './opportunity-invite-artist-step';
import { OpportunityInviteMessageStep } from './opportunity-invite-message-step';
import { OpportunityInviteFormItem } from './types';
import { createOpportunityInvites } from '@/lib/opportunity/invite/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';
import { ArtistsQuerySearchParams } from '@/lib/artist/queries';
import { ArtistSearchForm } from '@/components/artist/search-form';
import { SearchPagination, SearchPaginationProps } from '@/components/common/search-pagination';
import { FormErrorMessage } from '@/components/ui/form';

const MAX_MESSAGE_LENGTH = 16384;

interface OpportunityInviteFormProps {
  artists: (Artist & { alreadyInvited: boolean })[];
  opportunityId: number;
  searchParams: ArtistsQuerySearchParams;
  pagination: SearchPaginationProps;
}

export default function OpportunityInviteForm({
  artists,
  opportunityId,
  searchParams,
  pagination,
}: OpportunityInviteFormProps) {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const t = useTranslations('Component.OpportunityInviteForm');

  const [invites, setInvites] = useState<OpportunityInviteFormItem[]>([]);

  const [pending, startTransition] = useTransition();
  const error = useMemo(
    () =>
      message.length <= MAX_MESSAGE_LENGTH &&
      invites.findIndex((invite) => invite.message.length > MAX_MESSAGE_LENGTH) === -1
        ? undefined
        : t('messageMaxLen', { maxLen: MAX_MESSAGE_LENGTH }),
    [message, invites, t]
  );

  const handleInviteToggle = useCallback(
    (artistId: number) => {
      setInvites((prev) =>
        prev.map((invite) => invite.artist.id).includes(artistId)
          ? prev.filter((invite) => invite.artist.id !== artistId)
          : [
              ...prev,
              {
                artist: artists.find((artist) => artist.id === artistId)!,
                message: '',
              },
            ]
      );
    },
    [setInvites, artists]
  );

  const handleInviteRemove = useCallback(
    (artistId: number) => {
      setInvites((prev) => prev.filter((invite) => invite.artist.id !== artistId));
    },
    [setInvites]
  );

  const handleMessageChange = useCallback(
    (artistId: number, message: string) => {
      setInvites((prev) =>
        prev.map((invite) =>
          invite.artist.id === artistId
            ? {
                ...invite,
                message,
              }
            : invite
        )
      );
    },
    [setInvites]
  );

  const handleNextStep = useCallback(() => setStep(1), []);

  const handlePrevStep = useCallback(() => setStep(0), []);

  const handleCreateInvites = useCallback(() => {
    startTransition(async () => {
      await createOpportunityInvites(
        opportunityId,
        message,
        invites.map((invite) => ({
          artistId: invite.artist.id,
          message: invite.message,
        }))
      );
      toast({ title: t('successfullyInvited') });

      redirect(`/provider/opportunity-invites/opportunity/${opportunityId}`);
    });
  }, [invites, message, opportunityId, t]);

  return (
    <div className="space-y-4">
      {step === 0 && (
        <>
          <ArtistSearchForm />
          <OpportunityInviteArtistStep
            artists={artists}
            invites={invites}
            onInviteToggle={handleInviteToggle}
            searchParams={searchParams}
          />
          <SearchPagination pagesTotal={pagination.pagesTotal} currentPage={pagination.currentPage} />
        </>
      )}
      {step === 1 && (
        <OpportunityInviteMessageStep
          invites={invites}
          message={message}
          onMessageChange={setMessage}
          onCustomMessageChange={handleMessageChange}
          onInviteRemove={handleInviteRemove}
        />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      <div className="flex gap-2">
        {step === 0 && (
          <Button onClick={handleNextStep} disabled={invites.length === 0}>
            {t('next')}
          </Button>
        )}
        {step === 1 && (
          <>
            <Button onClick={handleCreateInvites} disabled={!!error || pending || invites.length === 0}>
              {t('invite')}
            </Button>
            <Button variant="outline" onClick={handlePrevStep} disabled={pending}>
              {t('back')}
            </Button>
          </>
        )}
        <Button variant="outline">
          <Link href={`/provider/opportunity-invites/opportunity/${opportunityId}`}>{t('cancel')}</Link>
        </Button>
      </div>
    </div>
  );
}
