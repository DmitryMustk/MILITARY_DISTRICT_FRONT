import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VerifyButton from '@/app/user/email-verification/verify-button';

export default async function EmailVerificationPage({ searchParams }: { searchParams: Promise<{ request: string }> }) {
  const t = await getTranslations('Page.EmailVerificationPage');

  const { request: requestId } = await searchParams;
  if (!requestId) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center">
          <p className="text-center text-gray-70">{t('desc')}</p>
          <VerifyButton requestId={requestId} />
        </CardContent>
      </Card>
    </div>
  );
}
