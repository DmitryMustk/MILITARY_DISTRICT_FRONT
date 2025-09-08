'use client';

import { FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { downloadUrl } from '@/lib/mongo/download-url';
import { Button } from '@/components/ui/button';
import { DeleteIcon, DownloadIcon } from 'lucide-react';
import UploadFile from '@/components/mongo/upload-file';
import React, { useCallback, useMemo } from 'react';
import { FieldArrayWithId, Control, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getSelectOptionsFromEnumTranslated, isAttachmentImage } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import MultipleSelector, { Option } from '../ui/multi-select';
import { AttachmentWithType } from '@/lib/types';
import { AttachmentType } from '@/lib/enums/AttachmentType';
import Link from 'next/link';

export const FormFieldsAttachments = ({
  title,
  buttonTitle,
  fields,
  control,
  onSuccess,
  onRemove,
  fieldName,
  maxHeight,
  attachmentTypeSelector,
}: {
  title: string;
  buttonTitle: string;
  fields: FieldArrayWithId[];
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  onSuccess: (id: string, fileName: string, fileType: string, thumbnailId?: string) => void;
  onRemove: (id: string) => void;
  maxHeight?: number;
  attachmentTypeSelector?: boolean;
}) => {
  const { toast } = useToast();
  const t = useTranslations('Component.FormFieldsAttachments');
  const tAttachmentType = useTranslations('Enum.AttachmentType');
  const attachmentTypeOptions = useMemo(
    () => getSelectOptionsFromEnumTranslated(AttachmentType, tAttachmentType),
    [tAttachmentType]
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

  const getAttachmentType = useCallback(
    (type?: string) => {
      if (!type) {
        return [
          {
            value: AttachmentType.not_specified,
            label: tAttachmentType(AttachmentType.not_specified),
          },
        ];
      }
      return [
        {
          value: type,
          label: Object.keys(AttachmentType).includes(type)
            ? tAttachmentType(AttachmentType[type as keyof typeof AttachmentType])
            : type,
        },
      ];
    },
    [tAttachmentType]
  );

  const handleChange = useCallback((field: ControllerRenderProps<FieldValues, string>, option: Option[]) => {
    field.onChange({
      ...field.value,
      attachmentType:
        option.length > 1 && option[1].value !== AttachmentType.not_specified ? option[1].value : undefined,
    });
  }, []);

  return (
    <div className="space-y-2">
      <FormLabel>{title}</FormLabel>
      <ul className="list-disc flex flex-col gap-2">
        {fields.map((field, idx) => (
          <FormField
            control={control}
            key={field.id}
            name={`${fieldName ?? 'attachments'}.${idx}.value`}
            render={({ field: formField }) => (
              <li className="flex flex-col gap-1">
                {attachmentTypeSelector && !isAttachmentImage(formField.value.fileType) && (
                  <MultipleSelector
                    creatable
                    options={attachmentTypeOptions}
                    placeholder={t('attachmentType')}
                    value={getAttachmentType(formField.value.attachmentType)}
                    hideClearAllButton
                    hidePlaceholderWhenSelected
                    onChange={(option) => handleChange(formField, option)}
                  />
                )}
                <AttachmentView
                  fileName={formField.value.fileName}
                  fileType={formField.value.fileType}
                  id={formField.value.id}
                  onRemove={() => onRemove(formField.value.id)}
                  maxHeight={maxHeight ?? 200}
                />
                <FormMessage />
              </li>
            )}
          />
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <FormLabel>{buttonTitle}</FormLabel>
        <UploadFile
          onBadStatus={onUploadError}
          onError={onUploadFatal}
          onSuccess={(id, fileName, fileType, thumbnailId) => onSuccess(id, fileName, fileType, thumbnailId)}
        />
      </div>
    </div>
  );
};

export const FormFieldAttachment = ({
  title,
  buttonTitle,
  name,
  control,
  onSuccess,
  onRemove,
  accept,
  maxHeight,
}: {
  title: string;
  buttonTitle: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  onSuccess: (id: string, fileName: string, fileType: string) => void;
  onRemove: () => void;
  accept?: string[];
  maxHeight?: number;
}) => {
  const { toast } = useToast();
  const t = useTranslations('Component.AttachmentImage');

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

  return (
    <div className="flex gap-y-2 flex-col">
      <FormLabel>{title}</FormLabel>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div>
            {field.value.value && (
              <AttachmentView
                fileName={field.value.value.fileName}
                fileType={field.value.value.fileType}
                id={field.value.value.id}
                onRemove={onRemove}
                maxHeight={maxHeight ?? 200}
              />
            )}
            <FormMessage />
          </div>
        )}
      />
      <div className="flex flex-col gap-2">
        <FormLabel>{buttonTitle}</FormLabel>
        <UploadFile
          onBadStatus={onUploadError}
          onError={onUploadFatal}
          onSuccess={(id, fileName, fileType) => onSuccess(id, fileName, fileType)}
          accept={accept}
        />
      </div>
    </div>
  );
};

export const AttachmentViewList = ({
  attachments,
  showAttachmentType,
}: {
  attachments: AttachmentWithType[];
  showAttachmentType?: boolean;
}) => {
  const t = useTranslations('Component.AttachmentViewList');
  return (
    <ul className="flex gap-y-2 flex-col">
      <strong>{t('attachments')}</strong>
      {attachments.map((a) => (
        <li key={a.value.id}>
          <AttachmentView
            fileName={a.value.fileName}
            fileType={a.value.fileType}
            attachmentType={showAttachmentType ? a.value.attachmentType : undefined}
            id={a.value.id}
            thumbnailId={a.value.thumbnailId}
            maxHeight={300}
          />
        </li>
      ))}
    </ul>
  );
};

export const AttachmentView = ({
  fileName,
  fileType,
  id,
  onRemove,
  maxHeight,
  attachmentType,
  thumbnailId,
}: {
  fileName: string;
  fileType: string;
  id: string;
  attachmentType?: string;
  thumbnailId?: string;
  onRemove?: () => void;
  maxHeight: number;
}) => {
  console.log('Thumbnail: ', thumbnailId);
  return (
    <div className="space-y-2">
      {isAttachmentImage(fileType) ? (
        <ImageAttachmentView
          fileName={fileName}
          downloadUrl={downloadUrl(id, true)}
          tnDownloadUrl={thumbnailId ? downloadUrl(thumbnailId, true) : ''}
          onRemove={onRemove}
          maxHeight={maxHeight}
        />
      ) : (
        <DefaultAttachmentView
          fileName={fileName}
          downloadUrl={downloadUrl(id, true)}
          onRemove={onRemove}
          attachmentType={attachmentType}
        />
      )}
    </div>
  );
};

interface DefaultAttachmentViewProps {
  fileName: string;
  downloadUrl: string;
  onRemove?: () => void;
  attachmentType?: string;
}

export const DefaultAttachmentView = ({
  fileName,
  downloadUrl,
  onRemove,
  attachmentType,
}: DefaultAttachmentViewProps) => {
  const tAttachmentType = useTranslations('Enum.AttachmentType');
  const type = useMemo(
    () =>
      attachmentType
        ? Object.keys(AttachmentType).includes(attachmentType)
          ? tAttachmentType(attachmentType as keyof typeof AttachmentType)
          : attachmentType
        : tAttachmentType(AttachmentType.not_specified),
    [attachmentType, tAttachmentType]
  );
  return (
    <div>
      <div className="flex items-center justify-between p-4 border border-primary rounded-none gap-1 h-[52px]">
        <span className="truncate">{fileName}</span>
        <div className="flex flex-row">
          <Button asChild variant="ghost" type="button" size="icon">
            <Link href={downloadUrl} download target="_blank">
              <DownloadIcon />
            </Link>
          </Button>
          {onRemove && (
            <Button
              type="button"
              onClick={() => {
                onRemove();
              }}
              variant="ghost"
              size="icon"
            >
              <DeleteIcon />
            </Button>
          )}
        </div>
      </div>
      {attachmentType && <p className="text-sm leading-4 text-neutral-gray truncate">{type}</p>}
    </div>
  );
};

interface ImageAttachmentViewProps {
  fileName: string;
  downloadUrl: string;
  tnDownloadUrl?: string;
  onRemove?: () => void;
  maxHeight: number;
}

export const ImageAttachmentView = ({
  fileName,
  downloadUrl,
  tnDownloadUrl,
  onRemove,
  maxHeight,
}: ImageAttachmentViewProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Dialog>
        <DialogTrigger>
          <Image
            className="rounded-2xl"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 'auto', height: 'auto', maxHeight: maxHeight }}
            alt={fileName}
            src={tnDownloadUrl ? tnDownloadUrl : downloadUrl}
          />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-fit overflow-y-auto">
          <DialogTitle className="mt-6 max-[50vw] truncate">{fileName}</DialogTitle>
          <Image
            className="rounded-2xl"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 'auto', height: 'auto', maxWidth: '90vw' }}
            alt={fileName}
            src={downloadUrl}
          />
        </DialogContent>
      </Dialog>

      {onRemove && (
        <Button
          type="button"
          size="icon"
          onClick={() => {
            onRemove();
          }}
          variant={'ghost'}
        >
          <DeleteIcon />
        </Button>
      )}
    </div>
  );
};
