/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   ROOT LAYOUT - App shell with theme, nav & footer   ###
   ###   Includes SEO metadata and font configuration       ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

/* ###########################################################
   ###   1. Font Configuration                              ###
   ########################################################### */

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500'],
});

/* ###########################################################
   ###   2. SEO Metadata Configuration                      ###
   ########################################################### */

export const metadata: Metadata = {
  title: 'Antony O\'Neill | Full-Stack Developer',
  description:
    'Full-stack developer focused on shipping clean, fast, reliable web products. Next.js, React, TypeScript.',
  metadataBase: new URL('https://aoneill.co.uk'),
  keywords: [
    'Full-Stack Developer',
    'Next.js',
    'React',
    'TypeScript',
    'Web Development',
    'Freelance Developer',
    'UK Developer',
  ],
  authors: [{ name: 'Antony O\'Neill' }],
  creator: 'Antony O\'Neill',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/images/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://aoneill.co.uk',
    siteName: 'Antony O\'Neill',
    title: 'Antony O\'Neill | Full-Stack Developer',
    description:
      'Full-stack developer focused on shipping clean, fast, reliable web products.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Antony O\'Neill - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antony O\'Neill | Full-Stack Developer',
    description:
      'Full-stack developer focused on shipping clean, fast, reliable web products.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ###########################################################
   ###   3. Root Layout Component                           ###
   ########################################################### */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Theme flash prevention - applies theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

/* ###########################################################
   ###           END OF ROOT LAYOUT                         ###
   ########################################################### */
