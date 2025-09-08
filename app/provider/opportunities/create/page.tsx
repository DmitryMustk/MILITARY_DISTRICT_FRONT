'use client';

import OpportunityForm from '../opportunity-form';
import { OpportunityFormInputValues } from '@/lib/opportunity/types';
import { startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';

export default function AddOpportunityPage() {
  const defaultValues: OpportunityFormInputValues = {
    applicationDeadline: startOfDay(new Date()),
    responseDeadline: null,
    description: '',
    title: '',
    type: 'grant',
    visibility: 'nobody',
    maxGrantAmount: '',
    minGrantAmount: '',
    maxResidencyTime: '',
    minResidencyTime: '',
    residencyOffering: [],
    residencyOfferingDescription: '',
    maxAwardAmount: '',
    minAwardAmount: '',
    awardSpecialAccess: '',
    legalStatus: [],
    minAge: '',
    maxAge: '',
    gender: [],
    industry: [],
    countryResidence: [],
    countryCitizenship: [],
    locationDescription: '',
    theme: [],
    themeDescription: '',
    attachments: [],
  };
  const t = useTranslations('Page.AddOpportunityPage');
  return (
    <div>
      <h1 className="flex justify-center font-bold">{t('addOpportunity')}</h1>
      <div className="main-no-padding flex bg-cover bg-center md:pt-[49px] md:pb-[48px] md:min-h-[calc(100vh-190px)] max-md:!bg-none">
        <OpportunityForm defaultValues={defaultValues} />
      </div>
    </div>
  );
}
