import { getMyOpportunity } from '@/lib/opportunity/queries';
import { ArtistsQuerySearchParams, getArtists } from '@/lib/artist/queries';
import { getProviderOpportunityInvites } from '@/lib/opportunity/invite/queries';
import OpportunityInviteForm from './opportunity-invite-form';
import { decodeURIArrayParam } from '@/lib/utils';

export type ArtistSearchParams = {
  page?: string;
  artist?: string;
  project?: string;
  language?: string;
  theme?: string;
  industry?: string;
  'age-to'?: string;
  'age-from'?: string;
  'country-residence'?: string;
  'country-citizenship'?: string;
};

export default async function OpportunityCreateInvitesPage({
  params,
  searchParams,
}: {
  params: Promise<{ opportunityId: string }>;
  searchParams: Promise<ArtistSearchParams>;
}) {
  const { opportunityId } = await params;
  const search = await searchParams;

  const page = search.page ? Number.parseInt(search.page) : 1;
  const artistSearchRequest = {
    ...search,
    language: decodeURIArrayParam(search.language),
    theme: decodeURIArrayParam(search.theme),
    'country-citizenship': decodeURIArrayParam(search['country-citizenship']),
    'country-residence': decodeURIArrayParam(search['country-residence']),
    industry: decodeURIArrayParam(search.industry),
    'include-project': undefined, // We don't need this functionality here.
  } as ArtistsQuerySearchParams;

  const opportunity = await getMyOpportunity(parseInt(opportunityId));
  const invites = await getProviderOpportunityInvites(parseInt(opportunityId));

  const data = await getArtists(artistSearchRequest, page);

  const artists = data.filteredData.map((artist) => ({
    ...artist,
    alreadyInvited: invites.invites.some((invite) => invite.artist.id === artist.id),
  }));

  return (
    <div className="md:px-32 py-8 md:min-h-[calc(100vh-200px)]">
      <h1 className="font-bold mb-6">{opportunity.title}</h1>
      <OpportunityInviteForm
        artists={artists}
        opportunityId={opportunity.id}
        searchParams={artistSearchRequest}
        pagination={{ currentPage: page, pagesTotal: data.pagesTotal }}
      />
    </div>
  );
}
