import { ProjectFormValues } from '@/lib/project/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface TagsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const Tags = ({ form }: TagsProps) => {
  const t = useTranslations('Component.Tags');
  const tagField = useFieldArray({
    control: form.control,
    name: 'tags',
  });

  const handleClickAdd = useCallback(() => {
    tagField.append({ value: '' });
  }, [tagField]);

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>{t('tags')}</FormLabel>
      {tagField.fields.map((_, idx) => (
        <FormField
          control={form.control}
          key={idx}
          name={`tags.${idx}.value`}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-3">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <Button onClick={() => tagField.remove(idx)} variant="destructive">
                  {t('delete')}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <div>
        <Button onClick={handleClickAdd}>{t('addTag')}</Button>
      </div>
    </div>
  );
};
