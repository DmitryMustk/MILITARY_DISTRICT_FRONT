'use client';

import { guideFormSchema, GuideFormValues } from '@/lib/content/guide/types';
import React, { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import { createGuide, updateGuide } from '@/lib/content/guide/action';
import { Form } from '@/components/ui/form';
import { FormFieldInput } from '@/components/ui/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormFieldAttachment } from '@/components/common/attachments';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ResourceType } from '@prisma/client';

interface GuideFormProps {
  guideId?: number;
  defaultValues: GuideFormValues;
}

export const GuideForm: React.FC<GuideFormProps> = ({ guideId, defaultValues }) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('Component.GuideForm');
  const zodTranslation = useTranslations('Zod.guideFormSchema');

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideFormSchema(zodTranslation)),
    defaultValues,
  });

  const [resourceType, setResourceType] = useState<CheckedState>(defaultValues.resourceType === ResourceType.LINK);

  const [pending, startTransition] = useTransition();

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setResourceType(checked);
      form.setValue('resourceType', checked ? ResourceType.LINK : ResourceType.FILE);
      form.resetField('file');
      form.resetField('link');
    },
    [form]
  );

  const handleCreateUpdateGuideAction = useCallback(
    async (values: GuideFormValues) => {
      const parsedValues = {
        ...values,
        order: Number(values.order),
      };

      startTransition(async () => {
        const guideIdResult = guideId ? await updateGuide(guideId, parsedValues) : await createGuide(parsedValues);
        if (guideIdResult) {
          toast({
            title: guideId ? t('guideUpdated') : t('guideCreated'),
          });
          router.push('/content/guides');
        } else {
          toast({
            title: t('errorTitle'),
            description: t('errorDesc'),
            variant: 'destructive',
          });
        }
      });
    },
    [toast, router, guideId, t]
  );

  const onSuccessFileUpload = useCallback(
    (id: string, fileName: string, fileType: string) => {
      form.setValue('file', { value: { id, fileName, fileType } });
    },
    [form]
  );

  const onRemoveFile = useCallback(() => {
    form.setValue('file', { value: null });
  }, [form]);

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(handleCreateUpdateGuideAction)} className="space-y-6">
        <FormFieldInput control={form.control} name="title" label={t('title')} />
        <FormFieldInput control={form.control} name="order" label={t('order')} type="number" />

        <div className="flex gap-2 items-center">
          <Checkbox checked={resourceType} onCheckedChange={handleCheckedChange} id="resource-type-checkbox" />
          <Label htmlFor="resource-type-checkbox">{t('useLinkInsteadOfFile')}</Label>
        </div>

        {resourceType ? (
          <FormFieldInput
            control={form.control}
            name="link"
            label={t('link')}
            placeholder="https://example.com/guide.pdf"
          />
        ) : (
          <div className="flex flex-col gap-2">
            <FormFieldAttachment
              title={t('file')}
              buttonTitle={t('uploadFile')}
              name="file"
              control={form.control}
              onSuccess={onSuccessFileUpload}
              onRemove={onRemoveFile}
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? t('saving') : guideId ? t('update') : t('create')}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/content/guides">{t('cancel')}</Link>
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};
