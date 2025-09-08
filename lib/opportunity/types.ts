import {
  ArtTheme,
  Country,
  Gender,
  Industry,
  LegalStatus,
  OpportunityType,
  OpportunityVisibility,
  ResidencyOffering,
} from '@prisma/client';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { fromOptions } from '@/lib/utils';

export const TITLE_MAX_LEN = 50;
const MAX_ATTACHMENT_TYPE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_THEME_DESCRIPTION_LENGTH = 300;

export const opportunityFormSchema = (t: ReturnType<typeof useTranslations<'Zod.opportunityFormSchema'>>) =>
  z
    .object({
      title: z
        .string()
        .min(1, t('titleRequired'))
        .max(TITLE_MAX_LEN, t('titleMaxLen', { maxLen: TITLE_MAX_LEN })),
      description: z
        .string()
        .min(1, t('descriptionRequired'))
        .max(MAX_DESCRIPTION_LENGTH, t('descriptionMaxLen', { maxLen: MAX_DESCRIPTION_LENGTH })),
      applicationDeadline: z.date({
        required_error: t('applicationDeadlineRequired'),
      }),
      responseDeadline: z.date().nullable(),
      legalStatus: z.array(
        z
          .object({
            value: z.nativeEnum(LegalStatus),
          })
          .transform(fromOptions)
      ),
      minAge: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('ageEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        ),
      maxAge: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('ageEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        ),
      gender: z.array(
        z
          .object({
            value: z.nativeEnum(Gender),
          })
          .transform(fromOptions)
      ),
      industry: z.array(
        z
          .object({
            value: z.nativeEnum(Industry),
          })
          .transform(fromOptions)
      ),
      countryResidence: z.array(
        z
          .object({
            value: z.nativeEnum(Country),
          })
          .transform(fromOptions)
      ),
      countryCitizenship: z.array(
        z
          .object({
            value: z.nativeEnum(Country),
          })
          .transform(fromOptions)
      ),
      locationDescription: z.string(),
      theme: z.array(
        z
          .object({
            value: z.nativeEnum(ArtTheme),
          })
          .transform(fromOptions)
      ),
      themeDescription: z
        .string()
        .max(MAX_THEME_DESCRIPTION_LENGTH, t('themeDescriptionMaxLen', { maxLen: MAX_THEME_DESCRIPTION_LENGTH })),
      type: z.nativeEnum(OpportunityType, {
        required_error: t('opportunityTypeRequired'),
      }),
      visibility: z.nativeEnum(OpportunityVisibility, {
        required_error: t('opportunityVisibilityRequired'),
      }),
      minGrantAmount: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      maxGrantAmount: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      minResidencyTime: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      maxResidencyTime: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      residencyOffering: z
        .array(
          z
            .object({
              value: z.nativeEnum(ResidencyOffering),
            })
            .transform(fromOptions)
        )
        .or(z.undefined().transform<ResidencyOffering[]>(() => [])),
      residencyOfferingDescription: z.string().or(z.undefined().transform(() => '')),
      minAwardAmount: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      maxAwardAmount: z
        .number()
        .gte(1)
        .or(
          z
            .string()
            .regex(/^[1-9]\d*$/, { message: t('amountEmptyOrPositive') })
            .transform(Number)
        )
        .or(
          z
            .string()
            .length(0)
            .transform(() => null)
        )
        .or(z.undefined().transform(() => null)),
      awardSpecialAccess: z.string().or(z.undefined().transform(() => '')),

      attachments: z.array(
        z.object({
          value: z
            .object({
              id: z.string(),
              fileName: z.string(),
              fileType: z.string(),
              attachmentType: z.string().optional(),
              thumbnailId: z.string().optional(),
            })
            .refine((data) => !data.attachmentType || data.attachmentType.length <= MAX_ATTACHMENT_TYPE_LENGTH, {
              message: t('attachmentTypeMaxLen', { maxLen: MAX_ATTACHMENT_TYPE_LENGTH }),
            }),
        })
      ),
    })
    .superRefine((data, context) => {
      if (data.type === 'grant') {
        if (data.minGrantAmount !== null && data.maxGrantAmount !== null && data.minGrantAmount > data.maxGrantAmount) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('minAmountGreaterMaxAmount'),
            path: ['minGrantAmount'],
          });
        }
      } else if (data.type === 'residency') {
        if (data.minResidencyTime === null) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('residencyTimeRequired'),
            path: ['minResidencyTime'],
          });
        }
        if (data.maxResidencyTime === null) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('residencyTimeRequired'),
            path: ['maxResidencyTime'],
          });
        }
        if (
          data.minResidencyTime !== null &&
          data.maxResidencyTime !== null &&
          data.minResidencyTime > data.maxResidencyTime
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('minAmountGreaterMaxAmount'),
            path: ['minResidencyTime'],
          });
        }
      } else if (data.type === 'award') {
        if (data.minAwardAmount !== null && data.maxAwardAmount !== null && data.minAwardAmount > data.maxAwardAmount) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('minAmountGreaterMaxAmount'),
            path: ['minAwardAmount'],
          });
        }
      }
      if (data.minAge && data.maxAge && data.minAge > data.maxAge) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('minAmountGreaterMaxAmount'),
          path: ['minAge'],
        });
      }
    });

export type OpportunityFormInputValues = z.input<ReturnType<typeof opportunityFormSchema>>;
export type OpportunityFormOutputValues = z.output<ReturnType<typeof opportunityFormSchema>>;
export type OpportunityServerInput = Omit<OpportunityFormOutputValues, 'applicationDeadline' | 'responseDeadline'> & {
  applicationDeadline: string;
  responseDeadline: string | null;
};
