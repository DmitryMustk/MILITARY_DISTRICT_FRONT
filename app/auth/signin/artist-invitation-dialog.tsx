"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { ArtistInvitationForm } from "./artist-invitation-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const ArtistInvitationDialog = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Component.ArtistInvitationDialog");

  const handleInvite = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-neutral-gray h-6">
          {t("registerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("registerAsArtist")}</DialogTitle>
          <DialogDescription>{t("writeEmail")}</DialogDescription>
        </DialogHeader>
        <ArtistInvitationForm onInvite={handleInvite}>
          <DialogClose asChild>
            <Button variant="outline">{t("close")}</Button>
          </DialogClose>
        </ArtistInvitationForm>
      </DialogContent>
    </Dialog>
  );
};
