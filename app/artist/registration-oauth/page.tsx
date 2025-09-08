import { forbidden, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getArtistInviteOUauth } from '@/lib/artist/invitation/querires';
import dynamic from 'next/dynamic';

const ArtistRegistrationOAuthForm = dynamic(
  () => import('./registration-oauth-form').then((mod) => mod.ArtistRegistrationOAuthForm),
  {
    ssr: !!false,
  }
);

export default async function RegisterArtistPage() {
  const session = await auth();
  if (!session) {
    forbidden();
  }
  if (session?.user) {
    // After OAuth sign in user will be redirected on this page. If user already registered fully, then redirect to home page.
    redirect('/');
  }

  getArtistInviteOUauth(); // Check for existing invite.

  const currentVersion = process.env.ARTIST_REGISTRATION_OAUTH_FORM_VERSION;
  if (!currentVersion) {
    throw Error('Failed to read version. Version not recorded. Contact with support.');
  }

  return (
    <div className="flex flex-col gap-4">
      <ArtistRegistrationOAuthForm currentVersion={currentVersion} />
    </div>
  );
}
