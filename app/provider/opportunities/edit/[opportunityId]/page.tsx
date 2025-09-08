import OpportunityForm from '../../opportunity-form';
import { OpportunityFormInputValues } from '@/lib/opportunity/types';
import { getMyOpportunity } from '@/lib/opportunity/queries';
import { getTranslations } from 'next-intl/server';
import { AttachmentWithType } from '@/lib/types';
import { toOptions } from '@/lib/utils';
import { Country } from '@prisma/client';

export default async function EditOpportunityPage({ params }: { params: Promise<{ opportunityId: string }> }) {
  const t = await getTranslations('Page.EditOpportunityPage');
  const tIndustry = await getTranslations('Enum.Industry');

  const opportunityId = Number.parseInt((await params).opportunityId);
  const opportunity = await getMyOpportunity(opportunityId);
  const defaultValues: OpportunityFormInputValues = {
    ...opportunity,
    responseDeadline: opportunity.responseDeadline ?? null,
    minGrantAmount: opportunity.minGrantAmount ?? '',
    maxGrantAmount: opportunity.maxGrantAmount ?? '',
    minResidencyTime: opportunity.minResidencyTime ?? '',
    maxResidencyTime: opportunity.maxResidencyTime ?? '',
    residencyOffering: opportunity.residencyOffering.map(toOptions),
    residencyOfferingDescription: opportunity.residencyOfferingDescription ?? '',
    minAwardAmount: opportunity.minAwardAmount ?? '',
    maxAwardAmount: opportunity.maxAwardAmount ?? '',
    awardSpecialAccess: opportunity.awardSpecialAccess ?? '',
    legalStatus: opportunity.legalStatus.map(toOptions),
    minAge: opportunity.minAge ?? '',
    maxAge: opportunity.maxAge ?? '',
    gender: opportunity.gender.map(toOptions),
    industry: opportunity.industry.map((val) => ({ value: val, label: tIndustry(val) })),
    countryResidence: (opportunity.countryResidence as Country[]).map(toOptions),
    countryCitizenship: (opportunity.countryCitizenship as Country[]).map(toOptions),
    locationDescription: opportunity.locationDescription ?? '',
    theme: opportunity.theme.map(toOptions),
    themeDescription: opportunity.themeDescription ?? '',
    attachments: opportunity.attachments as AttachmentWithType[],
  };

  return (
    <div>
      <h1 className="flex justify-center font-bold">{t('updateOpportunity')}</h1>
      <div className="main-no-padding flex bg-cover bg-center md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)] max-md:!bg-none">
        <OpportunityForm opportunityId={opportunityId} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
