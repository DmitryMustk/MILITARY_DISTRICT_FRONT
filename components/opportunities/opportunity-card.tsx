"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Opportunity, OpportunityInviteStatus } from "@prisma/client";
import { Badge } from "../ui/badge";
import { useTranslations, useFormatter } from "next-intl";
import { AttachmentWithType } from "@/lib/types";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AttachmentViewList } from "../common/attachments";
import ExpandableText from "../common/expandable-text";
import { CollapsibleWithIcon } from "../common/collapsible-with-icon";
import { formatDateLocal } from "@/lib/date-format-local";
import { cn } from "@/lib/utils";

const COUNTRY_LENGTH_WITHOUT_COLLAPSIBLE = 20;

type Prp = PropsWithChildren & {
  opportunity: Opportunity;
  provider?: string;
  status?: OpportunityInviteStatus;
  footerStyles?: string;
  showAttachment?: boolean;
  disableBannedBadge?: boolean;
  limitSize?: boolean;
  className?: string;
};

export default function OpportunityCard({
  opportunity,
  provider,
  status,
  footerStyles,
  children,
  showAttachment,
  disableBannedBadge,
  limitSize,
  className,
}: Prp) {
  const t = useTranslations("Component.OpportunityCard");
  const f = useFormatter();
  const tOpportunityType = useTranslations("Enum.OpportunityType");
  const tLegalStatus = useTranslations("Enum.LegalStatus");
  const tGender = useTranslations("Enum.Gender");
  const tIndustry = useTranslations("Enum.Industry");
  const tArtTheme = useTranslations("Enum.ArtTheme");
  const tCountry = useTranslations("Enum.Country");

  const attachments = opportunity.attachments as
    | AttachmentWithType[]
    | undefined;

  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [responseDeadline, setResponseDeadline] = useState("");
  useEffect(() => {
    setApplicationDeadline(formatDateLocal(opportunity.applicationDeadline));
    if (opportunity.responseDeadline) {
      setResponseDeadline(formatDateLocal(opportunity.responseDeadline));
    }
  }, [opportunity.applicationDeadline, opportunity.responseDeadline]);

  return (
    <Card
      key={opportunity.id}
      className={cn("border-none flex flex-col justify-between", className)}
    >
      <div>
        <CardHeader>
          <CardTitle>{opportunity.title}</CardTitle>

          <div className="flex gap-2 pt-2">
            <Badge variant={"secondary"}>
              {tOpportunityType(opportunity.type)}
            </Badge>
            <Badge variant={"secondary"}>
              {t(`visibility.${opportunity.visibility}`)}
            </Badge>
            {status === `pending` && (
              <Badge variant={"default"}>{t("pending")}</Badge>
            )}
            {status === `accepted` && (
              <Badge variant={"secondary"}>{t("accepted")}</Badge>
            )}
            {status === `rejected` && (
              <Badge variant={"destructive"}>{t("rejected")}</Badge>
            )}
          </div>
          <div>
            {!disableBannedBadge && opportunity.banned && (
              <Badge variant={"destructive"}>{t("banned")}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {provider && (
            <div>
              <h6 className="font-semibold font-archivo">{t("provider")}</h6>{" "}
              {provider}
            </div>
          )}
          {opportunity.type === "grant" &&
            opportunity.minGrantAmount !== null && (
              <div>
                <h6 className="font-semibold font-archivo">
                  {t("minGrantAmount")}
                </h6>
                <p>
                  {f.number(opportunity.minGrantAmount, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}
          {opportunity.type === "grant" &&
            opportunity.maxGrantAmount !== null && (
              <div>
                <h6 className="font-semibold font-archivo">
                  {t("maxGrantAmount")}
                </h6>
                <p>
                  {f.number(opportunity.maxGrantAmount, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}
          {opportunity.type === "residency" && (
            <div>
              <h6 className="font-semibold font-archivo">
                {t("minResidencyTime")}
              </h6>
              <p>{t("weeks", { weeks: opportunity.minResidencyTime })}</p>
            </div>
          )}
          {opportunity.type === "residency" && (
            <div>
              <h6 className="font-semibold font-archivo">
                {t("maxResidencyTime")}
              </h6>
              <p>{t("weeks", { weeks: opportunity.maxResidencyTime })}</p>
            </div>
          )}
          {opportunity.type === "residency" &&
            opportunity.residencyOffering.length !== 0 && (
              <div>
                <h6 className="font-semibold font-archivo">
                  {t(`residencyOffering`)}
                </h6>
                <div className="flex gap-1 flex-wrap">
                  {opportunity.residencyOffering.map((e) => (
                    <Badge variant={"secondary"} key={e}>
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          {opportunity.type === "residency" &&
            !!opportunity.residencyOfferingDescription && (
              <div className="mt-2 mb-2 line-clamp-3">
                <h6 className="font-semibold font-archivo">
                  {t("residencyOfferingDescription")}
                </h6>
                {opportunity.residencyOfferingDescription}
              </div>
            )}
          {opportunity.type === "award" &&
            opportunity.minAwardAmount !== null && (
              <div>
                <h6 className="font-semibold font-archivo">
                  {t("minAwardAmount")}
                </h6>
                <p>
                  {f.number(opportunity.minAwardAmount, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}
          {opportunity.type === "award" &&
            opportunity.maxAwardAmount !== null && (
              <div>
                <h6 className="font-semibold font-archivo">
                  {t("maxAwardAmount")}
                </h6>
                <p>
                  {f.number(opportunity.maxAwardAmount, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}
          {opportunity.type === "award" && !!opportunity.awardSpecialAccess && (
            <div className="mt-2 mb-2 line-clamp-3">
              <h6 className="font-semibold font-archivo">
                {t("awardSpecialAccess")}
              </h6>
              {opportunity.awardSpecialAccess}
            </div>
          )}
          <div>
            <h6 className="font-semibold font-archivo">
              {t("applicationDeadline")}
            </h6>
            <p>{applicationDeadline}</p>
          </div>
          {opportunity.responseDeadline && (
            <div>
              <h6 className="font-semibold font-archivo">
                {t("responseDeadline")}
              </h6>
              <p>{responseDeadline}</p>
            </div>
          )}

          {limitSize ? (
            <p className="mt-2 mb-2 line-clamp-3 whitespace-pre-wrap truncate">
              {opportunity.description}
            </p>
          ) : (
            <ExpandableText text={opportunity.description} />
          )}

          {opportunity.legalStatus.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t(`legalStatus`)}</h6>
              <div className="flex gap-1 flex-wrap">
                {opportunity.legalStatus.map((e) => (
                  <Badge variant={"secondary"} key={e}>
                    {tLegalStatus(e)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {opportunity.gender.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t(`gender`)}</h6>
              <div className="flex gap-1 flex-wrap">
                {opportunity.gender.map((e) => (
                  <Badge variant={"secondary"} key={e}>
                    {tGender(e)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {opportunity.minAge && (
            <div>
              <h6 className="font-semibold font-archivo">{t("minAge")}</h6>{" "}
              {opportunity.minAge}
            </div>
          )}
          {opportunity.maxAge && (
            <div>
              <h6 className="font-semibold font-archivo">{t("maxAge")}</h6>
              <p>{opportunity.maxAge}</p>
            </div>
          )}

          {opportunity.industry.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t(`industry`)}</h6>
              <li className="flex gap-1 flex-wrap">
                {opportunity.industry.map((e) => (
                  <Badge variant={"secondary"} key={e}>
                    {tIndustry(e)}
                  </Badge>
                ))}
              </li>
            </div>
          )}

          {opportunity.countryResidence.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">
                {t(`residenceCountry`)}
              </h6>
              <li className="flex gap-1 flex-wrap">
                {limitSize ? (
                  opportunity.countryResidence.map((e) => (
                    <Badge
                      variant={"secondary"}
                      key={e}
                      className={limitSize ? "[&:nth-child(n+10)]:hidden" : ""}
                    >
                      {tCountry(e)}
                    </Badge>
                  ))
                ) : opportunity.countryResidence.length >
                  COUNTRY_LENGTH_WITHOUT_COLLAPSIBLE ? (
                  <CollapsibleWithIcon>
                    {opportunity.countryResidence.map((e) => (
                      <Badge
                        variant={"secondary"}
                        key={e}
                        className={
                          limitSize ? "[&:nth-child(n+10)]:hidden" : ""
                        }
                      >
                        {tCountry(e)}
                      </Badge>
                    ))}
                  </CollapsibleWithIcon>
                ) : (
                  opportunity.countryResidence.map((e) => (
                    <Badge
                      variant={"secondary"}
                      key={e}
                      className={limitSize ? "[&:nth-child(n+10)]:hidden" : ""}
                    >
                      {tCountry(e)}
                    </Badge>
                  ))
                )}
              </li>
            </div>
          )}

          {opportunity.countryCitizenship.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">
                {t(`citizenshipCountry`)}
              </h6>
              <li className="flex gap-1 flex-wrap">
                {limitSize ? (
                  opportunity.countryCitizenship.map((e) => (
                    <Badge
                      variant={"secondary"}
                      key={e}
                      className={limitSize ? "[&:nth-child(n+10)]:hidden" : ""}
                    >
                      {tCountry(e)}
                    </Badge>
                  ))
                ) : opportunity.countryCitizenship.length >
                  COUNTRY_LENGTH_WITHOUT_COLLAPSIBLE ? (
                  <CollapsibleWithIcon>
                    {opportunity.countryCitizenship.map((e) => (
                      <Badge
                        variant={"secondary"}
                        key={e}
                        className={
                          limitSize ? "[&:nth-child(n+10)]:hidden" : ""
                        }
                      >
                        {tCountry(e)}
                      </Badge>
                    ))}
                  </CollapsibleWithIcon>
                ) : (
                  opportunity.countryCitizenship.map((e) => (
                    <Badge
                      variant={"secondary"}
                      key={e}
                      className={limitSize ? "[&:nth-child(n+10)]:hidden" : ""}
                    >
                      {tCountry(e)}
                    </Badge>
                  ))
                )}
              </li>
            </div>
          )}

          {!!opportunity.locationDescription && (
            <div className="mt-2 mb-2 line-clamp-3">
              <h6 className="font-semibold font-archivo">
                {t("locationLimitations")}
              </h6>
              <p>{opportunity.locationDescription}</p>
            </div>
          )}

          {opportunity.theme.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t(`themes`)}</h6>
              <div className="flex gap-1 flex-wrap">
                {opportunity.theme.map((e) => (
                  <Badge variant={"secondary"} key={e}>
                    {tArtTheme(e)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!!opportunity.themeDescription && (
            <div className="mt-2 mb-2 line-clamp-3">
              <h6 className="font-semibold font-archivo">
                {t("themeLimitations")}
              </h6>
              <p>{opportunity.themeDescription}</p>
            </div>
          )}

          {showAttachment &&
            attachments !== undefined &&
            attachments.length !== 0 && (
              <AttachmentViewList
                attachments={attachments}
                showAttachmentType
              />
            )}
        </CardContent>
      </div>
      <CardFooter className={footerStyles}>{children}</CardFooter>
    </Card>
  );
}
