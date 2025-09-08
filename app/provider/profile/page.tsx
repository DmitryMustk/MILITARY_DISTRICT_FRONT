import { getTranslations } from 'next-intl/server';
import { getMyProfile } from '@/lib/provider/profile';
import ProviderProfileForm from '@/app/provider/profile/provider-profile-form';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default async function ProviderProfilePage() {
  const profile = await getMyProfile();
  const t = await getTranslations('Page.ProviderProfilePage');

  return (
    <Card>
      <CardHeader>
        <h1 className="font-bold mb-6 flex justify-center">{t('myProfile')}</h1>
      </CardHeader>
      <CardContent>
        <ProviderProfileForm
          defaultValues={{ ...profile, website: profile.website === null ? undefined : profile.website }}
        />
      </CardContent>
    </Card>
  );
}
