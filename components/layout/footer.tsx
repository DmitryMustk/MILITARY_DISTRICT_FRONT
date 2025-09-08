import { getTranslations } from "next-intl/server";

export const Footer = async () => {
  const t = await getTranslations("Component.Footer");

  return (
    <footer className="flex items-center h-24 bg-primary">
      <div className="w-full text-primary-foreground max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
        {t("copyright")}
      </div>
    </footer>
  );
};
