'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import {
  $Enums,
  Artist,
  Country,
  Industry,
  ModerationStatus,
  OpportunityApplicationStatus,
  Project,
  Role,
} from '@prisma/client';
import { forbidden, notFound } from 'next/navigation';
import { knexQuery } from '../knex/knex';
import { Knex } from 'knex';
import { calculateArtistProfileComplete } from './utils';

export type ArtistsQuerySearchParams = {
  artist?: string;
  project?: string;
  language?: $Enums.Languages[];
  theme?: string[];
  industry?: Industry[];
  'age-to'?: number;
  'age-from'?: number;
  'country-residence'?: Country[];
  'country-citizenship'?: Country[];
  'reach-to'?: number;
  'reach-from'?: number;
  budget?: number | boolean;
  'include-project'?: boolean;
};

const DEFAULT_ARTIST_LIMIT = 9;

/*
 If in ArtistsQuerySearchParams there is one of the project parameters(project, include-project, budget, reach-to, reach-from), then function returns only artists with projects that satisfy this project.
 If 'include-project' is true, then function returns projects that satisfy the filters. If 'include-project' is false, returns distinct artists who have a project that meets all filters.
 */
export async function getArtists(params: ArtistsQuerySearchParams, page: number) {
  const session = await auth();
  const isProvider = session?.user?.providerId;
  const isAdmin = session?.user?.role.includes(Role.ADMINISTRATOR);
  const joinProject =
    params['include-project'] || params['reach-from'] || params['reach-to'] || params.budget || params.project;

  const applyFilters = (builder: Knex.QueryBuilder) => {
    builder.where('users.locked', false).whereRaw("artists.moderation_status = 'Approved'");

    if (joinProject) {
      builder
        .whereRaw("projects.moderation_status = 'Approved'")
        .whereRaw('projects.hidden = false::boolean')
        .whereRaw('projects.banned = false::boolean');
    }

    if (params.artist && params.artist.length >= 3) {
      builder.whereRaw(
        "(coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(bio, '') || ' ' || statement || ' ' || coalesce(artist_name, '')) % ?",
        [params.artist]
      );
    }
    if (params.project && params.project.length >= 3) {
      builder.whereRaw('projects.hidden is false');
      builder.whereRaw(
        "(projects.title || '' || projects.description || '' || immutable_array_to_string(projects.tags)) % ?",
        [params.project]
      );
    }
    if (params.language) {
      builder.whereRaw(`languages @> (?)::"Languages"[]`, [params.language]);
    }
    if (params['reach-from']) {
      builder.whereRaw('projects.reach >= ?::integer', [params['reach-from']]);
    }
    if (params['reach-to']) {
      builder.whereRaw('projects.reach <= ?::integer', [params['reach-to']]);
    }
    if (params.budget && typeof params.budget === 'number') {
      builder.whereRaw('projects.budget <= ?::integer', [params.budget]);
    }
    if (params.theme) {
      builder.whereRaw('theme::text[] @> (?)', [params.theme]);
    }
    if (params['country-citizenship']) {
      builder.whereRaw('country_citizenship IN (SELECT unnest(?::"Country"[]))', [params['country-citizenship']]);
    }
    if (params['country-residence']) {
      builder.whereRaw('country_residence IN (SELECT unnest(?::"Country"[]))', [params['country-residence']]);
    }
    if (params['age-from']) {
      builder.whereRaw("DATE_PART('year', AGE(birth_day)) >= ?::double precision", [params['age-from']]);
    }
    if (params['age-to']) {
      builder.whereRaw("DATE_PART('year', AGE(birth_day)) <= ?::double precision", params['age-to']);
    }
    if (params.industry) {
      builder.whereRaw('industry @> (?)::"Industry"[]', [params.industry]);
    }
  };

  const applyRelevanceOrder = (builder: Knex.QueryBuilder) => {
    if (params.artist && params.artist.length >= 3) {
      const filterWords = params.artist.split(' ');

      builder.select(
        knexQuery.raw(
          `CASE WHEN coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(bio, '') || ' ' || statement || ' ' || coalesce(artist_name, '') ILIKE ANY (ARRAY[${filterWords.map(() => '?')}]) THEN 1 ELSE 0 END AS artist_rank`,
          filterWords
        )
      );

      builder.select(
        knexQuery.raw(
          "similarity(coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(bio, '') || ' ' || statement || ' ' || coalesce(artist_name, ''), ?) AS relevance_artist",
          [params.artist]
        )
      );
      builder.orderByRaw('artist_rank DESC,relevance_artist DESC');
    }
    if (!params['include-project'] && params.project && params.project.length >= 3) {
      const filterWords = params.project.split(' ');

      builder.select(
        knexQuery.raw(
          `CASE WHEN max(projects.title || '' || projects.description || '' || immutable_array_to_string(projects.tags)) ILIKE ANY (ARRAY[${filterWords.map(() => '?')}]) THEN 1 ELSE 0 END AS project_rank`,
          filterWords
        )
      );

      builder.select(
        knexQuery.raw(
          "max(similarity(projects.title || '' || projects.description || '' || immutable_array_to_string(projects.tags), ?)) as relevance_project",
          [params.project]
        )
      );
      builder.orderByRaw('project_rank DESC, relevance_project DESC');
    }
    if (params['include-project'] && params.project && params.project.length >= 3) {
      const filterWords = params.project.split(' ');

      builder.select(
        knexQuery.raw(
          `CASE WHEN (projects.title || '' || projects.description || '' || immutable_array_to_string(projects.tags)) ILIKE ANY (ARRAY[${filterWords.map(() => '?')}]) THEN 1 ELSE 0 END AS project_rank`,
          filterWords
        )
      );

      builder.select(
        knexQuery.raw(
          "(similarity(projects.title || '' || projects.description || '' || immutable_array_to_string(projects.tags), ?)) as relevance_project",
          [params.project]
        )
      );
      builder.orderByRaw('project_rank DESC, relevance_project DESC');
    }
  };

  const query = knexQuery('artists')
    .innerJoin('users', 'artists.user_id', 'users.id')
    .select('artists.id')
    .select('artists.user_id as userId')
    .select('artists.artist_name as artistName')
    .select('artists.first_name as firstName')
    .select('artists.last_name as lastName')
    .select('artists.bio')
    .select('artists.theme')
    .select('artists.statement')
    .select('artists.languages')
    .select('artists.country_residence as countryResidence')
    .select('artists.country_citizenship as countryCitizenship')
    .select('artists.created_at as createdAt')
    .select('artists.updated_at as updatedAt')
    .select('artists.title')
    .select('artists.industry')
    .select('users.email');

  if (isProvider) {
    query
      .select('artists.phone')
      .select('artists.links')
      .select('artists.active')
      .select('artists.birth_day as birthDay');
  }
  if (isAdmin) {
    query.select('artists.admin_mark as adminMark');
  }

  if (joinProject) {
    query.innerJoin('projects', 'artists.id', 'projects.artist_id');
    if (!params['include-project']) {
      query
        .distinctOn('artists.id', 'users.email')
        .orderBy('artists.id', 'users.email')
        .groupBy('artists.id', 'users.email');
    } else {
      query
        .select('projects.title')
        .select('projects.description')
        .select('projects.reach')
        .select('projects.tags')
        .select('projects.link')
        .select('projects.poster_image as posterImage')
        .select('projects.budget');
    }
  }

  applyFilters(query);
  applyRelevanceOrder(query);

  const artistsNativeQuery = query
    .offset((page - 1) * DEFAULT_ARTIST_LIMIT)
    .limit(DEFAULT_ARTIST_LIMIT)
    .toSQL()
    .toNative();

  const countQuery = knexQuery('artists').innerJoin('users', 'artists.user_id', 'users.id');

  if (joinProject) {
    countQuery.innerJoin('projects', 'artists.id', 'projects.artist_id');
  }

  applyFilters(countQuery);

  const countNativeQuery = countQuery.count({ count: '*' }).toSQL().toNative();

  return prisma.$transaction(async () => {
    const [{ count }] = await prisma.$queryRawUnsafe<
      {
        count: bigint;
      }[]
    >(countNativeQuery.sql, ...countNativeQuery.bindings);

    const data = await prisma.$queryRawUnsafe<(Artist & Project & { user: { email: string | null } })[]>(
      artistsNativeQuery.sql,
      ...artistsNativeQuery.bindings
    );

    return {
      pagesTotal: DEFAULT_ARTIST_LIMIT ? Math.ceil(Number(count) / DEFAULT_ARTIST_LIMIT) : Number(count),
      filteredData: data,
    };
  });
}

export async function getCurrentArtist(): Promise<Artist & { projects: Project[]; user: { email: string | null } }> {
  const session = await auth();
  const currentArtistId = session?.user?.artistId;
  if (!currentArtistId) {
    forbidden();
  }

  const artist = await prisma.artist.findUnique({
    where: { id: currentArtistId },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  if (!artist) {
    notFound();
  }

  return artist;
}

export async function getCurrentArtistWithApplications(): Promise<
  Artist & { projects: (Project & { hasApplications: boolean })[]; user: { email: string | null } }
> {
  const session = await auth();
  const currentArtistId = session?.user?.artistId;
  if (!currentArtistId) {
    forbidden();
  }

  const artist = await prisma.artist.findUnique({
    where: { id: currentArtistId },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  if (!artist) {
    notFound();
  }

  const projectsWithApplications = await Promise.all(
    artist.projects.map(async (project) => {
      const hasApplications =
        (await prisma.opportunityApplication.count({
          where: {
            artistId: currentArtistId,
            projectId: project.id,
            NOT: {
              status: 'rejected',
            },
          },
        })) > 0;

      return {
        ...project,
        hasApplications: hasApplications,
      };
    })
  );

  return { ...artist, projects: projectsWithApplications };
}

export async function getFullCurrentArtist() {
  const session = await auth();
  const currentArtistId = session?.user?.artistId;
  if (!currentArtistId) {
    forbidden();
  }

  return await prisma.$transaction(async () => {
    const artist = await prisma.artist.findUnique({
      where: { id: currentArtistId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!artist) {
      notFound();
    }
    const projectCount = await prisma.project.count({
      where: {
        artistId: currentArtistId,
        hidden: false,
        banned: false,
        moderationStatus: ModerationStatus.Approved,
      },
    });
    const activeApplicationCount = await prisma.opportunityApplication.count({
      where: {
        artistId: currentArtistId,
        status: {
          notIn: [
            OpportunityApplicationStatus.rejected,
            OpportunityApplicationStatus.new,
            OpportunityApplicationStatus.archived,
            OpportunityApplicationStatus.archivedByArtist,
          ],
        },
        opportunity: {
          applicationDeadline: { gte: new Date() },
          banned: false,
        },
      },
    });

    const submittedApplications = await prisma.opportunityApplication.findMany({
      where: {
        artistId: currentArtistId,
        status: { notIn: [OpportunityApplicationStatus.new, OpportunityApplicationStatus.archivedByArtist] },
      },
      select: {
        updatedAt: true,
      },
    });

    const lastOpenApplication = await prisma.opportunityApplication.aggregate({
      where: {
        artistId: currentArtistId,
        status: OpportunityApplicationStatus.sent,
        opportunity: {
          applicationDeadline: { gte: new Date() },
          banned: false,
        },
        OR: [
          {
            project: null,
          },
          {
            project: {
              banned: false,
            },
          },
        ],
      },
      _min: {
        updatedAt: true,
      },
    });

    return {
      artist: artist,
      projectCount: projectCount,
      submittedApplications: submittedApplications,
      activeApplicationCount: activeApplicationCount,
      lastOpenApplication: lastOpenApplication,
    };
  });
}

export async function getArtist(artistId: string) {
  const artist = await prisma.artist.findUnique({
    where: {
      id: parseInt(artistId),
      moderationStatus: ModerationStatus.Approved,
      user: {
        locked: false,
      },
    },
    select: {
      industry: true,
      id: true,
      artistName: true,
      firstName: true,
      lastName: true,
      bio: true,
      languages: true,
      projects: {
        where: {
          hidden: false,
          moderationStatus: $Enums.ModerationStatus.Approved,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!artist) {
    notFound();
  }

  return artist;
}

export async function getMyModerationStatus() {
  const session = await auth();
  const artistId = session?.user?.artistId;
  if (!artistId) {
    forbidden();
  }

  const artist = await prisma.artist.findUnique({
    where: {
      id: artistId,
      user: {
        locked: false,
      },
    },
    select: {
      moderationStatus: true,
    },
  });
  if (!artist) {
    notFound();
  }

  return artist.moderationStatus;
}

export async function getFullArtist(artistId: string) {
  const session = await auth();
  const isAdmin = session?.user?.role.includes(Role.ADMINISTRATOR);

  return await prisma.$transaction(async () => {
    const artist = await prisma.artist.findUnique({
      where: {
        id: parseInt(artistId),
        moderationStatus: isAdmin ? undefined : ModerationStatus.Approved,
        user: {
          locked: isAdmin ? undefined : false,
        },
      },
      select: {
        industry: true,
        id: true,
        artistName: true,
        firstName: true,
        lastName: true,
        bio: true,
        languages: true,
        moderationStatus: isAdmin,
        adminMark: isAdmin,
        createdAt: true,
        links: true,
        user: {
          select: {
            email: isAdmin,
            id: true,
            locked: isAdmin,
          },
        },
      },
    });
    if (!artist) {
      notFound();
    }

    const fullArtist = await prisma.artist.findUnique({
      where: { id: parseInt(artistId) },
    });
    const artistProfileComplete = calculateArtistProfileComplete(fullArtist!);

    const projectCount = await prisma.project.count({
      where: {
        artistId: parseInt(artistId),
        hidden: false,
        banned: false,
        moderationStatus: ModerationStatus.Approved,
      },
    });

    const activeApplicationCount = await prisma.opportunityApplication.count({
      where: {
        artistId: parseInt(artistId),
        status: {
          notIn: [
            OpportunityApplicationStatus.rejected,
            OpportunityApplicationStatus.new,
            OpportunityApplicationStatus.archived,
            OpportunityApplicationStatus.archivedByArtist,
          ],
        },
        opportunity: {
          applicationDeadline: { gte: new Date() },
          banned: false,
        },
        OR: [
          {
            project: null,
          },
          {
            project: {
              banned: false,
            },
          },
        ],
      },
    });

    const submittedApplications = await prisma.opportunityApplication.findMany({
      where: {
        artistId: parseInt(artistId),
        status: { notIn: [OpportunityApplicationStatus.new, OpportunityApplicationStatus.archivedByArtist] },
      },
      select: {
        updatedAt: true,
      },
    });

    const lastOpenApplication = isAdmin
      ? await prisma.opportunityApplication.aggregate({
          where: {
            artistId: parseInt(artistId),
            status: OpportunityApplicationStatus.sent,
            opportunity: {
              applicationDeadline: { gte: new Date() },
              banned: false,
            },
            OR: [
              {
                project: null,
              },
              {
                project: {
                  banned: false,
                },
              },
            ],
          },
          _min: {
            updatedAt: true,
          },
        })
      : undefined;

    return {
      artist: artist,
      projectCount: projectCount,
      activeApplicationCount: activeApplicationCount,
      submittedApplications: submittedApplications,
      artistProfileComplete: artistProfileComplete,
      lastOpenApplication: lastOpenApplication,
    };
  });
}
