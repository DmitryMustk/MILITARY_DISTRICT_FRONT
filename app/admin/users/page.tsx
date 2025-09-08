import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { getUsersForManagement } from '@/lib/admin/user-managements';
import { SearchPagination } from '@/components/common/search-pagination';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LockUnlockButton from './lock-unlock-button';
import { UserSearchForm } from './user-search-form';
import { decodeURIArrayParam } from '@/lib/utils';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type UsersSearchParams = {
  page?: string;
  email?: string;
  username?: string;
  roles?: string;
  locked?: string;
};

export default async function UsersManagementPage({ searchParams }: { searchParams: Promise<UsersSearchParams> }) {
  const t = await getTranslations('Page.UsersManagementPage');
  const session = await auth();
  const currentUserId = session?.user?.id;

  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) - 1 : 0;

  const locked = params.locked ? params.locked === 'true' : undefined;

  const roles = decodeURIArrayParam(params.roles);

  const [pagesTotal, users] = await getUsersForManagement(page, {
    email: params.email,
    username: params.username,
    roles: roles ? roles.map((r) => r as Role) : undefined,
    locked,
  });

  return (
    <div className="space-y-8 mb-8 md:px-32">
      <h1 className="font-bold">{t(`header`)}</h1>
      <UserSearchForm />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{user.username}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex flex-wrap gap-3">
                <Badge variant={user.locked ? 'destructive' : 'secondary'}>
                  {user.locked ? t('locked') : t('active')}
                </Badge>
                {user.role.map((r) => {
                  return (
                    <Badge key={r} variant={'default'}>
                      {r.replace('_', ' ')}
                    </Badge>
                  );
                })}
              </div>
              {!!user.artist?.adminMark && (
                <div>
                  <Badge variant="secondary">{user.artist.adminMark}</Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <div className="pt-4 flex justify-end items-center gap-3 w-full">
                {(user.role.includes('ARTIST') || user.role.includes('PROVIDER')) && (
                  <Button asChild variant={'outline'}>
                    <Link href={`/admin/users/${user.id}`}>{t('details')}</Link>
                  </Button>
                )}
                {user.id != currentUserId && <LockUnlockButton userId={user.id} isLocked={user.locked} />}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <SearchPagination currentPage={page + 1} pagesTotal={pagesTotal} />
    </div>
  );
}
