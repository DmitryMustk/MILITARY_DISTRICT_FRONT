'use server';

import { forbidden } from 'next/navigation';
import { auth } from '../auth';
import { ArtistProfileFormValues } from './types';
import { prisma } from '@/prisma/client';
import { $Enums } from '@prisma/client';

export async function updateProfile(formData: ArtistProfileFormValues) {
  const session = await auth();
  if (!session?.user?.artistId) {
    forbidden();
  }

  await prisma.artist.update({
    where: { id: session.user.artistId },
    data: {
      bio: formData.profile.bio,
      languages: formData.professional.languages.map((lang) => lang.value),
      firstName: formData.personal.firstName,
      lastName: formData.personal.lastName,
      phone: formData.personal.phone,
      industry: formData.professional.industry.map((i) => i.value),
      links: formData.profile.links.map((val) => val.value),
      title: formData.professional.title,
      countryResidence: formData.personal.countryResidence,
      countryCitizenship: formData.personal.countryCitizenship,
      artistName: formData.profile.artistName,
      theme: formData.professional.theme.map((val) => val.value),
      statement: formData.profile.statement,
      birthDay: formData.personal.birthDay,
      moderationStatus: $Enums.ModerationStatus.Draft,
    },
  });
}

export async function updateModerationStatus(moderationStatus: $Enums.ModerationStatus) {
  const session = await auth();
  if (!session?.user?.artistId) {
    forbidden();
  }

  await prisma.artist.update({
    where: { id: session.user.artistId },
    data: {
      moderationStatus,
    },
  });
}
