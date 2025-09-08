import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { prisma } from '@/prisma/client';
import { endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import {
  Country,
  Industry,
  ModerationStatus,
  OpportunityApplicationStatus,
  OpportunityType,
  OpportunityVisibility,
} from '@prisma/client';
import { getTranslations } from 'next-intl/server';

export interface ArtistDashboardStats {
  artistCount: number;
  projectsCount: number;
  openApplicationCount: number;
  submittedApplicationCount: number;
  artistsByIndustry: { id: string; value: number }[];
  artistsByCountry: { place: string; value: number }[];
  newThisMonth: number;
  newLastMonth: number;
}

interface ArtistCountryGroup {
  countryResidence: string;
  _count: { id: number };
}

export async function getArtistStatisticsForDashboard(): Promise<ArtistDashboardStats> {
  const session = await auth();
  if (!session?.user?.role.includes('ADMINISTRATOR')) {
    forbidden();
  }

  const now = new Date();
  const tIndustry = await getTranslations('Enum.Industry');
  const tCountry = await getTranslations('Enum.Country');

  const [
    artistCount,
    projectsCount,
    openApplicationCount,
    submittedApplicationCount,
    industryBreakdownRaw,
    countryBreakdownRaw,
    newThisMonth,
    newLastMonth,
  ] = await prisma.$transaction([
    prisma.artist.count({
      where: {
        user: {
          locked: false,
        },
      },
    }),
    prisma.project.count({
      where: {
        artist: {
          user: {
            locked: false,
          },
          moderationStatus: ModerationStatus.Approved,
        },
        banned: false,
        hidden: false,
        moderationStatus: ModerationStatus.Approved,
      },
    }),
    prisma.opportunityApplication.count({
      where: {
        status: {
          in: [
            OpportunityApplicationStatus.sent,
            OpportunityApplicationStatus.shortlisted,
            OpportunityApplicationStatus.viewlater,
          ],
        },
        opportunity: {
          banned: false,
          provider: {
            user: {
              locked: false,
            },
          },
        },
        applicant: {
          user: {
            locked: false,
          },
          moderationStatus: ModerationStatus.Approved,
        },
        OR: [
          {
            project: {
              moderationStatus: ModerationStatus.Approved,
              banned: false,
            },
          },
          {
            project: null,
          },
        ],
      },
    }),
    prisma.opportunityApplication.count({
      where: {
        status: {
          in: [
            OpportunityApplicationStatus.sent,
            OpportunityApplicationStatus.shortlisted,
            OpportunityApplicationStatus.rejected,
            OpportunityApplicationStatus.archived,
            OpportunityApplicationStatus.viewlater,
            OpportunityApplicationStatus.archivedByArtist,
          ],
        },
      },
    }),
    prisma.artist.findMany({
      select: {
        industry: true,
      },
      where: {
        user: {
          locked: false,
        },
        moderationStatus: ModerationStatus.Approved,
      },
    }),
    prisma.artist.groupBy({
      by: ['countryResidence'],
      _count: {
        id: true,
      },
      where: {
        user: {
          locked: false,
        },
        moderationStatus: ModerationStatus.Approved,
        countryResidence: {
          not: Country.None,
        },
      },
      having: {
        id: {
          _count: {
            gt: 0,
          },
        },
      },
      orderBy: {
        countryResidence: 'asc',
      },
    }),
    prisma.artist.count({
      where: {
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
    }),
    prisma.artist.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1)),
          lte: endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1)),
        },
      },
    }),
  ]);

  const industryBreakdown = industryBreakdownRaw
    .flatMap((artist) => artist.industry)
    .reduce((acc: Record<string, number>, industry) => {
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {});
  const artistsByIndustry = Object.entries(industryBreakdown).map(([id, value]) => ({
    id: tIndustry(id as Industry),
    value,
  }));

  const artistsByCountry = (countryBreakdownRaw as ArtistCountryGroup[]).map((item) => ({
    place: tCountry(item.countryResidence as Country),
    value: item._count.id,
  }));

  return {
    artistCount,
    projectsCount,
    openApplicationCount,
    submittedApplicationCount,
    artistsByIndustry,
    artistsByCountry,
    newThisMonth,
    newLastMonth,
  };
}

export interface ProviderDashboardStats {
  providersCount: number;
  opportunitiesCount: number;
  opportunitiesByType: { id: string; value: number }[];
  providerInvitesCount: number;
}

interface ProviderOpportunityTypeGroup {
  type: string;
  _count: { id: number };
}

export async function getProviderDashboardStats(): Promise<ProviderDashboardStats> {
  const session = await auth();
  if (!session?.user?.role.includes('ADMINISTRATOR')) {
    forbidden();
  }

  const now = new Date();

  const tOpportunityType = await getTranslations('Enum.OpportunityType');
  const [providersCount, opportunitiesCount, opportunitiesByTypeRaw, providerInvitesCount] = await prisma.$transaction([
    prisma.provider.count({
      where: {
        user: {
          locked: false,
        },
      },
    }),
    prisma.opportunity.count({
      where: {
        banned: false,
        visibility: { in: [OpportunityVisibility.invited, OpportunityVisibility.all] },
        provider: {
          user: {
            locked: false,
          },
        },
        applicationDeadline: {
          gte: startOfDay(now),
        },
      },
    }),
    prisma.opportunity.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
      where: {
        banned: false,
        visibility: { in: [OpportunityVisibility.invited, OpportunityVisibility.all] },
        provider: {
          user: {
            locked: false,
          },
        },
        applicationDeadline: {
          gte: startOfDay(now),
        },
      },
      orderBy: {
        type: 'asc',
      },
    }),
    prisma.inviteUser.count({
      where: {
        roles: {
          has: 'PROVIDER',
        },
      },
    }),
  ]);

  const opportunitiesByType = (opportunitiesByTypeRaw as ProviderOpportunityTypeGroup[]).map((item) => ({
    id: tOpportunityType(item.type as OpportunityType),
    value: item._count.id,
  }));

  return {
    providersCount,
    opportunitiesCount,
    opportunitiesByType,
    providerInvitesCount,
  };
}
