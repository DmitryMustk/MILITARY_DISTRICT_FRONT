'use client';

import React, { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { artistProfileFormSchema, ArtistProfileFormValues } from '@/lib/artist/types';
import { useTranslations } from 'next-intl';
import { updateProfile } from '@/lib/artist/action';
import { useRouter } from 'next/navigation';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
} from '@/components/ui/multi-step-form';
import { ArtistPersonalInformationFormStep } from '@/components/artist/artist-personal-information-form-step';
import { ArtistProfessionalAccountStep } from '@/components/artist/artist-professional-form.step';
import { ArtistProfileStep } from '@/components/artist/artist-profile-form-step';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

interface ArtistProfileFormProps {
  defaultValues: ArtistProfileFormValues;
}

const steps = (t: ReturnType<typeof useTranslations<'Component.ArtistProfileForm'>>) => [
  t('personal'),
  t('professional'),
  t('profile'),
];

export const ArtistProfileForm = ({ defaultValues }: ArtistProfileFormProps) => {
  const zodTranslations = useTranslations('Zod.artistProfileFormSchema');
  const form = useForm<ArtistProfileFormValues>({
    resolver: zodResolver(artistProfileFormSchema(zodTranslations)),
    defaultValues: defaultValues,
    mode: 'onChange',
  });
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ArtistProfileForm');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (values: ArtistProfileFormValues) => {
      startTransition(async () => {
        await updateProfile(values);
        toast({ title: t('successfullyUpdated') });
        router.push('/artist/profile');
      });
    },
    [router, toast, t]
  );

  return (
    <MultiStepForm
      className="md:border border-black pt-8 pb-[72px] md:py-10 px-4 md:px-[100px] m-auto max-w-[590px]"
      schema={artistProfileFormSchema(zodTranslations)}
      animated
      form={form}
      onSubmit={handleSubmit}
    >
      <MultiStepFormHeader className="flex w-full flex-col justify-center space-y-6">
        <MultiStepFormContextProvider>
          {({ currentStepIndex }) => (
            <div key={currentStepIndex}>
              <p className="font-bold text-base leading-tight text-[#838383]">
                {t('step', { step: currentStepIndex + 1 })}
              </p>
              <h1 className="font-bold leading-tight mt-3 mb-6">{steps(t)[currentStepIndex]}</h1>
            </div>
          )}
        </MultiStepFormContextProvider>
      </MultiStepFormHeader>
      <MultiStepFormStep name="personal">
        <ArtistPersonalInformationFormStep backLink="/artist/profile" showModerationWarning />
      </MultiStepFormStep>
      <MultiStepFormStep name="professional">
        <ArtistProfessionalAccountStep backLink="/artist/profile" showModerationWarning />
      </MultiStepFormStep>
      <MultiStepFormStep name="profile">
        <ArtistProfileStep pending={pending} backLink="/artist/profile" showModerationWarning />
      </MultiStepFormStep>
    </MultiStepForm>
  );
};
