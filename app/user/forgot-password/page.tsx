import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/app/user/forgot-password/forgot-password-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const t = await getTranslations('Page.ForgotPasswordPage');

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-70 mb-6 text-center">{t('description')}</p>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
