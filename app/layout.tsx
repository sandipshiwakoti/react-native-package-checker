import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { Providers } from '@/app/providers';

// eslint-disable-next-line no-restricted-imports
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://react-native-package-checker.vercel.app'
      : 'http://localhost:3000'
  ),
  title: 'React Native Package Checker',
  description:
    'Analyze your React Native packages in bulk and discover their New Architecture compatibility. Check version compatibility, find updates, and export reports.',
  keywords: [
    'React Native',
    'package checker',
    'new architecture',
    'compatibility',
    'bulk analysis',
    'version checker',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://react-native-package-checker.vercel.app/',
    title: 'React Native Package Checker',
    description:
      'Analyze your React Native packages in bulk and discover their New Architecture compatibility',
    siteName: 'React Native Package Checker',
    images: [
      {
        url: '/assets/favicon/apple-touch-icon.png',
        width: 180,
        height: 180,
        alt: 'React Native Package Checker',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'React Native Package Checker',
    description:
      'Analyze your React Native packages in bulk and discover their New Architecture compatibility',
    images: ['/assets/favicon/apple-touch-icon.png'],
  },
  icons: {
    icon: [
      {
        url: '/assets/favicon/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/assets/favicon/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/assets/favicon/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense>
          <Providers>
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
