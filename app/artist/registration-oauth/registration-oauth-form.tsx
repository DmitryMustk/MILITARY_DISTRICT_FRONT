'use client';

import {
  artistRegistrationOAuthFormSchema,
  ArtistRegistrationOAuthFormValues,
  localStorageRegistrationOAuthFormId,
} from '@/lib/artist/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
} from '@/components/ui/multi-step-form';
// MultiStepForm.js
import { ArtistProfileStep } from '@/components/artist/artist-profile-form-step';
import { ArtistPersonalInformationFormStep } from '@/components/artist/artist-personal-information-form-step';
import { ArtistProfessionalAccountStep } from '@/components/artist/artist-professional-form.step';
import { Step, Stepper } from 'react-form-stepper';
import { useToast } from '@/hooks/use-toast';
import { FormErrorMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { registerOAuthArtistByInvite } from '@/lib/artist/registration';
import { ArtistOAuthAccountStep } from '@/components/artist/account-oauth-form-step';
import { getUrlHomePageOAuth } from '@/lib/user/queries';
import { clearUrlHomePageOAuth } from '@/lib/user/action';
import { ArtistTitle, Country } from '@prisma/client';

const steps = (t: ReturnType<typeof useTranslations<'Component.ArtistRegistrationOAuthForm'>>) => [
  {
    label: t('account'),
  },
  {
    label: t('personal'),
  },
  {
    label: t('professional'),
  },
  {
    label: t('profile'),
  },
];

interface ArtistRegistrationOAuthFormProps {
  currentVersion: string;
}

export const ArtistRegistrationOAuthForm = ({ currentVersion }: ArtistRegistrationOAuthFormProps) => {
  const version = localStorage.getItem(localStorageRegistrationOAuthFormId)
    ? JSON.parse(localStorage.getItem(localStorageRegistrationOAuthFormId)!).version
    : undefined;

  const initialValues =
    version && version === currentVersion
      ? (JSON.parse(localStorage.getItem(localStorageRegistrationOAuthFormId)!) as ArtistRegistrationOAuthFormValues)
      : undefined;

  const defaultValues = {
    account: {
      username: initialValues?.account?.username ?? '',
    },
    personal: {
      firstName: initialValues?.personal?.firstName ?? '',
      lastName: initialValues?.personal?.lastName ?? '',
      phone: initialValues?.personal?.phone ?? '',
      countryCitizenship: initialValues?.personal?.countryCitizenship ?? Country.None,
      countryResidence: initialValues?.personal?.countryResidence ?? Country.None,
      birthDay: initialValues?.personal?.birthDay ?? new Date(),
    },
    professional: {
      languages: initialValues?.professional?.languages ?? [],
      industry: initialValues?.professional?.industry ?? [],
      title: initialValues?.professional?.title ?? ArtistTitle.Artist,
      theme: initialValues?.professional?.theme ?? [],
    },
    profile: {
      statement: initialValues?.profile?.statement ?? '',
      bio: initialValues?.profile?.bio ?? '',
      links: initialValues?.profile?.links ?? [],
      artistName: initialValues?.profile?.artistName ?? '',
    },
  };

  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ArtistRegistrationOAuthForm');
  const zodTranslations = useTranslations('Zod.artistRegistrationOAuthFormSchema');
  const form = useForm<ArtistRegistrationOAuthFormValues>({
    resolver: zodResolver(artistRegistrationOAuthFormSchema(zodTranslations)),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const formValues = form.getValues();
  useEffect(() => {
    // If you change the registration form, you should upgrade the version so that users do not have problems with parsing localstorage item.
    if (pending) {
      return;
    }
    localStorage.setItem(
      localStorageRegistrationOAuthFormId,
      JSON.stringify({ ...formValues, version: currentVersion })
    );
  }, [version, formValues, currentVersion, pending]);

  useEffect(() => {
    const values = form.getValues();
    if (values.account.username !== '') {
      form.trigger();
    }
  }, [form]);

  const onSubmit = useCallback(
    (data: ArtistRegistrationOAuthFormValues) => {
      startTransition(async () => {
        const res = await registerOAuthArtistByInvite(data);

        setError(res.error);

        if (!res.success) {
          toast({ title: t('failedRegister') });
          return;
        }

        localStorage.removeItem(localStorageRegistrationOAuthFormId);
        toast({ title: t('registrationFinished'), description: t('registrationFinishedDesc') });

        const url = await getUrlHomePageOAuth();
        await clearUrlHomePageOAuth();

        router.push(url?.urlHomePage ?? '/');
      });
    },
    [router, toast, t]
  );

  return (
    <MultiStepForm
      className="space-y-10 p-8 rounded-xl border"
      schema={artistRegistrationOAuthFormSchema(zodTranslations)}
      animated
      form={form}
      onSubmit={onSubmit}
    >
      <MultiStepFormHeader className="flex w-full flex-col justify-center space-y-6">
        <h2 className="font-bold">{t('fillFields')}</h2>
        <MultiStepFormContextProvider>
          {({ currentStepIndex, isStepValid, goToStep }) => (
            <Stepper activeStep={currentStepIndex}>
              {steps(t).map((step, idx) => (
                <Step
                  key={idx}
                  label={step.label}
                  disabled={!isStepValid()}
                  onClick={(e) => {
                    e.preventDefault();
                    goToStep(idx);
                  }}
                />
              ))}
            </Stepper>
          )}
        </MultiStepFormContextProvider>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </MultiStepFormHeader>
      <MultiStepFormStep name="account">
        <ArtistOAuthAccountStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="personal">
        <ArtistPersonalInformationFormStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="professional">
        <ArtistProfessionalAccountStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="profile">
        <ArtistProfileStep pending={pending} />
      </MultiStepFormStep>
    </MultiStepForm>
  );
};
