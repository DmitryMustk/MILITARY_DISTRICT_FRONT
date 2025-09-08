import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { createStepSchema } from '@/components/ui/multi-step-form';
import { phoneNumberPattern } from '../utils';

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 30;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_ORGANIZATION_NAME_LENGTH = 255;
export const MAX_REPRESENTATIVE_NAME_LENGTH = 255;
export const MAX_WEBSITES_LENGTH = 255;
export const MAX_EMAIL_LENGTH = 255;
export const MAX_PHONE_LENGTH = 32;
export const MAX_INFORMATION_LENGTH = 1000;

export const providerProfileFormSchema = (t: ReturnType<typeof useTranslations<'Zod.providerProfileFormSchema'>>) =>
  z.object({
    organizationName: z
      .string()
      .min(1, t('organizationNameRequired'))
      .max(MAX_ORGANIZATION_NAME_LENGTH, t('organizationNameMaxLen', { maxLen: MAX_ORGANIZATION_NAME_LENGTH })),
    representativeName: z
      .string()
      .min(1, t('representativeNameRequired'))
      .max(MAX_REPRESENTATIVE_NAME_LENGTH, t('representativeNameMaxLen', { maxLen: MAX_REPRESENTATIVE_NAME_LENGTH })),
    website: z
      .string()
      .max(MAX_WEBSITES_LENGTH, t('websitesMaxLen', { maxLen: MAX_WEBSITES_LENGTH }))
      .optional(),
    information: z
      .string()
      .min(1, t('informationRequired'))
      .max(MAX_INFORMATION_LENGTH, t('informationMaxLen', { maxLen: MAX_INFORMATION_LENGTH })),
    phone: z
      .string()
      .regex(phoneNumberPattern, t('invalidPhone'))
      .min(1, t('phoneRequired'))
      .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH })),
  });

export type ProviderProfileFormValues = z.infer<ReturnType<typeof providerProfileFormSchema>>;

export const providerRegistrationFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.providerRegistrationFormSchema'>>
) =>
  createStepSchema({
    account: z
      .object({
        username: z
          .string()
          .min(MIN_USERNAME_LENGTH, t(`usernameMinLen`, { minLen: MIN_USERNAME_LENGTH }))
          .max(MAX_USERNAME_LENGTH, t(`usernameMaxLen`, { maxLen: MAX_USERNAME_LENGTH })),
        password: z
          .string()
          .min(MIN_PASSWORD_LENGTH, t(`passwordMinLen`, { minLen: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t(`passwordMaxLen`, { maxLen: MAX_PASSWORD_LENGTH })),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t(`passwordsDoNotMatch`),
        path: ['confirmPassword'],
      }),
    professional: z.object({
      organizationName: z
        .string()
        .min(1, t('organizationNameRequired'))
        .max(MAX_ORGANIZATION_NAME_LENGTH, t('organizationNameMaxLen', { maxLen: MAX_ORGANIZATION_NAME_LENGTH })),
      representativeName: z
        .string()
        .min(1, t('representativeNameRequired'))
        .max(MAX_REPRESENTATIVE_NAME_LENGTH, t('representativeNameMaxLen', { maxLen: MAX_REPRESENTATIVE_NAME_LENGTH })),
      website: z
        .string()
        .max(MAX_WEBSITES_LENGTH, t('websitesMaxLen', { maxLen: MAX_WEBSITES_LENGTH }))
        .optional(),
      information: z.string().min(1, t('informationRequired')),
      phone: z
        .string()
        .regex(phoneNumberPattern, t('invalidPhone'))
        .min(1, t('phoneRequired'))
        .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH })),
    }),
  });

export type ProviderRegistrationFormValues = z.infer<ReturnType<typeof providerRegistrationFormSchema>>;

export const providerRegistrationRequestFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.providerRegistrationRequestFormSchema'>>
) =>
  z.object({
    email: z
      .string()
      .email(t('emailInvalid'))
      .min(1, t('emailRequired'))
      .max(255, t('emailMaxLen', { maxLen: MAX_EMAIL_LENGTH })),
    phone: z
      .string()
      .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH }))
      .optional(),
    representativeName: z
      .string()
      .max(MAX_REPRESENTATIVE_NAME_LENGTH, t('representativeNameMaxLen', { maxLen: MAX_REPRESENTATIVE_NAME_LENGTH }))
      .optional(),
    organizationName: z
      .string()
      .max(MAX_ORGANIZATION_NAME_LENGTH, t('organizationNameMaxLen', { maxLen: MAX_ORGANIZATION_NAME_LENGTH }))
      .optional(),
    information: z.string().min(1, t('informationRequired')),
  });

export type ProviderRegistrationRequestFormValues = z.infer<ReturnType<typeof providerRegistrationRequestFormSchema>>;
