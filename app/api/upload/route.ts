'use server';
import { fileUpload } from '@/lib/files/file-upload';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);

  const groupId = req.nextUrl.searchParams.get('groupId');

  const file = (body.file as File) || null;

  if (file) {
    const fileSizeMb = file.size / (1024 * 1024);
    const maxFileSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB!);
    if (fileSizeMb >= maxFileSizeMb) {
      return NextResponse.json({
        success: false,
        message: `File size is too big. Maximum file size allowed is ${maxFileSizeMb} MB.`,
      });
    }
    try {
      const { id, thumbnailId } = await fileUpload(file, { groupId });
      return NextResponse.json({
        success: true,
        fileName: file.name,
        id,
        fileType: file.type,
        thumbnailId,
      });
    } catch (e) {
      return NextResponse.json({
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (e as any).message,
      });
    }
  } else {
    return NextResponse.json({
      success: false,
      message: 'File not found',
    });
  }
};
