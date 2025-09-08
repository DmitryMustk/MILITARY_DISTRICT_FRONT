import { MAX_EMAIL_LENGTH } from '@/lib/artist/types';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const MESSAGE_MAX_LEN = 255;
export const SUBJECT_MAX_LEN = 255;

export const unregisteredArtistInviteFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.unregisteredArtistInviteFormSchema'>>
) =>
  z.object({
    message: z.string().max(MESSAGE_MAX_LEN, t('messageMaxLen', { maxLen: MESSAGE_MAX_LEN })),
    subject: z.string().max(SUBJECT_MAX_LEN, t('subjectMaxLen', { maxLen: SUBJECT_MAX_LEN })),
    invites: z
      .array(
        z.object({
          email: z
            .string({ message: t('invalidEmail') })
            .email({ message: t('invalidEmail') })
            .max(MAX_EMAIL_LENGTH, t('emailMaxLen', { maxLen: MAX_EMAIL_LENGTH })),
          message: z.string().max(MESSAGE_MAX_LEN, t('messageMaxLen', { maxLen: MESSAGE_MAX_LEN })),
          subject: z.string().max(SUBJECT_MAX_LEN, t('subjectMaxLen', { maxLen: SUBJECT_MAX_LEN })),
        })
      )
      .nonempty(t('selectInvite'))
      .refine(
        (data) => {
          const emails = data.map((invite) => invite.email);
          return new Set(emails).size === emails.length;
        },
        { message: t('emailUnique') }
      ),
  });

export type UnregisteredArtistInviteFormValues = z.infer<ReturnType<typeof unregisteredArtistInviteFormSchema>>;
