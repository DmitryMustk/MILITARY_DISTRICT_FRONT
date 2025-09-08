import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';

interface GuideLinkProps {
  title: string;
  fileUrl: string;
}

export const GuideLink: React.FC<GuideLinkProps> = ({ title, fileUrl }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-primary rounded-none">
      <span className="text-lg font-medium truncate">{title}</span>
      <Button asChild variant="outline" className="w-10 h-10">
        <Link href={fileUrl} download target="_blank">
          <DownloadIcon />
        </Link>
      </Button>
    </div>
  );
};
