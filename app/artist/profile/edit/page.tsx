import { getCurrentArtist } from '@/lib/artist/queries';
import { ArtistProfileForm } from './artist-profile-form';
import { ArtistProfileFormValues } from '@/lib/artist/types';
import { getTranslations } from 'next-intl/server';
import { ArtistTitle, Country } from '@prisma/client';

export default async function ChangeProfileArtistPage() {
  const artist = await getCurrentArtist();
  const tIndustry = await getTranslations('Enum.Industry');

  const defaultValues: ArtistProfileFormValues = {
    personal: {
      firstName: artist.firstName ?? '',
      lastName: artist.lastName ?? '',
      phone: artist.phone ?? '',
      countryCitizenship: artist.countryCitizenship ?? Country.None,
      countryResidence: artist.countryResidence ?? Country.None,
      birthDay: artist.birthDay ?? new Date(),
    },
    professional: {
      languages: artist.languages.map((lang) => ({ value: lang })) ?? [],
      industry: artist.industry.map((val) => ({ value: val, label: tIndustry(val) })) ?? [],
      title: artist.title ?? ArtistTitle.Artist,
      theme: artist.theme.map((val) => ({ value: val })) ?? [],
    },
    profile: {
      statement: artist.statement ?? '',
      bio: artist.bio ?? '',
      links: artist.links.map((val) => ({ value: val })) ?? [],
      artistName: artist.artistName ?? '',
    },
  };

  return (
    <div className="flex md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)]">
      <ArtistProfileForm defaultValues={defaultValues} />
    </div>
  );
}
