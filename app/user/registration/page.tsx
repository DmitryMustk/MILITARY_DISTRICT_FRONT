import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';
import { getUserInvite } from '@/lib/provider/registration';
import { getTranslations } from 'next-intl/server';
import ProviderRegistrationForm from '@/app/user/registration/provider-registration-form';
import UserRegistrationForm from '@/app/user/registration/user-registration-form';

export default async function UserRegistrationPage({ searchParams }: { searchParams: Promise<{ invite: string }> }) {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const { invite: inviteId } = await searchParams;
  if (!inviteId) {
    notFound();
  }

  const invite = await getUserInvite(inviteId);
  if (!invite) {
    notFound();
  }

  const t = await getTranslations('Page.UserRegistrationPage');
  const isProvider = invite.roles.includes('PROVIDER');

  return (
    <div className="flex flex-col justify-center py-10 min-h-[calc(100vh-200px)]">
      <h1 className="text-center font-bold mb-6">{t(`completeRegistration`)}</h1>
      {isProvider ? (
        <ProviderRegistrationForm inviteId={inviteId} initialOrganizationName={invite.organizationName} />
      ) : (
        <UserRegistrationForm inviteId={inviteId} />
      )}
    </div>
  );
}
