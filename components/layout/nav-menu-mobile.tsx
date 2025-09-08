import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import HamburgerMenu from '@/public/images/hamburger-menu.svg';
import { navMenuItems } from '@/components/layout/nav-menu-items';
import { Logo } from '@/components/layout/logo';
import CloseIcon from '@/public/images/close-circle.svg';
import { getTranslations } from 'next-intl/server';

export const NavMenuMobile = async () => {
  const t = await getTranslations('Component.NavMenu');
  const items = await navMenuItems(t);

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <HamburgerMenu />
      </SheetTrigger>
      <SheetContent className="px-4 sm:px-8">
        <SheetHeader className="flex flex-row w-full justify-between items-center h-24 p-0">
          <Logo />
          <SheetClose>
            <CloseIcon />
          </SheetClose>
        </SheetHeader>
        <SheetTitle className="hidden">{t('asaArmenia')}</SheetTitle>
        <SheetDescription className="hidden">{t('mainMenu')}</SheetDescription>
        <ul className="my-9">
          {items.map((item) => (
            <li key={item.href} className="font-archivo-narrow text-4xl uppercase my-9">
              <SheetClose asChild>
                <Link href={item.href}>{item.name}</Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};
