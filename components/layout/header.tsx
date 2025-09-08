import { auth } from "@/lib/auth";
import { AccountMenu } from "@/components/layout/account-menu";
import { NavMenu } from "@/components/layout/nav-menu";
import { Logo } from "@/components/layout/logo";
import { NavMenuMobile } from "@/components/layout/nav-menu-mobile";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="flex gap-4 items-center justify-between w-full h-24 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
      <Logo />
      <NavMenu />
      <div className="flex gap-4">
        <AccountMenu session={session} />
        <NavMenuMobile />
      </div>
    </header>
  );
};
