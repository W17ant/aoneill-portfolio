/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EMAIL BUTTON - Anti-scraping email button          ###
   ###   Constructs mailto link via JavaScript              ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';

interface EmailButtonProps {
  user: string;
  domain: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A button that opens an email client, with the email
 * constructed via JavaScript to prevent scraping
 */
export default function EmailButton({
  user,
  domain,
  children,
  className = '',
  style = {},
}: EmailButtonProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Small delay before constructing email
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
    window.location.href = `mailto:${email}`;
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={style}
      type="button"
    >
      {children}
    </button>
  );
}
