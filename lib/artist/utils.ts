import { Artist } from '@prisma/client';

export const calculateArtistProfileComplete = (artist: Artist) => {
  const fieldNames = [
    'firstName',
    'lastName',
    'phone',
    'countryResidence',
    'countryCitizenship',
    'birthDay',
    'artistName',
    'theme',
    'languages',
    'industry',
    'title',
    'bio',
    'statement',
    'links',
  ];
  const completedFields = Object.entries(artist).filter(([key, val]) => {
    if (!fieldNames.includes(key)) {
      return false;
    }
    if (!val) {
      return false;
    }
    if (Array.isArray(val) && val.length === 0) {
      return false;
    }
    return true;
  });

  const toPercent = 100;
  return Math.floor((completedFields.length / fieldNames.length) * toPercent);
};

export const artistName = (
  artist: { firstName?: string | null; lastName?: string | null; artistName?: string | null },
  alternativeName: string
) => {
  if (artist.artistName) {
    return artist.artistName;
  }
  if (artist.firstName || artist.lastName) {
    return `${artist.firstName ?? ''} ${artist.lastName ?? ''}`;
  }
  return alternativeName;
};
