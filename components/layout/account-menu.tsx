'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import React, { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import User from '@/public/images/user.svg';

interface AccountMenuProps {
  session: Session | null;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ session }) => {
  const handleSignOut = useCallback(async () => signOut({ callbackUrl: '/' }), []);
  const t = useTranslations('Component.AccountMenu');

  if (!session) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button variant="outline" asChild>
              <NavigationMenuLink className="normal-case" href="/auth/signin">
                {t('signIn')}
              </NavigationMenuLink>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar>
          <AvatarFallback className="bg-primary-foreground text-primary border border-primary">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!session.user && session.oauthExternalId && (
          <>
            <DropdownMenuItem asChild>
              <Link href={'/artist/registration-oauth'}>{t('registration')}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.artistId && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/artist/projects`}>{t('projects')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/artist/profile`}>{t('editProfile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={'/artist/applications'}>{t('applications')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={'/artist/invites'}>{t('invites')}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.providerId && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/provider/opportunities`}>{t('myOpportunities')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/provider/profile`}>{t('editProfile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/provider/applications`}>{t('applications')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/provider/banned-artists`}>{t('bannedArtists')}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.role.includes(`ADMINISTRATOR`) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard`}>{t(`dashboard`)}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/invite`}>{t(`manageInvitations`)}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users`}>{t(`manageUsers`)}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/banned-opportunities`}>{t(`bannedOpportunities`)}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/banned-projects`}>{t(`bannedProjects`)}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.role.includes(`CONTENT_MANAGER`) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/content/news`}>{t(`manageNews`)}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.role.includes(`CONTENT_MANAGER`) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/content/guides`}>{t(`manageGuides`)}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user?.role.includes('CONTENT_MANAGER') && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/content/static-page`}>{t('managePages')}</Link>
            </DropdownMenuItem>
          </>
        )}
        {session.user && !session.user.oauthExternalId && (
          <DropdownMenuItem asChild>
            <Link href={`/user/account-settings`}>{t(`securitySettings`)}</Link>
          </DropdownMenuItem>
        )}
        {session.user?.role.includes(`MODERATOR`) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/moderation`}>{t(`moderation`)}</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="#" onClick={handleSignOut}>
            {t('signOut')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
