'use client';

import { AttachmentViewList } from '@/components/common/attachments';
import { CollapsibleWithIcon } from '@/components/common/collapsible-with-icon';
import ExpandableText from '@/components/common/expandable-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  changeApplicationStatusByProvider,
  rejectApplication,
  removeRejectedApplication,
  unblockArtist,
} from '@/lib/opportunity-application/actions';
import { ApplicationWithDetails } from '@/lib/opportunity-application/queries';
import { Attachment, AttachmentWithType } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, useTransition } from 'react';

const MAX_APPLICATION_LINK_COUNT = 10;

interface ProviderApplicationCardProps {
  application: ApplicationWithDetails;
  blockedArtists: number[];
}

const getStatus = (
  application: ApplicationWithDetails,
  t: ReturnType<typeof useTranslations<'Component.ProviderApplicationCard'>>,
  tStatus: ReturnType<typeof useTranslations<'Enum.OpportunityApplicationStatus'>>
) => {
  if (application.banned) {
    return t('opportunityLockedByAdmin');
  }
  return tStatus(application.status);
};

function getVariant(application: ApplicationWithDetails): 'default' | 'destructive' | 'outline' | 'secondary' {
  if (application.banned) {
    return 'destructive';
  }
  switch (application.status) {
    case 'archived':
      return 'secondary';
    case 'archivedByArtist':
      return 'secondary';
    case 'new':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'sent':
      return 'secondary';
    case 'shortlisted':
      return 'default';
    case 'viewlater':
      return 'secondary';
  }
}

export const ProviderApplicationCard = ({ application, blockedArtists }: ProviderApplicationCardProps) => {
  const t = useTranslations('Component.ProviderApplicationCard');
  const tStatus = useTranslations('Enum.OpportunityApplicationStatus');
  const tCountry = useTranslations('Enum.Country');
  const [pending, startTransition] = useTransition();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isBlocked = useMemo(
    () => blockedArtists.find((a) => a === application.artistId),
    [blockedArtists, application.artistId]
  );

  const handleShortlist = useCallback(() => {
    startTransition(async () => {
      await changeApplicationStatusByProvider(application.id, 'shortlisted');
      toast({ title: t('statusChanged') });
      router.refresh();
    });
  }, [application.id, toast, t, router]);

  const handleArchive = useCallback(() => {
    startTransition(async () => {
      await changeApplicationStatusByProvider(application.id, 'archived');
      toast({ title: t('statusChanged') });
      router.refresh();
    });
  }, [application.id, toast, t, router]);

  const handleReject = useCallback(
    (blockArtist?: boolean) => {
      startTransition(async () => {
        await rejectApplication(application.id, blockArtist);
        toast({ title: t('statusChanged') });
        router.refresh();
      });
    },
    [application.id, toast, t, router]
  );

  const handleRemoveReject = useCallback(() => {
    startTransition(async () => {
      await removeRejectedApplication(application.id);
      toast({ title: t('statusChanged') });
      setShowConfirmation(false);
      router.refresh();
    });
  }, [application.id, toast, t, router]);

  const handleUnblock = useCallback(() => {
    startTransition(async () => {
      await unblockArtist(application.artistId);
      toast({ title: t('artistUnblocked') });
      router.refresh();
    });
  }, [application.artistId, toast, t, router]);

  const handleSent = useCallback(() => {
    startTransition(async () => {
      await changeApplicationStatusByProvider(application.id, 'sent');
      toast({ title: t('statusChanged') });
      router.refresh();
    });
  }, [application.id, toast, t, router]);

  const handleViewLater = useCallback(() => {
    startTransition(async () => {
      await changeApplicationStatusByProvider(application.id, 'viewlater');
      toast({ title: t('statusChanged') });
      router.refresh();
    });
  }, [application.id, toast, t, router]);

  return (
    <Card className="border-none flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{`${application.applicantFirstName} ${application.applicantLastName}`}</CardTitle>
          <CardDescription>{isBlocked ? t('blockedApplicant') : t('applicant')}</CardDescription>
          <div>
            <Badge variant={getVariant(application)}>{getStatus(application, t, tStatus)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h6 className="font-semibold font-archivo">{t('messageApplicant')}</h6>
            <ExpandableText text={application.message} />
          </div>
          {!!application.applicantEmail && (
            <div>
              <h6 className="font-semibold font-archivo">{t('emailApplicant')}</h6>
              <p>
                <a className="text-gray-50 hover:text-blue" href={`mailto:${application.applicantEmail}`}>
                  {application.applicantEmail}
                </a>
              </p>
            </div>
          )}
          {!!application.applicantPhone && (
            <div>
              <h6 className="font-semibold font-archivo">{t('phoneApplicant')}</h6>
              <p>{application.applicantPhone}</p>
            </div>
          )}
          {!!application.applicantCountryResidence && (
            <div>
              <h6 className="font-semibold font-archivo">{t('countryResidenceApplicant')}</h6>
              <p>{tCountry(application.applicantCountryResidence)}</p>
            </div>
          )}
          {!!application.applicantLinks?.length && (
            <div>
              <h6 className="font-semibold font-archivo">{t('linksApplicant')}</h6>
              {application.applicantLinks.length > MAX_APPLICATION_LINK_COUNT ? (
                <CollapsibleWithIcon>
                  {application.applicantLinks.map((link, idx) => (
                    <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                      {link + ' '}
                    </a>
                  ))}
                </CollapsibleWithIcon>
              ) : (
                application.applicantLinks.map((link, idx) => (
                  <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                    {link + ' '}
                  </a>
                ))
              )}
            </div>
          )}
          {!!application.projectTitle && (
            <div>
              <h6 className="font-semibold font-archivo">{t('projectTitle')}</h6>
              <ExpandableText text={application.projectTitle} />
            </div>
          )}
          {!!application.projectDescription && (
            <div>
              <h6 className="font-semibold font-archivo">{t('projectDesc')}</h6>
              <ExpandableText text={application.projectDescription} />
            </div>
          )}
          {!!application.projectReach && (
            <div>
              <h6 className="font-semibold font-archivo">{t('reach')}</h6>
              <Badge variant={'secondary'}>{application.projectReach}</Badge>
            </div>
          )}
          {application.attachments && (application.attachments as Attachment[]).length > 0 && (
            <AttachmentViewList attachments={application.attachments as AttachmentWithType[]} showAttachmentType />
          )}
        </CardContent>
      </div>
      <CardFooter>
        <div className="pt-4 flex items-center gap-1 flex-wrap">
          {!isBlocked && application.status !== 'shortlisted' && application.status !== 'rejected' && (
            <Button variant="outline" disabled={pending} onClick={handleShortlist}>
              {t('shortlist')}
            </Button>
          )}
          {!isBlocked && application.status === 'shortlisted' && (
            <Button disabled={pending} variant="outline" onClick={handleSent}>
              {t('removeShortlist')}
            </Button>
          )}
          {!isBlocked && application.status !== 'archived' && application.status !== 'rejected' && (
            <Button disabled={pending} variant="outline" onClick={handleArchive}>
              {t('archive')}
            </Button>
          )}
          {!isBlocked && application.status === 'archived' && (
            <Button disabled={pending} variant="outline" onClick={handleSent}>
              {t('unarchive')}
            </Button>
          )}
          {!isBlocked && application.status !== 'viewlater' && application.status !== 'rejected' && (
            <Button disabled={pending} variant="outline" onClick={handleViewLater}>
              {t('markViewLater')}
            </Button>
          )}
          {!isBlocked && application.status === 'viewlater' && (
            <Button disabled={pending} variant="outline" onClick={handleSent}>
              {t('removeViewLater')}
            </Button>
          )}
          {!isBlocked && application.status !== 'rejected' && !showConfirmation && (
            <Button variant="destructive" disabled={pending} onClick={() => setShowConfirmation(true)}>
              {t('rejectLabel')}
            </Button>
          )}
          {!isBlocked && application.status !== 'rejected' && showConfirmation && (
            <>
              <Button variant="destructive" disabled={pending} onClick={() => handleReject(true)}>
                {t('rejectConfirmBlockApplicant')}
              </Button>
              <Button variant="destructive" disabled={pending} onClick={() => handleReject(false)}>
                {t('rejectConfirm')}
              </Button>
              <Button variant="outline" disabled={pending} onClick={() => setShowConfirmation(false)}>
                {t('rejectCancel')}
              </Button>
            </>
          )}
          {application.status === 'rejected' && (
            <ButtonWithConfirmation
              variant="outline"
              disabled={pending}
              onClick={handleRemoveReject}
              label={isBlocked ? t('removeRejectedAndUnblockLabel') : t('removeRejectedLabel')}
              cancelLabel={t('removeRejectedCancel')}
              confirmLabel={isBlocked ? t('removeRejectedAndUnblockConfirm') : t('removeRejectedConfirm')}
              closeOnClick={true}
            />
          )}
          {isBlocked && (
            <ButtonWithConfirmation
              label={t('unBlockArtistLabel')}
              confirmLabel={t('unBlockArtistConfirm')}
              cancelLabel={t('unBlockArtistCancel')}
              disabled={pending}
              variant="outline"
              onClick={handleUnblock}
              closeOnClick={true}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
