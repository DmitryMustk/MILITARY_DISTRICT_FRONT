export function downloadUrl(id: string, forceAsAttchment?: boolean) {
  if (process.env.NEXT_PUBLIC_FILE_STORAGE === 's3') {
    const slashIndex = id.indexOf('/');
    const uuid = id.substring(0, slashIndex);
    const encodedFilename = encodeURIComponent(id.substring(slashIndex + 1));
    return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL_PREFIX!}${uuid}/${encodedFilename}`;
  } else {
    return `/api/download?id=${id}` + (forceAsAttchment ? `&mode=attachment` : '');
  }
}

export function getIdFromDownloadUrl(uri: string) {
  if (process.env.NEXT_PUBLIC_FILE_STORAGE === 's3') {
    const l = process.env.NEXT_PUBLIC_S3_PUBLIC_URL_PREFIX!.length;
    return uri.substring(l);
  } else {
    const theUrl = new URL(uri, 'http://doesnotmatter.com');
    return theUrl.searchParams.get('id');
  }
}
