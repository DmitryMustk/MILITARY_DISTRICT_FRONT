import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UnregisteredArtistInviteFormValues } from '@/lib/opportunity/invite/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const OpportunityInviteUnregisteredArtistCard = (
  props: ReturnType<typeof useForm<UnregisteredArtistInviteFormValues>> & { email: string; idx: number }
) => {
  const t = useTranslations('Component.OpportunityInviteUnregisteredArtistCard');
  const [customMessage, setCustomMessage] = useState<CheckedState>(false);
  const [customSubject, setCustomSubject] = useState<CheckedState>(false);

  const checkboxMessageId = useMemo(() => `message-${props.email}`, [props.email]);
  const checkboxSubjectId = useMemo(() => `subject-${props.email}`, [props.email]);

  const handleCheckedChangeMessage = useCallback(
    (value: CheckedState, onChange: (event: string) => void) => {
      setCustomMessage(value);
      onChange('');
    },
    [setCustomMessage]
  );

  const handleCheckedChangeSubject = useCallback(
    (value: CheckedState, onChange: (event: string) => void) => {
      setCustomSubject(value);
      onChange('');
    },
    [setCustomSubject]
  );

  return (
    <Card>
      <CardHeader>
        <FormLabel>{props.email}</FormLabel>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={props.control}
          name={`invites.${props.idx}.message`}
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={checkboxMessageId}
                  checked={customMessage}
                  onCheckedChange={(value) => handleCheckedChangeMessage(value, field.onChange)}
                />
                <Label htmlFor={checkboxMessageId}>{t('customMessage')}</Label>
              </div>
              {customMessage && (
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={props.control}
          name={`invites.${props.idx}.subject`}
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={checkboxSubjectId}
                  checked={customSubject}
                  onCheckedChange={(value) => handleCheckedChangeSubject(value, field.onChange)}
                />
                <Label htmlFor={checkboxSubjectId}>{t('customSubject')}</Label>
              </div>
              {customSubject && (
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </CardContent>
    </Card>
  );
};
