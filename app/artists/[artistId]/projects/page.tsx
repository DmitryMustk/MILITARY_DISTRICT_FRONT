import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProjectCard from '@/components/project/project-card';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { ServerActionButton } from '@/components/common/server-action-button';
import { getAvailableProjects } from '@/lib/project/queries';
import { setProjectBanned } from '@/lib/admin/project-management';

export default async function ArtistProjectsPage({ params }: { params: Promise<{ artistId: string }> }) {
  const t = await getTranslations('Page.ArtistProjectsPage');

  const session = await auth();
  const canBan = session?.user?.role.includes(Role.ADMINISTRATOR);

  const artistId = Number.parseInt((await params).artistId);
  const projects = await getAvailableProjects(artistId);

  return (
    <div className="flex w-full justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-[590px] border-none md:border-solid m-auto">
        <CardHeader>
          <CardTitle>{t('projects')}</CardTitle>
          <CardDescription>{t('projectsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project}>
                  {canBan && (
                    <ServerActionButton
                      variant={`destructive`}
                      serverAction={setProjectBanned}
                      actionArgs={[project.id, true]}
                      refreshAfter
                      toastAfter={t(`bannedToast`)}
                    >
                      {t(`banButton`)}
                    </ServerActionButton>
                  )}
                </ProjectCard>
              ))}
            </div>
          ) : (
            <p>{t('projectsNotFound')}</p>
          )}
        </CardContent>
        <CardFooter>
          <div className="pt-4 flex gap-1 flex-wrap">
            <Button asChild>
              <Link href={session?.user?.artistId === artistId ? `/artist/profile` : `/artists/${artistId}`}>
                {t('goProfile')}
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
