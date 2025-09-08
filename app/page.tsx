import { getTranslations } from "next-intl/server";
import HomeImage from "@/public/images/home.svg";
import HomeMobileImage from "@/public/images/home-mobile.svg";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const t = await getTranslations("Page.HomePage");
  const session = await auth();
  console.log(session);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative bg-red w-full flex flex-col overflow-hidden">
        <div className="flex flex-col gap-6 sm:gap-9 max-w-lg mx-4 my-9 sm:my-16 sm:mx-24 z-10">
          <p className="text-foreground text-[3rem]/snug sm:text-9xl/snug font-bold font-archivo-narrow uppercase">
            {t("title")}
          </p>
          <p className="text-foreground text-[1.5rem]/relaxed sm:text-2xl/relaxed">
            {t("description")}
          </p>
          <p className="text-foreground text-[1.5rem]/relaxed sm:text-2xl/relaxed">
            {t("description1")}
          </p>
        </div>
        <div className="hidden sm:block absolute left-[23rem]">
          <HomeImage />
        </div>
        <div className="sm:hidden max-h-52">
          <HomeMobileImage width="100%" />
        </div>
      </div>
    </div>
  );
}
