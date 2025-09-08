import { SearchPagination, SearchPaginationSearchParams } from '@/components/common/search-pagination';
import { getTranslations } from 'next-intl/server';
import ProjectCard from '@/components/project/project-card';
import { ServerActionButton } from '@/components/common/server-action-button';

import { getBannedProjectsPage, setProjectBanned } from '@/lib/admin/project-management';

const PROJECTS_PER_PAGE = 6;

export default async function BannedProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchPaginationSearchParams>;
}) {
  const t = await getTranslations('Page.BannedProjectsPage');

  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;

  const [projects, count] = await getBannedProjectsPage(page, PROJECTS_PER_PAGE);

  return (
    <div>
      <h1 className="font-bold mb-6">{t('header')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project}>
            <ServerActionButton serverAction={setProjectBanned} actionArgs={[project.id, false]} refreshAfter>
              {t(`restore`)}
            </ServerActionButton>
          </ProjectCard>
        ))}
      </div>
      <SearchPagination currentPage={page} pagesTotal={Math.ceil(count / PROJECTS_PER_PAGE)} />
    </div>
  );
}
