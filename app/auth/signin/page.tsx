import { auth } from "@/lib/auth";
import { forbidden } from "next/navigation";
import { ArtistInvitationDialog } from "./artist-invitation-dialog";
import { SignInForm } from "./sign-in-form";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    forbidden();
  }
  const t = await getTranslations("Page.SignInPage");

  const referer = (await headers()).get("referer");
  const url = referer ? new URL(referer) : undefined;
  const path = url ? `${url.pathname}${url.search}` : "/";

  return (
    <div className="flex flex-col justify-center max-w-96 m-auto my-6 min-h-[calc(100vh-200px)]">
      <h1 className="self-center font-bold leading-10 mb-8">{t("title")}</h1>
      <SignInForm prevUrlPathname={path} />
      <p className="mt-10 mb-1 self-center">{t("accountNeed")}</p>
      <div className="flex justify-center">
        <ArtistInvitationDialog />
      </div>
    </div>
  );
}
