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
import SeasonalParticles from '@/components/seasonal/SeasonalParticles';
import HalloweenEffects from '@/components/seasonal/HalloweenEffects';
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
  title: 'Antony O\'Neill | AI & ML Developer | Software Engineer',
  description:
    'Manchester-based software engineer specialising in AI, machine learning, and data-driven web applications. MSc AI student with 17 years engineering background. Building with Python, Next.js, and modern ML tools.',
  metadataBase: new URL('https://aoneill.co.uk'),
  keywords: [
    'AI Developer',
    'Machine Learning Engineer',
    'ML Engineer',
    'Data Science',
    'Software Engineer',
    'Python Developer',
    'Full-Stack Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript Developer',
    'Manchester Developer',
    'UK Developer',
    'Neural Networks',
    'Deep Learning',
    'Reinforcement Learning',
    'Data Engineering',
    'Web Application Development',
    'Supabase',
    'PostgreSQL',
    'API Development',
    'MSc AI',
    'Graduate Developer',
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
    title: 'Antony O\'Neill | AI & ML Developer | Software Engineer',
    description:
      'Manchester-based software engineer specialising in AI, machine learning, and data-driven applications. MSc AI student with engineering background.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Antony O\'Neill - AI & ML Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antony O\'Neill | AI & ML Developer | Software Engineer',
    description:
      'Manchester-based software engineer specialising in AI, machine learning, and data-driven applications. MSc AI student.',
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
        {/* Trusted Types policy for CSP compliance */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if (window.trustedTypes && trustedTypes.createPolicy) {
                trustedTypes.createPolicy('default', {
                  createHTML: (s) => s,
                  createScript: (s) => s,
                  createScriptURL: (s) => s,
                });
                trustedTypes.createPolicy('nextjs', {
                  createHTML: (s) => s,
                  createScript: (s) => s,
                  createScriptURL: (s) => s,
                });
                trustedTypes.createPolicy('nextjs#bundler', {
                  createHTML: (s) => s,
                  createScript: (s) => s,
                  createScriptURL: (s) => s,
                });
              }
            `,
          }}
        />
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
              jobTitle: 'Software Engineer',
              description: 'Manchester-based software engineer specialising in AI, machine learning, and data-driven web applications. MSc AI student with 17 years engineering background.',
              sameAs: [
                'https://github.com/W17ANT',
                'https://www.linkedin.com/in/antony-o-neill-96601a104/',
              ],
              knowsAbout: [
                'Machine Learning',
                'Artificial Intelligence',
                'Python',
                'Data Science',
                'Neural Networks',
                'Next.js',
                'React',
                'TypeScript',
                'PostgreSQL',
                'Supabase',
              ],
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'St Mary\'s University',
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
        {/* Console Easter Egg */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var font = 'font-family: monospace; font-size: 12px;';
                var cyan = 'color: #22d3ee; ' + font;
                var pink = 'color: #f472b6; ' + font;
                var purple = 'color: #c084fc; ' + font;
                var blue = 'color: #60a5fa; ' + font;
                var teal = 'color: #2dd4bf; ' + font;
                var green = 'color: #4ade80; ' + font;
                var yellow = 'color: #facc15; ' + font;
                var white = 'color: rgba(255,255,255,0.8); ' + font;
                var dim = 'color: rgba(255,255,255,0.6); ' + font;

                console.log(
                  '%c╔═══════════════════════════════════════════════════════════════╗\\n' +
                  '║                                                               ║\\n' +
                  '%c║   █████╗  ██████╗ ███╗   ██╗███████╗██╗██╗     ██╗            ║\\n' +
                  '%c║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║██║     ██║            ║\\n' +
                  '%c║  ███████║██║   ██║██╔██╗ ██║█████╗  ██║██║     ██║            ║\\n' +
                  '%c║  ██╔══██║██║   ██║██║╚██╗██║██╔══╝  ██║██║     ██║            ║\\n' +
                  '%c║  ██║  ██║╚██████╔╝██║ ╚████║███████╗██║███████╗███████╗       ║\\n' +
                  '%c║  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝╚══════╝       ║\\n' +
                  '%c║                                                               ║\\n' +
                  '%c║                 A. O N E I L L                                ║\\n' +
                  '%c║                                                               ║\\n' +
                  '╠═══════════════════════════════════════════════════════════════╣\\n' +
                  '║                                                               ║\\n' +
                  '%c║  AI & ML Developer | Software Engineer                         ║\\n' +
                  '║  Manchester, UK                                               ║\\n' +
                  '%c║                                                               ║\\n' +
                  '%c║  Built with: Next.js · Python · TypeScript · ML               ║\\n' +
                  '║  Focus: AI · Data · Performance · Systems                     ║\\n' +
                  '%c║                                                               ║\\n' +
                  '%c║  github.com/W17ANT                                            ║\\n' +
                  '%c║                                                               ║\\n' +
                  '╚═══════════════════════════════════════════════════════════════╝\\n\\n' +
                  '%c  Looking to hire? Let\\'s talk: Antony@aoneill.co.uk\\n',
                  cyan, pink, purple, blue, cyan, teal, green, cyan, yellow, cyan, white, cyan, dim, cyan, blue, cyan, green
                );

                console.log('%c👋 Thanks for checking out the console!', 'color: #60a5fa; font-weight: bold;');
              })();
            `,
          }}
        />
      </head>
      <body className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--accent)] focus:text-white focus:outline-none"
          >
            Skip to main content
          </a>
          {/* Seasonal decorations */}
          <SeasonalParticles />
          <HalloweenEffects />
          <Navbar />
          <div id="main-content">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

/* ###########################################################
   ###           END OF ROOT LAYOUT                         ###
   ########################################################### */
