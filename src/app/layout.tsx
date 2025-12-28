/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   ROOT LAYOUT - App shell with theme, nav & footer   ###
   ###   Includes SEO metadata and font configuration       ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Snowfall from '@/components/seasonal/Snowfall';
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
  title: 'Antony O\'Neill | Full-Stack Developer & Software Engineer',
  description:
    'Manchester-based full-stack developer specialising in Next.js, React, and TypeScript. Building fast, accessible, production-ready web applications. Available for freelance projects and collaborations.',
  metadataBase: new URL('https://aoneill.co.uk'),
  keywords: [
    'Full-Stack Developer',
    'Software Engineer',
    'Web Developer',
    'Frontend Developer',
    'Backend Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript Developer',
    'JavaScript Developer',
    'Node.js Developer',
    'Freelance Developer',
    'Freelance Web Developer UK',
    'Manchester Developer',
    'UK Developer',
    'Web Development',
    'Web Application Development',
    'E-commerce Development',
    'Responsive Web Design',
    'UI/UX Development',
    'API Development',
    'Supabase',
    'Tailwind CSS',
    'Portfolio',
    'Hire Developer',
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
    title: 'Antony O\'Neill | Full-Stack Developer & Software Engineer',
    description:
      'Manchester-based full-stack developer specialising in Next.js, React, and TypeScript. Building fast, accessible, production-ready web applications.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Antony O\'Neill - Full-Stack Developer & Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antony O\'Neill | Full-Stack Developer & Software Engineer',
    description:
      'Manchester-based full-stack developer specialising in Next.js, React, and TypeScript. Building production-ready web applications.',
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://aoneill.co.uk',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ###########################################################
   ###   3. Root Layout Component                           ###
   ########################################################### */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from middleware for CSP
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* JSON-LD Structured Data for Person */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Antony O\'Neill',
              url: 'https://aoneill.co.uk',
              image: 'https://aoneill.co.uk/images/og-image.png',
              jobTitle: 'Full-Stack Developer',
              description: 'Manchester-based full-stack developer specialising in Next.js, React, and TypeScript.',
              sameAs: [
                'https://github.com/aoneillmark',
                'https://www.linkedin.com/in/antony-o-neill-96601a104/',
              ],
              knowsAbout: [
                'Next.js',
                'React',
                'TypeScript',
                'JavaScript',
                'Node.js',
                'Web Development',
                'E-commerce',
                'Supabase',
                'Tailwind CSS',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
              },
            }),
          }}
        />
        {/* Theme flash prevention - applies theme before paint */}
        <script
          nonce={nonce}
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
          <Snowfall />
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
