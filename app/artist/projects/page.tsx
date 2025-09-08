import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentArtistWithApplications } from '@/lib/artist/queries';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import ArtistProjectCard from '@/components/artist/artist-project-card';

export default async function MyArtistProjectsPage() {
  const artist = await getCurrentArtistWithApplications();
  const t = await getTranslations('Page.MyArtistProjectsPage');

  return (
    <div className="flex w-full justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-[590px] border-none md:border-solid flex flex-col items-center m-auto">
        <CardHeader>
          <CardTitle>{t('projects')}</CardTitle>
          <CardDescription>{t('projectsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {artist.projects.length > 0 ? (
            <div className="space-y-4">
              {artist.projects.map((project) => (
                <ArtistProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p>{t('projectsNotFound')}</p>
          )}
        </CardContent>
        <CardFooter>
          <div className="pt-4 flex gap-1 flex-wrap">
            <Button asChild>
              <Link href={`/artist/profile`}>{t('goProfile')}</Link>
            </Button>
            <Button asChild>
              <Link href={`/artist/projects/create`}>{t('addProject')}</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
