import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';

export default async function AccountSettingsPage() {
  const t = await getTranslations('Page.AccountSettingsPage');

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="font-semibold text-center mb-4">{t('header')}</h1>
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full flex items-center gap-2">
            <Link href={'account-settings/update-email'}>
              <Mail size={18} />
              {t('updateEmail')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full flex items-center gap-2">
            <Link href={'account-settings/update-password'}>
              <Lock size={18} />
              {t('updatePassword')}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
