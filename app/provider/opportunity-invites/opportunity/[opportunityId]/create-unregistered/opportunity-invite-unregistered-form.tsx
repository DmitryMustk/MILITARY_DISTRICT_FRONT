'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { unregisteredArtistInviteFormSchema, UnregisteredArtistInviteFormValues } from '@/lib/opportunity/invite/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useState, useTransition } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { OpportunityInviteUnregisteredArtistCard } from './opportunity-invite-unregistered-artist-card';
import { createOpportunityInvitesUnregistered } from '@/lib/opportunity/invite/actions';
import { useToast } from '@/hooks/use-toast';

type Stage = 'first' | 'second';

interface OpportunityInviteUnregisteredFormProps {
  opportunityId: number;
}

export const OpportunityInviteUnregisteredForm = ({ opportunityId }: OpportunityInviteUnregisteredFormProps) => {
  const [stage, setStage] = useState<Stage>('first');
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string>();

  const zodTranslations = useTranslations('Zod.unregisteredArtistInviteFormSchema');
  const form = useForm<UnregisteredArtistInviteFormValues>({
    resolver: zodResolver(unregisteredArtistInviteFormSchema(zodTranslations)),
    defaultValues: {
      message: '',
      subject: '',
      invites: [],
    },
    mode: 'onChange',
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'invites',
  });

  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.OpportunityInviteUnregisteredArtistForm');

  const handleChange = useCallback(
    (value: FormEvent<HTMLInputElement>, idx: number) => {
      update(idx, { email: value.currentTarget.value, message: fields[idx].message, subject: fields[idx].subject });
      form.trigger('invites');
    },
    [update, fields, form]
  );

  const handleSubmit = useCallback(
    async (values: UnregisteredArtistInviteFormValues) => {
      startTransition(async () => {
        const res = await createOpportunityInvitesUnregistered(values, opportunityId);
        setError(res.error);
        if (res.success) {
          toast({ title: t('invitesSent') });
          router.push(`/provider/opportunity-invites/opportunity/${opportunityId}`);
        } else {
          toast({ title: t('failedSend') });
        }
      });
    },
    [router, toast, t, opportunityId]
  );

  const handleClickAdd = useCallback(() => {
    append({ email: '', message: '', subject: '' });
  }, [append]);

  const handleNextStep = useCallback(() => setStage('second'), []);

  const handlePrevStep = useCallback(() => setStage('first'), []);

  const handleRemove = useCallback(
    (idx: number) => {
      if (fields.length === 0) {
        setStage('first');
      }
      remove(idx);
    },
    [remove, setStage, fields.length]
  );

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <>
          {stage === 'first' && (
            <div>
              <FormLabel className="block mb-1">{t('invites')}</FormLabel>
              {fields.map((_, idx) => (
                <FormField
                  control={form.control}
                  key={idx}
                  name={`invites.${idx}.email`}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormControl>
                        <Input
                          {...field}
                          onChangeCapture={(val) => handleChange(val, idx)}
                          onClear={() => handleRemove(idx)}
                        />
                      </FormControl>
                      <FormMessage className="capitalize" />
                    </FormItem>
                  )}
                />
              ))}
              <Button onClick={handleClickAdd} variant="outline">
                {t('addInvite')}
              </Button>
            </div>
          )}
          {stage === 'second' && (
            <>
              <div>
                <FormLabel>{t('invites')}</FormLabel>
                <div className="space-y-2">
                  {fields.map((_, idx) => (
                    <OpportunityInviteUnregisteredArtistCard
                      key={idx}
                      email={form.getValues(`invites.${idx}.email`)}
                      idx={idx}
                      {...form}
                    />
                  ))}
                </div>
              </div>
              <FormFieldTextarea label={t('generalMessage')} control={form.control} name="message" />
              <FormFieldInput label={t('generalSubject')} control={form.control} name="subject" />
            </>
          )}
        </>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <div className="flex gap-4 justify-between !mt-10">
          {stage === 'first' && (
            <>
              <Button size="lg" variant="outline" disabled={pending}>
                <Link href={'/provider/opportunities'}>{t('cancel')}</Link>
              </Button>
              <Button size="lg" disabled={pending || !form.formState.isValid} onClick={handleNextStep}>
                {t('next')}
              </Button>
            </>
          )}
          {stage === 'second' && (
            <>
              <Button
                size="lg"
                variant="outline"
                disabled={pending || !form.formState.isValid}
                onClick={handlePrevStep}
              >
                {t('prev')}
              </Button>
              <Button size="lg" type="submit" disabled={pending || !form.formState.isValid}>
                {t('send')}
              </Button>
            </>
          )}
        </div>
      </Form>
    </FormProvider>
  );
};
