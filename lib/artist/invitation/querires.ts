import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { forbidden, notFound } from 'next/navigation';

export async function getArtistInvite(invitationId: string) {
  const invite = await prisma.inviteArtist.findUnique({
    where: { id: invitationId },
    select: { id: true },
  });
  if (!invite) {
    notFound();
  }
  return invite;
}

export async function getArtistInviteOUauth() {
  const session = await auth();
  if (!session?.oauthExternalId) {
    forbidden();
  }
  const invite = await prisma.inviteArtist.findUnique({
    where: { oauthExternalId: session.oauthExternalId },
    select: { id: true },
  });
  if (!invite) {
    notFound();
  }
  return invite;
}
