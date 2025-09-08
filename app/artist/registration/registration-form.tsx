'use client';

import {
  artistRegistrationFormSchema,
  ArtistRegistrationFormValues,
  localStorageRegistrationFormId,
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
import { ArtistAccountStep } from '@/components/artist/account-form-step';
import { ArtistProfileStep } from '@/components/artist/artist-profile-form-step';
import { ArtistPersonalInformationFormStep } from '@/components/artist/artist-personal-information-form-step';
import { ArtistProfessionalAccountStep } from '@/components/artist/artist-professional-form.step';
import { useToast } from '@/hooks/use-toast';
import { registerArtistByInvite } from '@/lib/artist/registration';
import { FormErrorMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { ArtistTitle, Country } from '@prisma/client';

const steps = (t: ReturnType<typeof useTranslations<'Component.ArtistRegistrationForm'>>) => [
  t('account'),
  t('personal'),
  t('professional'),
  t('profile'),
];

interface ArtistRegistrationFormProps {
  invitationId: string;
  currentVersion: string;
}

export const ArtistRegistrationForm = ({ invitationId, currentVersion }: ArtistRegistrationFormProps) => {
  const version = localStorage.getItem(localStorageRegistrationFormId)
    ? JSON.parse(localStorage.getItem(localStorageRegistrationFormId)!).version
    : undefined;

  const initialValues =
    version && version === currentVersion
      ? (JSON.parse(localStorage.getItem(localStorageRegistrationFormId)!) as ArtistRegistrationFormValues)
      : undefined;

  const tIndustry = useTranslations('Enum.Industry');

  const defaultValues = {
    account: {
      username: initialValues?.account?.username ?? '',
      password: initialValues?.account?.password ?? '',
      confirmPassword: initialValues?.account?.confirmPassword ?? '',
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
      industry: initialValues?.professional?.industry.map((val) => ({ ...val, label: tIndustry(val.value) })) ?? [],
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
  const t = useTranslations('Component.ArtistRegistrationForm');
  const zodTranslations = useTranslations('Zod.artistRegistrationFormSchema');
  const form = useForm<ArtistRegistrationFormValues>({
    resolver: zodResolver(artistRegistrationFormSchema(zodTranslations)),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const formValues = form.getValues();
  useEffect(() => {
    // If you change the registration form, you should upgrade the version so that users do not have problems with parsing localstorage item.
    if (pending) {
      return;
    }
    localStorage.setItem(localStorageRegistrationFormId, JSON.stringify({ ...formValues, version: currentVersion }));
  }, [version, formValues, currentVersion, pending]);

  useEffect(() => {
    const values = form.getValues().account;
    if (values.confirmPassword === '' && values.password === '' && values.username === '') {
      return;
    }
    form.trigger();
  }, [form]);

  const onSubmit = useCallback(
    (data: ArtistRegistrationFormValues) => {
      startTransition(async () => {
        const res = await registerArtistByInvite(invitationId, data);

        setError(res.error);

        if (!res.success) {
          toast({ title: t('failedRegister') });
          return;
        }

        localStorage.removeItem(localStorageRegistrationFormId);
        toast({ title: t('registrationFinished'), description: t('registrationFinishedDesc') });
        router.push('/auth/signin');
      });
    },
    [invitationId, router, toast, t]
  );

  return (
    <MultiStepForm
      className="bg-white md:border border-black pt-8 pb-[72px] md:py-10 px-4 md:px-[100px] m-auto max-w-[590px]"
      schema={artistRegistrationFormSchema(zodTranslations)}
      form={form}
      onSubmit={onSubmit}
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
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </MultiStepFormHeader>
      <MultiStepFormStep name="account">
        <ArtistAccountStep />
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
