'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';

export function BackButton({ children = 'back', className, size, variant }: ButtonProps) {
  const router = useRouter();

  return (
    <Button className={className} size={size} variant={variant} onClick={() => router.back()}>
      {children}
    </Button>
  );
}
