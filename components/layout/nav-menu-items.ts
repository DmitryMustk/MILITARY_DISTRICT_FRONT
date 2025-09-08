import { useTranslations } from "next-intl";

export const navMenuItems = async (
  t: ReturnType<typeof useTranslations<"Component.NavMenu">>,
) => {
  const staticItems = [
    {
      href: "/forces",
      name: t("forces"),
    },
    {
      href: "/artists",
      name: t("manpower"),
    },
    {
      href: "/news",
      name: t("equipment"),
    },
    {
      href: `/test1`,
      name: t("infrastructure"),
    },
    {
      href: `/test`,
      name: t("analytics"),
    },
  ];

  return [...staticItems];
};
