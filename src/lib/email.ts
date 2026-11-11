/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EMAIL HELPERS - Validation and mailbox keys        ###
   ###   Used by the contact form's auto-reply cap          ###
   ###   Last Updated: 11-11-2026                           ###
   ########################################################### */

// Why: one @, no spaces, and none of the characters a mail library reads as
// a display name or a list (<>, quotes, commas, semicolons, brackets), so the
// address we validate and key on is the address the mail is sent to
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]+$/;

// Why 254: the longest address SMTP allows (RFC 5321 path limit)
const EMAIL_MAX_LENGTH = 254;

// Domains where dots in the local part are ignored, so a.b@ and ab@ are one inbox
const DOTLESS_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * Whether a submitted address is safe to send to.
 * @param email - the trimmed address from the form
 * @returns true for a plain user@domain.tld address
 */
export function isValidEmail(email: string): boolean {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
}

/**
 * The inbox an address delivers to, for rate limiting: lower-cased, without
 * a +tag, and for Gmail without dots (googlemail.com is gmail.com).
 * Why: each of those spellings reaches the same inbox, so a per-address cap
 * keyed on the raw text could be stepped round by varying them.
 * @param email - a valid address (see isValidEmail)
 * @returns the normalised mailbox, e.g. "jane@gmail.com" for "J.ane+cv@GoogleMail.com"
 */
export function mailboxKey(email: string): string {
  const lower = email.toLowerCase();
  const at = lower.lastIndexOf('@');
  let local = lower.slice(0, at).split('+')[0];
  let domain = lower.slice(at + 1);
  if (domain === 'googlemail.com') domain = 'gmail.com';
  if (DOTLESS_DOMAINS.has(domain)) local = local.replace(/\./g, '');
  return `${local}@${domain}`;
}
