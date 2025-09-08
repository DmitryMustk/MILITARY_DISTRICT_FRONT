'use client';

import { Button } from '@/components/ui/button';
import { Form, FormErrorMessage, FormFooter } from '@/components/ui/form';
import { FormFieldInput } from '@/components/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { PropsWithChildren, useCallback, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ArtistInvitationFormValues, artistInvitationSchema } from '@/lib/artist/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { inviteArtist } from '@/lib/artist/invitation/action';

interface ArtistInvitationFormProps extends PropsWithChildren {
  onInvite(): void;
}

export const ArtistInvitationForm: React.FC<ArtistInvitationFormProps> = ({ onInvite, children }) => {
  const { toast } = useToast();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.ArtistInvitationForm');

  const handleSubmit = useCallback(
    async (values: ArtistInvitationFormValues) => {
      startTransition(async () => {
        const result = await inviteArtist(values);
        if (result.success) {
          onInvite();

          toast({
            title: t('inviteSent'),
            description: t('inviteSentDesc'),
          });
        }

        setError(result.error);
      });
    },
    [onInvite, toast, t]
  );

  const zodTranslations = useTranslations('Zod.artistInvitationSchema');
  const form = useForm<ArtistInvitationFormValues>({
    resolver: zodResolver(artistInvitationSchema(zodTranslations)),
    defaultValues: { email: '' },
  });

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldInput control={form.control} name="email" label={t('email')} />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <FormFooter>
          <Button type="submit" disabled={pending}>
            {pending ? t('sending') : t('sendInvitation')}
          </Button>
          {children}
        </FormFooter>
      </Form>
    </FormProvider>
  );
};
