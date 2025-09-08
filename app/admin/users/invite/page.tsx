import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import ProviderInvitationResendButton from './manage-invitation/resend-button';
import ProviderInvitationRevokeButton from './manage-invitation/revoke-button';
import UserInvitationDialog from './create-invitation/invitation-dialog';
import { getAllProviderInvites } from '@/lib/admin/provider-invitation';
import { getRoleLabel } from '@/lib/admin/utils';

export default async function ProviderInvitationsPage() {
  const t = await getTranslations('Page.ProviderInvitationsPage');

  const invites = await getAllProviderInvites();

  return (
    <div className="space-y-8">
      <h1 className="font-bold">{t(`header`)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invites.map((invite) => (
          <Card key={invite.id}>
            <CardHeader>
              <CardTitle>{invite.organizationName}</CardTitle>
              <CardDescription>{invite.email}</CardDescription>
              <p className="text-sm text-muted-foreground">
                {invite.roles.map((role) => getRoleLabel(role)).join(', ')}
              </p>
            </CardHeader>
            <CardFooter>
              <div className="pt-4 flex justify-between items-center gap-3">
                <ProviderInvitationResendButton invitationId={invite.id} />
                <ProviderInvitationRevokeButton invitationId={invite.id} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <UserInvitationDialog />
    </div>
  );
}
