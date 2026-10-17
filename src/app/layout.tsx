/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   ROOT LAYOUT - App shell with theme, nav & footer   ###
   ###   Includes SEO metadata and font configuration       ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { IBM_Plex_Sans, JetBrains_Mono, Sora } from 'next/font/google';
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

const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

/* ###########################################################
   ###   2. SEO Metadata Configuration                      ###
   ########################################################### */

// Why: www is the canonical host. The apex 307-redirects to www, so every
// absolute URL (metadataBase, JSON-LD, OG images) points at www directly.
const SITE_URL = 'https://www.aoneill.co.uk';

const DEFAULT_TITLE = 'Antony O\'Neill | ML & Software Engineer | Manchester, UK';
const DEFAULT_DESCRIPTION =
  'ML & Software Engineer in Manchester, UK. MSc Computer Science & AI student with 17 years in mechanical engineering, building production web applications and machine learning experiments.';

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    'ML Engineer',
    'Machine Learning Engineer',
    'Software Engineer',
    'Data Science',
    'Python',
    'Next.js',
    'TypeScript',
    'Manchester',
    'UK',
    'MSc AI',
    'Graduate ML Engineer',
  ],
  authors: [{ name: 'Antony O\'Neill', url: SITE_URL }],
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
  // Why: openGraph and twitter deliberately carry no title or description.
  // Next fills both from each page's own title/description, so share cards
  // differ per page instead of every page repeating the homepage's text.
  // A page that defines its own openGraph replaces this object entirely.
  //
  // Why no og:url or canonical here: anything set in the root layout is
  // inherited by every page that doesn't override it, so a root canonical of
  // "/" would tell search engines that every such page is a duplicate of the
  // homepage. Each page sets its own `alternates.canonical` (relative paths
  // resolve against metadataBase, so '/lab' becomes https://www.aoneill.co.uk/lab).
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Antony O\'Neill',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Antony O\'Neill - ML & Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
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
        {/* Why: these policies are pass-through ((s) => s). They exist only so
            the CSP's require-trusted-types-for 'script' directive doesn't break
            React/Next, which assign strings to DOM sinks. They satisfy the
            browser's API check but sanitise nothing, so Trusted Types currently
            gives no XSS protection beyond what React's escaping already does.
            Follow-up: replace 'default' with a policy that rejects or sanitises
            unexpected input, and drop the policies Next no longer needs. */}
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
              url: SITE_URL,
              image: `${SITE_URL}/images/og-image.png`,
              jobTitle: 'ML & Software Engineer',
              description: DEFAULT_DESCRIPTION,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Manchester',
                addressCountry: 'GB',
              },
              sameAs: [
                'https://github.com/W17ANT',
                'https://www.linkedin.com/in/AntonyONeillADL',
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
                  '%c║  ML & Software Engineer                                       ║\\n' +
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
      <body className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} ${sora.variable} antialiased`}>
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
