/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   OBFUSCATED EMAIL - Anti-scraping email component   ###
   ###   Constructs mailto links via JavaScript             ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';

interface ObfuscatedEmailProps {
  user: string;      // e.g., "Antony"
  domain: string;    // e.g., "aoneill.co.uk"
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an email link that's constructed via JavaScript
 * to prevent simple email harvesting by bots
 */
export default function ObfuscatedEmail({
  user,
  domain,
  className = '',
  style = {},
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Construct email on client-side only
  useEffect(() => {
    // Small delay to ensure bots have moved on
    const timer = setTimeout(() => {
      setEmail(`${user}@${domain}`);
    }, 100);
    return () => clearTimeout(timer);
  }, [user, domain]);

  const handleClick = (e: React.MouseEvent) => {
    if (!email) {
      e.preventDefault();
      return;
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Show placeholder while loading
  if (!email) {
    return (
      <span className={className} style={style}>
        {user}[at]{domain.replace('.', '[dot]')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        onClick={handleClick}
        className={className}
        style={style}
      >
        {email}
      </a>
      <button
        onClick={handleCopy}
        className="opacity-50 hover:opacity-100 transition-opacity p-1"
        title={isCopied ? 'Copied!' : 'Copy email'}
        aria-label={isCopied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
      >
        {isCopied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </span>
  );
}
