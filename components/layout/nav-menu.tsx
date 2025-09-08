"use server";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navMenuItems } from "@/components/layout/nav-menu-items";
import { getTranslations } from "next-intl/server";

export const NavMenu = async () => {
  const t = await getTranslations("Component.NavMenu");
  const items = await navMenuItems(t);

  return (
    <NavigationMenu className="hidden md:flex max-w-full">
      <NavigationMenuList className="font-archivo-narrow text-base uppercase flex space-x-2">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              href={item.href}
              className="whitespace-nowrap px-2 py-1 text-md hover:bg-muted/50 rounded"
            >
              {item.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
