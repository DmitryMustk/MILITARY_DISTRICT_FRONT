import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { isUsernameAvailable } from '@/lib/user/registration';
import { isEmailRegistered } from '@/lib/user/queries';

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 30;

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_EMAIL_LENGTH = 255;

export const userPasswordFormSchema = (t: ReturnType<typeof useTranslations<'Zod.userPasswordFormSchema'>>) =>
  z
    .object({
      password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t('passwordMinLen', { minLen: MIN_PASSWORD_LENGTH }))
        .max(MAX_PASSWORD_LENGTH, t('passwordMaxLen', { maxLen: MAX_PASSWORD_LENGTH })),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

export type UserPasswordFormValues = z.infer<ReturnType<typeof userPasswordFormSchema>>;

export const userRegistrationFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.providerRegistrationFormSchema'>>
) =>
  z
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
    .superRefine(async (data, ctx) => {
      const isAvailable = await isUsernameAvailable(data.username);
      if (!isAvailable) {
        ctx.addIssue({
          code: 'custom',
          message: t('usernameUnique'),
          path: ['username'],
        });
      }
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(`passwordsDoNotMatch`),
      path: ['confirmPassword'],
    });

export type UserRegistrationFormValues = z.infer<ReturnType<typeof userRegistrationFormSchema>>;

export const forgotPasswordFormSchema = (t: ReturnType<typeof useTranslations<'Zod.forgotPasswordFormSchema'>>) =>
  z
    .object({
      email: z
        .string()
        .email(t('emailInvalid'))
        .min(1, t('emailRequired'))
        .max(MAX_EMAIL_LENGTH, t(`emailMaxLen`, { maxLen: MAX_EMAIL_LENGTH })),
    })
    .superRefine(async (data, ctx) => {
      const exists = await isEmailRegistered(data.email);
      if (!exists) {
        ctx.addIssue({
          code: 'custom',
          message: t('emailNotRegistered'),
          path: ['email'],
        });
      }
    });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof forgotPasswordFormSchema>>;

export const updateEmailFormSchema = (t: ReturnType<typeof useTranslations<'Zod.updateEmailSchema'>>) =>
  z
    .object({
      email: z
        .string()
        .email(t('emailInvalid'))
        .min(1, t('emailRequired'))
        .max(MAX_EMAIL_LENGTH, t(`emailMaxLen`, { maxLen: MAX_EMAIL_LENGTH })),
    })
    .superRefine(async (data, ctx) => {
      const isRegistered = await isEmailRegistered(data.email);
      if (isRegistered) {
        ctx.addIssue({
          code: 'custom',
          message: t('emailBusy'),
          path: ['email'],
        });
      }
    });

export type UpdateEmailFormValues = z.infer<ReturnType<typeof updateEmailFormSchema>>;
