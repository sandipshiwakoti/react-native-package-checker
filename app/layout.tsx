import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'React Native Package Checker',
  description: 'Check React Native packages for New Architecture compatibility',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
