'use server';

import { prisma } from '@/prisma/client';
import { auth } from '../auth';
import { forbidden, notFound } from 'next/navigation';
import {
  ArtTheme,
  Country,
  Gender,
  Industry,
  LegalStatus,
  Opportunity,
  OpportunityInviteStatus,
  OpportunityType,
  ResidencyOffering,
  Role,
} from '@prisma/client';
import { startOfDay } from 'date-fns';
import { knexQuery } from '../knex/knex';
import { Knex } from 'knex';

export type OpportunityInviteFilter = `all` | `invites` | `in-progress`;

export type OpportunityFilter = {
  keyword?: string;
  grantFrom?: number;
  grantTo?: number;
  residencyTime?: number;
  residencyOffering?: ResidencyOffering;
  awardFrom?: number;
  awardTo?: number;
  legalStatus?: LegalStatus;
  age?: number;
  gender?: Gender;
  industry?: Industry;
  countryResidence?: Country;
  countryCitizenship?: Country;
  theme?: ArtTheme;
  applicationDeadlineFrom?: Date;
  applicationDeadlineTo?: Date;
  type?: OpportunityType;
  invite?: OpportunityInviteFilter;
};

export type OpportunityWithProviderAndInvite = Opportunity & {
  organizationName: string;
  inviteStatus?: OpportunityInviteStatus;
};

const OPPORTUNITIES_PER_PAGE = 6;

export async function getFilteredOpportunities(
  filter: OpportunityFilter,
  page: number
): Promise<{ pagesTotal: number; filteredOpportunities: OpportunityWithProviderAndInvite[] }> {
  const session = await auth();
  const artistId = session?.user?.artistId;
  const isAdmin = session?.user?.role.includes(Role.ADMINISTRATOR);

  const applyFilters = (builder: Knex.QueryBuilder) => {
    if (artistId) {
      builder.leftOuterJoin('opportunity_invites', (join) =>
        join
          .on('opportunities.id', '=', 'opportunity_invites.opportunity_id')
          .andOn('opportunity_invites.artist_id', '=', knexQuery.raw('?', [artistId]))
      );
    }

    builder
      .where((builder) => {
        builder.whereRaw('"visibility" = ?::"OpportunityVisibility"', ['all']); //Use raw for searching by postgres enum
        if (isAdmin) {
          builder.orWhereRaw('"visibility" = ?::"OpportunityVisibility"', ['invited']);
        } else if (artistId) {
          builder.orWhere((builder) =>
            builder
              .whereRaw('"visibility" = ?::"OpportunityVisibility"', ['invited'])
              .whereNotNull('opportunity_invites.id')
          );
        }
      })
      .where('users.locked', false)
      .where('banned', false)
      .where('application_deadline', '>', startOfDay(new Date()));

    if (filter.keyword && filter.keyword.length >= 3) {
      builder.whereRaw("(title || ' ' || description) % ?", [filter.keyword]); // Use raw for the trigram similarity operator
    }

    if (filter.type) {
      builder.whereRaw('"type" = ?::"OpportunityType"', [filter.type]); //Use raw for searching by postgres enum
    }

    if (filter.type === `grant`) {
      if (filter.grantFrom !== undefined) {
        builder.where((builder) =>
          builder.whereNull('max_grant_amount').orWhere('max_grant_amount', '>=', filter.grantFrom!)
        );
      }

      if (filter.grantTo !== undefined) {
        builder.where((builder) =>
          builder.whereNull('min_grant_amount').orWhere('min_grant_amount', '<=', filter.grantTo!)
        );
      }
    } else if (filter.type === `residency`) {
      if (filter.residencyTime !== undefined) {
        builder
          .whereNotNull('min_residency_time')
          .whereNotNull('max_residency_time')
          .where('min_residency_time', '<=', filter.residencyTime)
          .where('max_residency_time', '>=', filter.residencyTime);
      }

      if (filter.residencyOffering !== undefined) {
        builder.whereRaw('?::"ResidencyOffering" = ANY (residency_offering)', [filter.residencyOffering]);
      }
    } else if (filter.type === `award`) {
      if (filter.awardFrom !== undefined) {
        builder.where((builder) =>
          builder.whereNull('max_award_amount').orWhere('max_award_amount', '>=', filter.awardFrom!)
        );
      }

      if (filter.awardTo !== undefined) {
        builder.where((builder) =>
          builder.whereNull('min_award_amount').orWhere('min_award_amount', '<=', filter.awardTo!)
        );
      }
    }

    if (filter.legalStatus) {
      builder.where((builder) =>
        builder
          .whereRaw('array_length(legal_status, 1) IS NULL')
          .orWhereRaw('?::"LegalStatus" = ANY (legal_status)', [filter.legalStatus])
      );
    }

    if (filter.age !== undefined) {
      builder.where((builder) => builder.whereNull('min_age').orWhere('min_age', '<=', filter.age!));
      builder.where((builder) => builder.whereNull('max_age').orWhere('max_age', '>=', filter.age!));
    }

    if (filter.gender) {
      builder.where((builder) =>
        builder.whereRaw('array_length(gender, 1) IS NULL').orWhereRaw('?::"Gender" = ANY (gender)', [filter.gender])
      );
    }

    if (filter.industry) {
      builder.where((builder) =>
        builder
          .whereRaw('array_length(industry, 1) IS NULL')
          .orWhereRaw('?::"Industry" = ANY (industry)', [filter.industry])
      );
    }

    if (filter.countryResidence) {
      builder.where((builder) =>
        builder
          .whereRaw('array_length(country_residence, 1) IS NULL')
          .orWhereRaw('?::"Country" = ANY (country_residence)', [filter.countryResidence])
      );
    }

    if (filter.countryCitizenship) {
      builder.where((builder) =>
        builder
          .whereRaw('array_length(country_citizenship, 1) IS NULL')
          .orWhereRaw('?::"Country" = ANY (country_citizenship)', [filter.countryCitizenship])
      );
    }

    if (filter.theme) {
      builder.where((builder) =>
        builder.whereRaw('array_length(theme, 1) IS NULL').orWhereRaw('?::"ArtTheme" = ANY (theme)', [filter.theme])
      );
    }

    if (filter.applicationDeadlineFrom) {
      builder.where('application_deadline', '>=', filter.applicationDeadlineFrom);
    }

    if (filter.applicationDeadlineTo) {
      builder.where('application_deadline', '<=', filter.applicationDeadlineTo);
    }

    if (artistId) {
      if (filter.invite === `invites`) {
        builder.where((builder) =>
          builder
            .whereRaw('"opportunity_invites"."status" = ?::"OpportunityInviteStatus"', ['pending'])
            .orWhereRaw('"opportunity_invites"."status" = ?::"OpportunityInviteStatus"', ['accepted'])
        );
      } else if (filter.invite === `in-progress`) {
        builder.whereRaw('"opportunity_invites"."status" = ?::"OpportunityInviteStatus"', ['accepted']);
      }
    }
  };

  const applyRelevanceOrder = (builder: Knex.QueryBuilder) => {
    if (filter.keyword && filter.keyword.length >= 3) {
      const filterWords = filter.keyword.split(' ');

      //Ensure records conaining full keywords have higher rank
      builder.select(
        knexQuery.raw(
          `CASE WHEN title || ' ' || description ILIKE ANY (ARRAY[${filterWords.map(() => '?')}]) THEN 1 ELSE 0 END AS match_rank`,
          filterWords.map((w) => `%${w}%`)
        )
      );
      builder.select(
        knexQuery.raw("similarity(title || ' ' || description, ?) AS relevance_keyword", [filter.keyword])
      ); // Use raw for similarity
      builder.orderByRaw('match_rank DESC,relevance_keyword DESC'); //as relevance_keyword is pseudo column
    }

    if (filter.type === `grant`) {
      if (filter.grantFrom || filter.grantTo) {
        builder.select(
          knexQuery.raw(
            '(CASE WHEN min_grant_amount IS NULL AND max_grant_amount IS NULL THEN 0 ELSE 1 END) AS relevance_grant_amount'
          )
        );
        builder.orderByRaw('relevance_grant_amount DESC'); //as relevance_grant_amount is pseudo column
      }
    } else if (filter.type === `award`) {
      if (filter.awardFrom || filter.awardTo) {
        builder.select(
          knexQuery.raw(
            '(CASE WHEN min_award_amount IS NULL AND max_award_amount IS NULL THEN 0 ELSE 1 END) AS relevance_award_amount'
          )
        );
        builder.orderByRaw('relevance_award_amount DESC'); //as relevance_award_amount is pseudo column
      }
    }

    if (filter.legalStatus) {
      builder.select(knexQuery.raw('(CASE WHEN legal_status IS NULL THEN 0 ELSE 1 END) AS relevance_legal_status'));
      builder.orderByRaw('relevance_legal_status DESC');
    }

    if (filter.age) {
      builder.select(
        knexQuery.raw('(CASE WHEN min_age IS NULL AND max_age IS NULL THEN 0 ELSE 1 END) AS relevance_age')
      );
      builder.orderByRaw('relevance_age DESC');
    }

    if (filter.gender) {
      builder.select(knexQuery.raw('(CASE WHEN gender IS NULL THEN 0 ELSE 1 END) AS relevance_gender'));
      builder.orderByRaw('relevance_gender DESC');
    }

    if (filter.industry) {
      builder.select(knexQuery.raw('(CASE WHEN industry IS NULL THEN 0 ELSE 1 END) AS relevance_industry'));
      builder.orderByRaw('relevance_industry DESC');
    }

    if (filter.countryResidence) {
      builder.select(
        knexQuery.raw('(CASE WHEN country_residence IS NULL THEN 0 ELSE 1 END) AS relevance_country_residence')
      );
      builder.orderByRaw('relevance_country_residence DESC');
    }

    if (filter.countryCitizenship) {
      builder.select(
        knexQuery.raw('(CASE WHEN country_citizenship IS NULL THEN 0 ELSE 1 END) AS relevance_country_citizenship')
      );
      builder.orderByRaw('relevance_country_citizenship DESC');
    }

    if (filter.theme) {
      builder.select(knexQuery.raw('(CASE WHEN theme IS NULL THEN 0 ELSE 1 END) AS relevance_theme'));
      builder.orderByRaw('relevance_theme DESC');
    }

    builder.orderBy('id', 'desc');
  };

  const opportunitiesQuery = knexQuery('opportunities')
    .join('providers', 'opportunities.provider_id', 'providers.id')
    .join('users', 'providers.user_id', 'users.id')
    .select('opportunities.id')
    .select('opportunities.title')
    .select('opportunities.provider_id as providerId')
    .select('opportunities.type')
    .select('opportunities.max_grant_amount as maxGrantAmount')
    .select('opportunities.min_grant_amount as minGrantAmount')
    .select('opportunities.max_residency_time as maxResidencyTime')
    .select('opportunities.min_residency_time as minResidencyTime')
    .select(knexQuery.raw(`coalesce("opportunities"."residency_offering", '{}') as "residencyOffering"`))
    .select('opportunities.residency_offering_description as residencyOfferingDescription')
    .select('opportunities.max_award_amount as maxAwardAmount')
    .select('opportunities.min_award_amount as minAwardAmount')
    .select('opportunities.award_special_access as awardSpecialAccess')
    .select('opportunities.description')
    .select(knexQuery.raw(`coalesce("opportunities"."legal_status", '{}') as "legalStatus"`))
    .select('opportunities.max_age as maxAge')
    .select('opportunities.min_age as minAge')
    .select(knexQuery.raw(`coalesce("opportunities"."gender", '{}') as "gender"`))
    .select(knexQuery.raw(`coalesce("opportunities"."industry", '{}') as "industry"`))
    .select(knexQuery.raw(`coalesce("opportunities"."country_residence", '{}') as "countryResidence"`))
    .select(knexQuery.raw(`coalesce("opportunities"."country_citizenship", '{}') as "countryCitizenship"`))
    .select('opportunities.location_description as locationDescription')
    .select(knexQuery.raw(`coalesce("opportunities"."theme", '{}') as "theme"`))
    .select('opportunities.theme_description as themeDescription')
    .select('opportunities.visibility')
    .select('opportunities.attachments')
    .select('opportunities.application_deadline as applicationDeadline')
    .select('opportunities.response_deadline as responseDeadline')
    .select('providers.organization_name as organizationName');

  if (artistId) {
    opportunitiesQuery.select('opportunity_invites.status as inviteStatus');
  }

  applyFilters(opportunitiesQuery);
  applyRelevanceOrder(opportunitiesQuery);

  const opportunitiesNativeQuery = opportunitiesQuery
    .offset((page - 1) * OPPORTUNITIES_PER_PAGE)
    .limit(OPPORTUNITIES_PER_PAGE)
    .toSQL() //sql contains ? as binding placeholders
    .toNative(); //now it contains $1, $2, $3 etc, as required by prisma's queryRawUnsafe (because it is native postgres syntax)

  const countQuery = knexQuery('opportunities')
    .join('providers', 'opportunities.provider_id', 'providers.id')
    .join('users', 'providers.user_id', 'users.id')
    .count({ count: '*' });

  applyFilters(countQuery);

  const countNativeQuery = countQuery.toSQL().toNative();

  return prisma.$transaction(async () => {
    const [{ count }] = await prisma.$queryRawUnsafe<
      {
        count: bigint;
      }[]
    >(countNativeQuery.sql, ...countNativeQuery.bindings);

    const opportunities = await prisma.$queryRawUnsafe<OpportunityWithProviderAndInvite[]>(
      opportunitiesNativeQuery.sql,
      ...opportunitiesNativeQuery.bindings
    );

    return { pagesTotal: Math.ceil(Number(count) / OPPORTUNITIES_PER_PAGE), filteredOpportunities: opportunities };
  });
}

export async function getMyOpportunities() {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  return prisma.opportunity.findMany({
    where: {
      providerId: session.user.providerId,
    },
    orderBy: {
      id: 'desc',
    },
  });
}

export async function getAvailableOpportunity(opportunityId: number) {
  const session = await auth();
  const artistId = session?.user?.artistId;

  const ret = await prisma.opportunity.findUnique({
    where: {
      id: opportunityId,
      provider: {
        user: {
          locked: false,
        },
      },
      OR: [
        {
          visibility: 'all',
        },
        artistId !== undefined
          ? {
              visibility: 'invited',
              invites: {
                some: {
                  artistId,
                },
              },
            }
          : {},
      ],
    },
  });

  if (!ret) {
    notFound();
  }

  return ret;
}

export async function getMyOpportunity(opportunityId: number) {
  const session = await auth();

  if (!session?.user?.providerId) {
    forbidden();
  }

  const ret = await prisma.opportunity.findUnique({
    where: {
      providerId: session.user.providerId,
      id: opportunityId,
    },
  });

  if (!ret) {
    notFound();
  }

  return { ...ret };
}

export async function getMyBlockedArtists() {
  const providerId = (await auth())?.user?.providerId;

  if (!providerId) {
    forbidden();
  }

  return (
    (
      await prisma.provider.findUnique({
        where: { id: providerId },
        select: {
          blockedArtists: true,
        },
      })
    )?.blockedArtists || []
  );
}
