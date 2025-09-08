export type UploadPrp = {
  onBadStatus: (status: number) => void;
  onError: (msg: string) => void;
  onSuccess: (id: string, fileName: string, fileType: string, thumbnailId?: string) => void;
  accept?: string[];
  groupId?: string;
};

const UPLOAD_URI = '/api/upload';

export async function uploadFiles({ onBadStatus, onError, onSuccess, groupId }: UploadPrp, files: FileList) {
  const formData = new FormData();

  Object.values(files).forEach((file) => {
    formData.append('file', file);
  });

  const response = await fetch(UPLOAD_URI + (groupId ? `?groupId=${groupId}` : ''), {
    method: 'POST',
    body: formData,
  });

  if (response.status !== 200) {
    onBadStatus(response.status);
  } else {
    const result = await response.json();
    if (result.success) {
      onSuccess(result.id, result.fileName, result.fileType, result.thumbnailId);
    } else {
      onError(result.message);
    }
  }
}
