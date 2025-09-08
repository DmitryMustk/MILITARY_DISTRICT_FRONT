import { prisma } from '@/prisma/client';
import { $Enums, Artist, Project } from '@prisma/client';
import { auth } from '@/lib/auth';
import { forbidden, notFound } from 'next/navigation';

export enum ModerationEntityFilter {
  artist = 'artist',
  project = 'project',
}

export enum ModerationDateFilter {
  asc = 'asc',
  desc = 'desc',
}

export type ModerationFilter = {
  entityFilter: ModerationEntityFilter;
  dateFilter: ModerationDateFilter;
};

export type GetModerationResponse = {
  pagesTotal: number;
  artists: Artist[];
  projects: Project[];
};

export const PER_PAGE_LIMIT = 6;

export async function getFilteredModerationRequests(
  filter: ModerationFilter,
  page: number
): Promise<GetModerationResponse> {
  const session = await auth();
  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  let artists: Artist[] = [];
  let projects: Project[] = [];
  let pagesTotal = 0;

  if (filter.entityFilter === ModerationEntityFilter.artist) {
    artists = await prisma.artist.findMany({
      take: PER_PAGE_LIMIT,
      skip: (page - 1) * PER_PAGE_LIMIT,
      where: {
        moderationStatus: $Enums.ModerationStatus.OnModeration,
      },
      orderBy: { updatedAt: filter.dateFilter },
    });
    pagesTotal = await prisma.artist.count({
      where: {
        moderationStatus: $Enums.ModerationStatus.OnModeration,
      },
    });
  }

  if (filter.entityFilter === ModerationEntityFilter.project) {
    projects = await prisma.project.findMany({
      take: PER_PAGE_LIMIT,
      skip: (page - 1) * PER_PAGE_LIMIT,
      where: {
        moderationStatus: $Enums.ModerationStatus.OnModeration,
      },
      orderBy: { updatedAt: filter.dateFilter },
    });
    pagesTotal = await prisma.project.count({
      where: {
        moderationStatus: $Enums.ModerationStatus.OnModeration,
      },
    });
  }

  return { pagesTotal, artists, projects };
}

export async function getArtist(artistId: string) {
  const session = await auth();
  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  const artist = await prisma.artist.findUnique({
    where: {
      id: parseInt(artistId),
    },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      phone: true,
      languages: true,
      countryResidence: true,
      countryCitizenship: true,
      links: true,
      industry: true,
      title: true,
      theme: true,
      birthDay: true,
      artistName: true,
      statement: true,
    },
  });

  if (!artist) {
    notFound();
  }

  return artist;
}

export async function getProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    select: {
      title: true,
      description: true,
      tags: true,
      attachments: true,
      banned: true,
      reach: true,
      budget: true,
      link: true,
      posterImage: true,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}
