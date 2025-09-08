'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { OpportunityInviteUnregisteredArtist } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCallback, useTransition } from 'react';
import { deleteOpportunityInviteUnregistered } from '@/lib/opportunity/invite/actions';
import { useRouter } from 'next/navigation';

interface OpportunityInviteCardProps {
  invite: OpportunityInviteUnregisteredArtist & { email: string };
}

export function OpportunityInviteUnregisteredCard({ invite }: OpportunityInviteCardProps) {
  const t = useTranslations('Component.OpportunityInviteUnregisteredCard');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      await deleteOpportunityInviteUnregistered(invite.id);
      router.refresh();
    });
  }, [invite, router]);

  return (
    <Card>
      <CardHeader>
        <div>
          <Badge variant={'secondary'}>{t('unregisteredArtist')}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-semibold">{t('email')}</h3>
          <p className="line-clamp-3">{invite.email}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div>
          <Button variant="destructive" disabled={pending} onClick={handleDelete}>
            {t('delete')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
