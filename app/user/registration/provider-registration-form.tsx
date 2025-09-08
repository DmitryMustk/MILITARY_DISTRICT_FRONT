'use client';

import React, { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { providerRegistrationFormSchema, ProviderRegistrationFormValues } from '@/lib/provider/types';
import { useToast } from '@/hooks/use-toast';
import { registerUserByInvite } from '@/lib/provider/registration';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
} from '@/components/ui/multi-step-form';
import { AccountStep } from '@/app/user/registration/account-form-step';
import { ProfessionalStep } from '@/app/user/registration/professional-form-step';

const steps = (t: ReturnType<typeof useTranslations<'Component.ProviderRegistrationForm'>>) => [
  t('account'),
  t('professional'),
];

type ProviderRegistrationFormProps = {
  inviteId: string;
  initialOrganizationName: string;
};

const ProviderRegistrationForm: React.FC<ProviderRegistrationFormProps> = ({ inviteId, initialOrganizationName }) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ProviderRegistrationForm');
  const zodTranslations = useTranslations('Zod.providerRegistrationFormSchema');

  const onSubmit = useCallback(
    async (values: ProviderRegistrationFormValues) => {
      startTransition(async () => {
        await registerUserByInvite(inviteId, values);
        toast({
          title: t(`registrationFinished`),
          description: t(`registrationFinishedDesc`),
        });

        redirect('/auth/signin');
      });
    },
    [inviteId, toast, t]
  );

  const formDefaultValues: ProviderRegistrationFormValues = {
    account: {
      username: ``,
      password: ``,
      confirmPassword: ``,
    },
    professional: {
      organizationName: initialOrganizationName,
      representativeName: ``,
      phone: ``,
      information: ``,
      website: ``,
    },
  };

  const form = useForm<ProviderRegistrationFormValues>({
    resolver: zodResolver(providerRegistrationFormSchema(zodTranslations)),
    defaultValues: formDefaultValues,
    mode: 'onChange',
  });

  return (
    <MultiStepForm
      className="bg-white md:border border-black pt-8 pb-[72px] md:py-10 px-4 md:px-[100px] m-auto max-w-[590px]"
      schema={providerRegistrationFormSchema(zodTranslations)}
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
      </MultiStepFormHeader>
      <MultiStepFormStep name="account">
        <AccountStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="professional">
        <ProfessionalStep pending={pending} />
      </MultiStepFormStep>
    </MultiStepForm>
  );
};

export default ProviderRegistrationForm;
