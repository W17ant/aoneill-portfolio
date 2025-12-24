import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Antony O\'Neill | Full-Stack Developer',
  description:
    'Full-stack developer focused on shipping clean, fast, reliable web products. Next.js, React, TypeScript.',
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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
