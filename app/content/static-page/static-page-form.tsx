'use client';

import { Block, BlockNoteEditor } from '@blocknote/core';
import { staticPageFormSchema, StaticPageFormValues } from '@/lib/content/static-page/types';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FormFieldInput } from '@/components/ui/form-field';
import { createStaticPage, deleteStaticPage, updateStaticPage } from '@/lib/content/static-page/action';
import Editor from '@/lib/blocknote/editor';
import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ExistingStaticPage = {
  blocks: Block[];
  id: number;
  uuid: string;
  slug: string;
  title?: string;
  order?: number;
};

type Prp = {
  defaultValues: StaticPageFormValues;
  existingPage?: ExistingStaticPage;
};

export const StaticPageForm: React.FC<Prp> = ({ defaultValues, existingPage }) => {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('Component.StaticPageForm');
  const zodTranslations = useTranslations('Zod.staticPageFormSchema');

  const [text, setText] = useState<Block[] | undefined>(existingPage?.blocks);
  const [editor, setEditor] = useState<BlockNoteEditor>();

  const uuid = useMemo(() => {
    return existingPage ? existingPage.uuid : crypto.randomUUID();
  }, [existingPage]);

  const form = useForm<StaticPageFormValues>({
    resolver: zodResolver(staticPageFormSchema(zodTranslations, existingPage?.id)),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    async (values: StaticPageFormValues) => {
      const parsedValues = {
        ...values,
        order: Number(values.order),
      };

      startTransition(async () => {
        const html = text ? await editor?.blocksToFullHTML(text) : '';
        if (existingPage) {
          await updateStaticPage(parsedValues, existingPage.id, text, html);
          redirect('/content/static-page');
        } else {
          const id = await createStaticPage(parsedValues, uuid, text, html);
          redirect(`/content/static-page/edit/${id}`);
        }
      });
    },
    [editor, existingPage, text, uuid]
  );

  const doDelete = useCallback(() => {
    if (existingPage) {
      startTransition(async () => {
        await deleteStaticPage(existingPage.id);
        redirect('/content/static-page');
      });
    }
  }, [existingPage]);

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-full w-full">
        <div className="flex gap-8 flex-col md:flex-row">
          <div className="flex flex-col gap-4 min-w-[400px]">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('slug')}</FormLabel>
                  <FormFieldInput {...field} />
                  <p className="text-sm text-muted-foreground truncate">
                    {t('fullUrl')}: /page/{field.value || ''}
                  </p>
                </FormItem>
              )}
            />
            <FormFieldInput
              control={form.control}
              name="title"
              label={t('menuTitle')}
              description={t('menuTitleDesc')}
            />
            <FormFieldInput control={form.control} name="order" label={t('order')} type="number" />
          </div>
        </div>
        <FormItem>
          <FormLabel>{t('content')}</FormLabel>
          <div className="border border-primary rounded-lg min-h-32 py-4">
            <Editor initialContent={text} setContent={setText} setEditor={setEditor} groupId={uuid} />
          </div>
        </FormItem>
        <div className="flex gap-4 mt-4">
          <Button type="submit" disabled={pending}>
            {existingPage ? t('save') : t('submit')}
          </Button>
          {existingPage && (
            <ButtonWithConfirmation
              cancelLabel={t('deleteCancel')}
              confirmLabel={t('deleteConfirm')}
              label={t('deleteLabel')}
              disabled={pending}
              onClick={doDelete}
            />
          )}
          <Button variant="secondary" asChild>
            <Link href="/content/static-page">{t('goBack')}</Link>
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};
