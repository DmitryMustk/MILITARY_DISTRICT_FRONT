import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/app/user/reset-password/reset-password-form';
import { getPasswordResetRequest } from '@/lib/user/credentials-reset';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ request: string }> }) {
  const { request: requestId } = await searchParams;
  if (!requestId) {
    notFound();
  }

  const request = await getPasswordResetRequest(requestId);
  if (!request) {
    notFound();
  }

  const t = await getTranslations('Page.ResetPasswordPage');
  return (
    <div>
      <h1 className="font-bold mb-6">{t(`title`)}</h1>
      <ResetPasswordForm requestId={requestId} />
    </div>
  );
}
