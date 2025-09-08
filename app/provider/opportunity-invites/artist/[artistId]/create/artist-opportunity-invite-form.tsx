'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { Opportunity } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';
import { OpportunityInviteOpportunityStep } from './opportunity-invite-opportunity-step';
import { ArtistOpportunityInviteMessageStep } from './artist-opportunity-invite-message-step';
import { ArtistOpportunityInviteFormItem, Step } from './types';
import { createArtistOpportunityInvites } from '@/lib/opportunity/invite/actions';
import { FormErrorMessage } from '@/components/ui/form';
interface ArtistOpportunityInviteFormProps {
  opportunities: (Opportunity & { alreadyInvited: boolean })[];
  artistId: number;
}

const MAX_MESSAGE_LENGTH = 16384;

export default function ArtistOpportunityInviteForm({ artistId, opportunities }: ArtistOpportunityInviteFormProps) {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<Step>('first');
  const t = useTranslations('Component.ArtistOpportunityInviteForm');
  const router = useRouter();

  const [invites, setInvites] = useState<ArtistOpportunityInviteFormItem[]>([]);

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
    (opportunityId: number) => {
      setInvites((prev) =>
        prev.findIndex((invite) => invite.opportunity.id === opportunityId) !== -1
          ? prev.filter((invite) => invite.opportunity.id !== opportunityId)
          : [
              ...prev,
              {
                opportunity: opportunities.find((opportunity) => opportunity.id === opportunityId)!,
                message: '',
              },
            ]
      );
    },
    [setInvites, opportunities]
  );

  const handleInviteRemove = useCallback(
    (opportunityId: number) => {
      setInvites((prev) => prev.filter((invite) => invite.opportunity.id !== opportunityId));
    },
    [setInvites]
  );

  const handleMessageChange = useCallback(
    (opportunityId: number, message: string) => {
      setInvites((prev) =>
        prev.map((invite) =>
          invite.opportunity.id === opportunityId
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

  const handleNextStep = useCallback(() => setStep('second'), []);

  const handlePrevStep = useCallback(() => setStep('first'), []);

  const handleCreateInvites = useCallback(() => {
    startTransition(async () => {
      await createArtistOpportunityInvites(
        artistId,
        message,
        invites.map((invite) => ({
          opportunityId: invite.opportunity.id,
          message: invite.message,
        }))
      );
      toast({ title: t('successfullyInvited') });

      router.push(`/provider/opportunity-invites/artist/${artistId}`);
    });
  }, [t, router, artistId, invites, message]);

  return (
    <div className="space-y-4">
      {step === 'first' && (
        <OpportunityInviteOpportunityStep
          opportunities={opportunities}
          invites={invites}
          onInviteToggle={handleInviteToggle}
        />
      )}
      {step === 'second' && (
        <ArtistOpportunityInviteMessageStep
          invites={invites}
          message={message}
          onMessageChange={setMessage}
          onCustomMessageChange={handleMessageChange}
          onInviteRemove={handleInviteRemove}
        />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      <div className="flex gap-2">
        {step === 'first' && (
          <Button onClick={handleNextStep} disabled={invites.length === 0}>
            {t('next')}
          </Button>
        )}
        {step === 'second' && (
          <>
            <Button onClick={handleCreateInvites} disabled={pending || invites.length === 0 || !!error}>
              {t('invite')}
            </Button>
            <Button variant="outline" onClick={handlePrevStep} disabled={pending}>
              {t('back')}
            </Button>
          </>
        )}
        <Button variant="outline">
          <Link href={`/provider/opportunity-invites/artist/${artistId}`}>{t('cancel')}</Link>
        </Button>
      </div>
    </div>
  );
}
