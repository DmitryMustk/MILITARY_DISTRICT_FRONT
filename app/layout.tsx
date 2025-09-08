import './globals.css';
import { Archivo, Archivo_Narrow } from 'next/font/google';
import type { Metadata } from 'next';
import React from 'react';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Footer } from '@/components/layout/footer';

const archivo = Archivo({
  subsets: ['latin'],
});
const archivoVariable = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
});
const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  variable: '--font-archivo-narrow',
});

export const metadata: Metadata = {
  title: 'Artist Opportunities',
  description: 'Access grants and non-monetary opportunities for artists',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${archivo.className} flex flex-col min-h-screen overflow-y-scroll ${archivoNarrow.variable} ${archivoVariable.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="w-full max-sm:px-2 mx-auto flex-grow max-w-[1400px] min-h-[calc(100vh-200px)] mb-2">
            {children}
          </main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
