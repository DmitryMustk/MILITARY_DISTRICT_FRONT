import { forbidden, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import dynamic from 'next/dynamic';
import { getArtistInvite } from '@/lib/artist/invitation/querires';
// @ts-expect-error ?url param is correct
import RegistrationBackground from '@/public/images/registration-background.svg?url';

const ArtistRegistrationForm = dynamic(() => import('./registration-form').then((mod) => mod.ArtistRegistrationForm), {
  ssr: !!false,
});

export default async function RegisterArtistPage({ searchParams }: { searchParams: Promise<{ invite: string }> }) {
  const session = await auth();
  if (session) {
    forbidden();
  }

  const { invite } = await searchParams;
  if (!invite) {
    notFound();
  }
  await getArtistInvite(invite);

  const currentVersion = process.env.ARTIST_REGISTRATION_FORM_VERSION;
  if (!currentVersion) {
    throw Error('Failed to read version. Version not recorded. Contact with support.');
  }

  return (
    <div
      className="main-no-padding flex bg-cover bg-center md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)] max-md:!bg-none"
      style={{ backgroundImage: `url(${RegistrationBackground})` }}
    >
      <ArtistRegistrationForm invitationId={invite} currentVersion={currentVersion} />
    </div>
  );
}
