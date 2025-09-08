import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateEmailForm } from '@/app/user/account-settings/update-email/email-form';

export default async function UpdateEmailPage() {
  const t = await getTranslations('Page.UpdateEmailPage');
  const session = await auth();
  if (!session) {
    forbidden();
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">{t('updateEmail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateEmailForm />
        </CardContent>
      </Card>
    </div>
  );
}
