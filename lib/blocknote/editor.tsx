'use client'; // this registers <Editor> as a Client Component
//from https://www.blocknotejs.org/docs/advanced/nextjs

import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { Block, BlockNoteEditor } from '@blocknote/core';
import { useCallback, useEffect } from 'react';
import { uploadFiles } from '@/components/mongo/utils';
import { downloadUrl } from '@/lib/mongo/download-url';

type Prp = {
  initialContent: Block[] | undefined;
  setContent: (content: Block[]) => void;
  setEditor?: (editor: BlockNoteEditor) => void;
  groupId: string;
};

// Our <Editor> component we can reuse later
export default function Editor({ initialContent, setContent, setEditor, groupId }: Prp) {
  const uploadFile = useCallback(
    async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(file);

        uploadFiles(
          {
            onBadStatus: (status) => {
              reject(status);
            },
            onError: (err) => {
              reject(err);
            },
            onSuccess: (id) => {
              resolve(downloadUrl(id));
            },
            groupId,
          },
          dataTransfer.files
        );
      });
    },
    [groupId]
  );

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent,
    uploadFile,
  });

  useEffect(() => {
    if (setEditor) setEditor(editor);
  }, [editor, setEditor]);

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      theme="light"
      editor={editor}
      onChange={() => {
        setContent(editor.document);
      }}
    />
  );
}
