import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdatePasswordForm } from '@/app/user/account-settings/update-password/password-form';

export default async function UpdatePasswordPage() {
  const t = await getTranslations('Page.UpdatePasswordPage');
  const session = await auth();
  if (!session?.user || session.user.oauthExternalId) {
    forbidden();
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">{t('updatePassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
