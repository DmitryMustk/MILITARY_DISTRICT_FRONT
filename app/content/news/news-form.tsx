'use client';

import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFieldCheckbox, FormFieldInput, FormFieldTextarea } from '@/components/ui/form-field';
import Link from 'next/link';
import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import { redirect } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { newsFormSchema, NewsFormValues } from '@/lib/content/types';
import UploadFile from '@/components/mongo/upload-file';
import { createNews, deleteNews, updateNews } from '@/lib/content/news';
import { Block, BlockNoteEditor } from '@blocknote/core';
import { Editor } from '@/lib/blocknote/dynamic-editor';
import { CalendarButton } from '@/components/common/calendar-button';
import { NewsImage } from '@/components/news/news-image';

type ExistingNews = {
  content: Block[];
  newsId: number;
  uuid: string;
};

type Prp = {
  defaultValues: NewsFormValues;
  existingNews?: ExistingNews;
};

const NewsForm: React.FC<Prp> = ({ defaultValues, existingNews }) => {
  const { toast } = useToast();

  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.NewsForm');

  const [text, setText] = useState<Block[] | undefined>(existingNews?.content);
  const [editor, setEditor] = useState<BlockNoteEditor>();

  const zodTranslations = useTranslations('Zod.newsFormSchema');

  const uuid = useMemo(() => {
    if (existingNews) {
      return existingNews.uuid;
    } else {
      return crypto.randomUUID();
    }
  }, [existingNews]);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema(zodTranslations)),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (values: NewsFormValues) => {
      startTransition(async () => {
        const html = text ? await editor?.blocksToFullHTML(text) : '';

        if (existingNews) {
          await updateNews(values, existingNews.newsId, text, html);

          redirect(`/content/news`);
        } else {
          const id = await createNews(values, uuid, text, html);

          redirect(`/content/news/edit/${id}`);
        }
      });
    },
    [editor, existingNews, text, uuid]
  );

  const onUploadError = useCallback(
    (status: number) => {
      if (status === 403) {
        toast({
          title: t('securityIssue'),
          description: t('securityIssueDesc'),
          variant: 'destructive',
        });
      } else {
        toast({ title: t('failedUpload'), description: t('failedUploadDesc'), variant: 'destructive' });
      }
    },
    [toast, t]
  );

  const onUploadFatal = useCallback(
    (msg: string) => {
      toast({ title: t('fatalUpload'), description: t('fatalUploadDesc', { msg: msg }), variant: 'destructive' });
    },
    [toast, t]
  );

  const doDelete = useCallback(async () => {
    if (existingNews) {
      startTransition(async () => {
        await deleteNews(existingNews.newsId);
        redirect('/content/news');
      });
    }
  }, [existingNews]);

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-full w-full mx-0">
        <FormFieldInput control={form.control} name="title" label={t('title')} />

        <FormFieldTextarea
          control={form.control}
          name={'description'}
          label={t('description')}
          maxLength={1024}
          rows={4}
        />

        <FormItem>
          <FormLabel>{t('text')}</FormLabel>
          <div className="border border-primary min-h-32 py-4">
            <Editor initialContent={text} setContent={setText} setEditor={setEditor} groupId={uuid} />
          </div>
        </FormItem>

        <div className="flex gap-12">
          <FormField
            control={form.control}
            name="mainPictureId"
            render={({ field }) => (
              <FormItem className="flex gap-2 flex-col w-96">
                <FormLabel>{t('mainImage')}</FormLabel>
                {field.value && (
                  <>
                    <NewsImage imageId={field.value} />
                    <ButtonWithConfirmation
                      onClick={() => {
                        field.onChange('');
                      }}
                      variant={'destructive'}
                      cancelLabel={t('deleteCancel')}
                      confirmLabel={t('deleteConfirm')}
                      label={t('deleteLabel')}
                    />
                  </>
                )}
                <UploadFile
                  groupId={uuid}
                  accept={['image/*']}
                  onBadStatus={onUploadError}
                  onSuccess={(id) => {
                    field.onChange(id);
                  }}
                  onError={onUploadFatal}
                />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>{t('createdAt')}</FormLabel>
                  <CalendarButton date={field.value} onSelect={field.onChange} required />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormFieldCheckbox
              control={form.control}
              name="showAtNewsPage"
              label={t('showAtNewsPage')}
              description={t('showAtNewsPageDescr')}
            />
            <FormFieldCheckbox
              control={form.control}
              name="showAtHomePage"
              label={t('showAtHomePage')}
              description={t('showAtNomePageDescr')}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" variant="outline" asChild>
            <Link href="/content/news">{t('goBack')}</Link>
          </Button>

          {existingNews && (
            <ButtonWithConfirmation
              className="bg-destructive"
              size="lg"
              cancelLabel={t('deleteCancel')}
              confirmLabel={t('deleteConfirm')}
              label={t('deleteLabel')}
              disabled={pending}
              onClick={doDelete}
            />
          )}

          <Button size="lg" type="submit" disabled={pending}>
            {existingNews ? t('save') : t('submit')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default NewsForm;
