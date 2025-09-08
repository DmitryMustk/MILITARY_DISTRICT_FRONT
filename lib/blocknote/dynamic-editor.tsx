'use client';
//From https://www.blocknotejs.org/docs/advanced/nextjs

import dynamic from 'next/dynamic';

export const Editor = dynamic(() => import('./editor'), { ssr: false });
