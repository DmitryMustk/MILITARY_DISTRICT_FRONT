import { forbidden, notFound } from 'next/navigation';
import { auth } from '../auth';
import { prisma } from '@/prisma/client';
import { $Enums, Country, OpportunityApplication, OpportunityApplicationStatus } from '@prisma/client';
import { knexQuery } from '../knex/knex';

//for artists:

export async function getMyApplications(
  opportunityId: number | undefined,
  projectId: number | undefined | null,
  status: OpportunityApplicationStatus | undefined
) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }

  return prisma.opportunityApplication.findMany({
    where: {
      artistId: session.user.artistId,
      opportunityId,
      projectId,
      status,
      NOT: status ? undefined : { status: 'rejected' },
      opportunity: {
        NOT: { banned: true },
        provider: {
          user: {
            locked: false,
          },
        },
      },
    },
    include: {
      opportunity: {},
      project: {
        select: {
          banned: true,
          moderationStatus: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });
}

export async function getMyApplication(applicationId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }

  return prisma.opportunityApplication
    .findUnique({
      where: { artistId: session.user.artistId, id: applicationId },
      include: {
        opportunity: {},
      },
    })
    .then((op) => {
      if (op) {
        return op;
      } else {
        notFound();
      }
    });
}

//for providers

export type OpportunityApplicationQuerySearchParams = {
  opportunities?: number[];
  applicationStatus?: Exclude<OpportunityApplicationStatus, 'new'>[];
  applicationMessage?: string;
  projectDescription?: string;
  applicantName?: string;
  showBlock?: boolean;
};

export type ApplicationWithDetails = OpportunityApplication & {
  projectTitle?: string;
  projectDescription?: string;
  projectReach?: number;
  applicantFirstName?: string;
  applicantLastName?: string;
  applicantPhone?: string;
  applicantCountryResidence?: Country;
  applicantLinks?: string[];
  applicantEmail?: string;
  banned?: string;
};

export async function getProviderApplications(
  filter: OpportunityApplicationQuerySearchParams
): Promise<{ blockedArtists: number[]; applications: ApplicationWithDetails[] }> {
  const session = await auth();
  if (!session?.user?.providerId) {
    forbidden();
  }
  const providerId = session.user.providerId;
  const orderBy = [];

  const query = knexQuery('opportunity_applications')
    .select('opportunity_applications.id as id')
    .select('opportunity_applications.status as status')
    .select('opportunity_applications.attachments as attachments')
    .select('opportunity_applications.artist_id as artistId')
    .select('opportunity_applications.message as message')
    .select('opportunities.banned as banned')
    .leftJoin('projects', 'opportunity_applications.project_id', 'projects.id')
    .select('projects.title as projectTitle')
    .select('projects.description as projectDescription')
    .select('projects.reach as projectReach')
    .join('opportunities', 'opportunity_applications.opportunity_id', 'opportunities.id')
    .join('artists', 'opportunity_applications.artist_id', 'artists.id')
    .select('artists.first_name as applicantFirstName')
    .select('artists.last_name as applicantLastName')
    .select('artists.phone as applicantPhone')
    .select('artists.country_residence as applicantCountryResidence')
    .select('artists.links as applicantLinks')
    .join('users', 'artists.user_id', 'users.id')
    .select('users.email as applicantEmail');

  if (filter.opportunities) {
    query.whereIn('opportunity_applications.opportunity_id', filter.opportunities);
  }

  if (filter.applicationStatus) {
    query.whereRaw(`status::text in (${filter.applicationStatus.map((st) => `'${st}'`).join(',')})`);
    query.whereRaw(`status::text not in ('new','archivedByArtist')`);
  } else {
    query.whereRaw("status::text not in ('new','archived', 'rejected', 'archivedByArtist')");
  }

  if (filter.applicantName) {
    query
      .select(
        knexQuery.raw(
          "similarity(btrim(coalesce(artists.first_name, '') || ' ' || coalesce(artists.last_name, '')), ?) AS applicantNameRelevance",
          [filter.applicantName]
        )
      )
      .whereRaw("btrim(coalesce(artists.first_name, '') || ' ' || coalesce(artists.last_name, '')) % ?", [
        filter.applicantName,
      ]);
    orderBy.push('applicantNameRelevance DESC');
  }

  if (filter.applicationMessage) {
    query
      .select(
        knexQuery.raw('similarity(btrim(message), ?) AS applicationMessageRelevance', [filter.applicationMessage])
      )
      .whereRaw('btrim(message) % ?', [filter.applicationMessage]);
    orderBy.push('applicationMessageRelevance DESC');
  }

  if (filter.projectDescription) {
    query
      .select(
        knexQuery.raw('similarity(btrim(projects.description), ?) AS projectDescriptionRelevance', [
          filter.projectDescription,
        ])
      )
      .whereRaw('btrim(projects.description) % ?', [filter.projectDescription])
      .whereNot('projects.banned', '=', true)
      .whereRaw('projects.moderation_status = ?::"ModerationStatus"', ['Approved']);
    orderBy.push('projectDescriptionRelevance DESC');
  } else {
    query.where(function () {
      this.whereRaw('projects.moderation_status = ?::"ModerationStatus"', ['Approved']).orWhere(
        'opportunity_applications.project_id',
        'is',
        null
      );
    });
  }
  query.where(function () {
    this.whereNot('projects.banned', '=', true).orWhere('opportunity_applications.project_id', 'is', null);
  });

  if (providerId) {
    query.where('opportunities.provider_id', '=', providerId);
  }

  const blockedArtists = (
    await prisma.provider.findUnique({
      where: { id: providerId },
      select: {
        blockedArtists: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    })
  )?.blockedArtists.map((o) => o.id);

  if (!filter.showBlock && blockedArtists) {
    query.whereNotIn('artists.id', blockedArtists);
  }

  query.whereRaw('artists.moderation_status = ?::"ModerationStatus"', ['Approved']);
  query.where('users.locked', '=', false);

  orderBy.push('id DESC');
  query.orderByRaw(orderBy.join(','));

  const nativeQuery = query.toSQL().toNative();
  const applications = await prisma.$queryRawUnsafe<ApplicationWithDetails[]>(nativeQuery.sql, ...nativeQuery.bindings);
  applications.sort((a, b) => {
    const aShortlisted = a.status === 'shortlisted';
    const bShortlisted = b.status === 'shortlisted';
    if (aShortlisted && !bShortlisted) return -1;
    if (!aShortlisted && bShortlisted) return 1;
    if (filter.applicantName) {
      const aFullName = (a.applicantFirstName + ' ' + a.applicantLastName).toLowerCase();
      const bFullName = (b.applicantFirstName + ' ' + b.applicantLastName).toLowerCase();
      const aMatches = aFullName.includes(filter.applicantName!.toLowerCase());
      const bMatches = bFullName.includes(filter.applicantName!.toLowerCase());
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }
    return 0;
  });
  return { blockedArtists: blockedArtists || [], applications };
}

// returns projects without applications within a given opportunity
export async function getProjectsWithoutApplications(opportunityId: number) {
  const session = await auth();

  if (!session?.user?.artistId) {
    forbidden();
  }

  return prisma.project.findMany({
    where: {
      artistId: session.user.artistId,
      hidden: false,
      banned: false,
      moderationStatus: $Enums.ModerationStatus.Approved,
      applications: {
        every: {
          NOT: {
            opportunityId: opportunityId,
            status: {
              notIn: [OpportunityApplicationStatus.rejected],
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      banned: true,
      moderationStatus: true,
    },
  });
}
