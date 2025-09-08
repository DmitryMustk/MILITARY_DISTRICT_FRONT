import { downloadUrl } from '@/lib/mongo/download-url';
import Image from 'next/image';

type Prp = {
  imageId: string;
  width?: number;
  height?: number;
};

export function NewsImage({ imageId, width = 384, height = 220 }: Prp) {
  return (
    <Image
      width={width}
      height={height}
      className="object-cover"
      style={{ height: `${height}px`, width: `${width}px` }}
      src={downloadUrl(imageId)}
      alt={imageId}
    />
  );
}
