import { z } from 'zod';
import { phoneNumberPattern } from '@/lib/utils';
import { $Enums, ArtistTitle, Country, Industry } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { createStepSchema } from '@/components/ui/multi-step-form';

export const MAX_EMAIL_LENGTH = 255;

export const MAX_THEME_LENGTH = 100;
export const MAX_BIO_LENGTH = 2000;
export const MAX_NAME_LENGTH = 50;
export const MAX_PHONE_LENGTH = 30;
export const MAX_COUNTRY_LENGTH = 50;
export const MAX_LINK_LENGTH = 100;
export const MAX_TITLE_LENGTH = 50;
export const MAX_INDUSTRY_LENGTH = 50;
export const MAX_STATEMENT_LENGTH = 2000;

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 30;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;

export const DEFAULT_ARTIST_LIMIT = 9;

export const MIN_DATE = new Date('1900-01-01');

export const artistInvitationSchema = (t: ReturnType<typeof useTranslations<'Zod.artistInvitationSchema'>>) =>
  z.object({
    email: z
      .string({ message: t('invalidEmail') })
      .email({ message: t('invalidEmail') })
      .max(MAX_EMAIL_LENGTH, t('emailMaxLen', { maxLen: MAX_EMAIL_LENGTH })),
  });

export type ArtistInvitationFormValues = z.infer<ReturnType<typeof artistInvitationSchema>>;

export const artistProfileFormSchema = (t: ReturnType<typeof useTranslations<'Zod.artistProfileFormSchema'>>) =>
  createStepSchema({
    personal: z.object({
      firstName: z
        .string()
        .max(MAX_NAME_LENGTH, t('firstNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      lastName: z
        .string()
        .max(MAX_NAME_LENGTH, t('lastNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      phone: z
        .string()
        .regex(phoneNumberPattern, t('invalidPhone'))
        .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH }))
        .optional(),
      countryResidence: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      countryCitizenship: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      birthDay: z.coerce
        .date()
        .min(MIN_DATE, { message: t('birthDayMin') })
        .max(new Date(), { message: t('birthDayMax') }),
    }),
    professional: z.object({
      languages: z.array(
        z.object({
          value: z.nativeEnum($Enums.Languages),
        })
      ),
      industry: z.array(
        z.object({
          value: z
            .nativeEnum(Industry)
            .refine(
              (val) => Object.values(val).length <= MAX_INDUSTRY_LENGTH,
              t('industryMaxLen', { maxLen: MAX_INDUSTRY_LENGTH })
            ),
        })
      ),
      title: z
        .nativeEnum(ArtistTitle)
        .refine((val) => Object.values(val).length <= MAX_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_TITLE_LENGTH })),
      theme: z
        .array(
          z.object({
            value: z.string(),
          })
        )
        .refine(
          (arr) => !arr.find((elem) => elem.value.length > MAX_THEME_LENGTH),
          t('themeMaxLen', { maxLen: MAX_THEME_LENGTH })
        ),
    }),
    profile: z.object({
      statement: z.string().max(MAX_STATEMENT_LENGTH, t('statementMaxValue', { maxLen: MAX_STATEMENT_LENGTH })),
      bio: z
        .string()
        .max(MAX_BIO_LENGTH, t('bioMaxLen', { maxLen: MAX_BIO_LENGTH }))
        .optional(),
      links: z.array(
        z.object({
          value: z
            .string()
            .max(MAX_LINK_LENGTH, t('linkMaxLen', { maxLen: MAX_LINK_LENGTH }))
            .url(),
        })
      ),
      artistName: z
        .string()
        .max(MAX_NAME_LENGTH, t('artistNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
    }),
  });

export type ArtistProfileFormValues = z.infer<ReturnType<typeof artistProfileFormSchema>>;

export const artistRegistrationOAuthFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.artistRegistrationOAuthFormSchema'>>
) =>
  createStepSchema({
    account: z.object({
      username: z
        .string()
        .min(MIN_USERNAME_LENGTH, t('usernameMinLen', { minLen: MIN_USERNAME_LENGTH }))
        .max(MAX_USERNAME_LENGTH, t('usernameMaxLen', { maxLen: MAX_USERNAME_LENGTH })),
    }),
    personal: z.object({
      firstName: z
        .string()
        .max(MAX_NAME_LENGTH, t('firstNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      lastName: z
        .string()
        .max(MAX_NAME_LENGTH, t('lastNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      phone: z
        .string()
        .regex(phoneNumberPattern, t('invalidPhone'))
        .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH }))
        .optional(),
      countryResidence: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      countryCitizenship: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      birthDay: z.coerce
        .date()
        .min(MIN_DATE, { message: t('birthDayMin') })
        .max(new Date(), { message: t('birthDayMax') }),
    }),
    professional: z.object({
      languages: z.array(
        z.object({
          value: z.nativeEnum($Enums.Languages),
        })
      ),
      industry: z.array(
        z.object({
          value: z
            .nativeEnum(Industry)
            .refine(
              (val) => Object.values(val).length <= MAX_INDUSTRY_LENGTH,
              t('industryMaxLen', { maxLen: MAX_INDUSTRY_LENGTH })
            ),
        })
      ),
      title: z
        .nativeEnum(ArtistTitle)
        .refine((val) => Object.values(val).length <= MAX_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_TITLE_LENGTH })),
      theme: z
        .array(
          z.object({
            value: z.string(),
          })
        )
        .refine(
          (arr) => !arr.find((elem) => elem.value.length > MAX_THEME_LENGTH),
          t('themeMaxLen', { maxLen: MAX_THEME_LENGTH })
        ),
    }),
    profile: z.object({
      artistName: z.string().max(MAX_USERNAME_LENGTH, t('artistNameMaxLen', { maxLen: MAX_USERNAME_LENGTH })),
      statement: z.string().max(MAX_STATEMENT_LENGTH, t('statementMaxValue', { maxLen: MAX_STATEMENT_LENGTH })),
      bio: z
        .string()
        .max(MAX_BIO_LENGTH, t('bioMaxLen', { maxLen: MAX_BIO_LENGTH }))
        .optional(),
      links: z.array(
        z.object({
          value: z
            .string()
            .max(MAX_LINK_LENGTH, t('linkMaxLen', { maxLen: MAX_LINK_LENGTH }))
            .url(),
        })
      ),
    }),
  });

export const artistRegistrationFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.artistRegistrationFormSchema'>>
) =>
  createStepSchema({
    account: z
      .object({
        username: z
          .string()
          .min(MIN_USERNAME_LENGTH, t('usernameMinLen', { minLen: MIN_USERNAME_LENGTH }))
          .max(MAX_USERNAME_LENGTH, t('usernameMaxLen', { maxLen: MAX_USERNAME_LENGTH })),
        password: z
          .string()
          .min(MIN_PASSWORD_LENGTH, t('passwordMinLen', { minLen: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('passwordMaxLen', { maxLen: MAX_PASSWORD_LENGTH })),
        confirmPassword: z.string(),
      })
      .refine((data) => data.confirmPassword === data.password, {
        message: t('passwordsDoNotMatch'),
        path: ['confirmPassword'],
      }),
    personal: z.object({
      firstName: z
        .string()
        .max(MAX_NAME_LENGTH, t('firstNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      lastName: z
        .string()
        .max(MAX_NAME_LENGTH, t('lastNameMaxLen', { maxLen: MAX_NAME_LENGTH }))
        .optional(),
      phone: z
        .string()
        .regex(phoneNumberPattern, t('invalidPhone'))
        .max(MAX_PHONE_LENGTH, t('phoneMaxLen', { maxLen: MAX_PHONE_LENGTH }))
        .optional(),
      countryResidence: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      countryCitizenship: z
        .nativeEnum(Country)
        .refine(
          (val) => Object.values(val).length <= MAX_COUNTRY_LENGTH,
          t('countryMaxLen', { maxLen: MAX_COUNTRY_LENGTH })
        ),
      birthDay: z.coerce
        .date()
        .min(MIN_DATE, { message: t('birthDayMin') })
        .max(new Date(), { message: t('birthDayMax') }),
    }),
    professional: z.object({
      languages: z.array(
        z.object({
          value: z.nativeEnum($Enums.Languages),
        })
      ),
      industry: z.array(
        z.object({
          value: z
            .nativeEnum(Industry)
            .refine(
              (val) => Object.values(val).length <= MAX_INDUSTRY_LENGTH,
              t('industryMaxLen', { maxLen: MAX_INDUSTRY_LENGTH })
            ),
        })
      ),
      title: z
        .nativeEnum(ArtistTitle)
        .refine((val) => Object.values(val).length <= MAX_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_TITLE_LENGTH })),
      theme: z
        .array(
          z.object({
            value: z.string(),
          })
        )
        .refine(
          (arr) => !arr.find((elem) => elem.value.length > MAX_THEME_LENGTH),
          t('themeMaxLen', { maxLen: MAX_THEME_LENGTH })
        ),
    }),
    profile: z.object({
      artistName: z.string().max(MAX_USERNAME_LENGTH, t('artistNameMaxLen', { maxLen: MAX_USERNAME_LENGTH })),
      statement: z.string().max(MAX_STATEMENT_LENGTH, t('statementMaxValue', { maxLen: MAX_STATEMENT_LENGTH })),
      bio: z
        .string()
        .max(MAX_BIO_LENGTH, t('bioMaxLen', { maxLen: MAX_BIO_LENGTH }))
        .optional(),
      links: z.array(
        z.object({
          value: z
            .string()
            .max(MAX_LINK_LENGTH, t('linkMaxLen', { maxLen: MAX_LINK_LENGTH }))
            .url(),
        })
      ),
    }),
  });

export type ArtistRegistrationFormValues = z.infer<ReturnType<typeof artistRegistrationFormSchema>>;

export type ArtistRegistrationOAuthFormValues = z.infer<ReturnType<typeof artistRegistrationOAuthFormSchema>>;

export const localStorageRegistrationFormId = 'registration-form';
export const localStorageRegistrationOAuthFormId = 'registration-oauth-form';

export enum BudgetType {
  UP_1000 = 'UP_1000',
  UP_5000 = 'UP_5000',
  UP_10000 = 'UP_10000',
  UP_50000 = 'UP_50000',
  MORE_50000 = 'MORE_50000',
}

export const BudgetTypeValue: Record<Exclude<BudgetType, BudgetType.MORE_50000>, number> = {
  [BudgetType.UP_1000]: 1000,
  [BudgetType.UP_5000]: 5000,
  [BudgetType.UP_10000]: 10000,
  [BudgetType.UP_50000]: 50000,
};
