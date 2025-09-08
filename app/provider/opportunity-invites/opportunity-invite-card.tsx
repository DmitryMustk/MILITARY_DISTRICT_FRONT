'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { $Enums, Artist, Opportunity, OpportunityApplication, OpportunityInvite } from '@prisma/client';
import { ArtistCardHeader } from '@/components/artist/artist-card-header';
import { useCallback, useTransition } from 'react';
import { deleteOpportunityInvite } from '@/lib/opportunity/invite/actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { OpportunityCardHeader } from '@/components/opportunities/opportunity-card-header';

interface OpportunityInviteCardProps {
  invite: OpportunityInvite;
  artist?: Artist;
  opportunity?: Opportunity;
  application?: OpportunityApplication;
}

export function OpportunityInviteCard({ invite, application, artist, opportunity }: OpportunityInviteCardProps) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations('Component.OpportunityInviteCard');
  const router = useRouter();

  const handleDelete = useCallback(
    () =>
      startTransition(async () => {
        await deleteOpportunityInvite(invite.id);

        router.refresh();
      }),
    [invite.id, , router]
  );

  const handleApplicationView = useCallback(() => {
    toast({
      title: t('notImplemented'), // TODO: implement it.
    });
  }, [toast, t]);

  return (
    <Card className="flex flex-col justify-between">
      {artist && <ArtistCardHeader artist={artist} />}
      {opportunity && <OpportunityCardHeader opportunity={opportunity} />}
      <CardContent>
        <p className="whitespace-pre-wrap truncate">{invite.message}</p>
      </CardContent>
      <CardFooter className="justify-start">
        {!application && invite.status === $Enums.OpportunityInviteStatus.pending && (
          <Button variant="outline" disabled={pending} onClick={handleDelete}>
            {t('cancelInvitation')}
          </Button>
        )}

        {!application && invite.status === $Enums.OpportunityInviteStatus.rejected && <p>{t('rejected')}</p>}

        {application && (
          <Button variant="outline" onClick={handleApplicationView}>
            {t('viewApplication')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
