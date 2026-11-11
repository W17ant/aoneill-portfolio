/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CONTACT API ROUTE - Email handling endpoint        ###
   ###   Processes contact form submissions via Resend      ###
   ###   Accepts JSON (JS form) and form-encoded (no-JS)    ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Imports                                         ###
   ########################################################### */

import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { isOriginAllowed, corsBlockedResponse, handlePreflight } from '@/lib/cors';

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

// Lazy initialize to avoid build errors when env var is missing
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Rate limit: 3 submissions per hour per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Why: the auto-reply sends mail from this domain to whatever address was
// typed in, so it is a relay risk. Cap it per recipient (one per day, so
// rotating IPs can't flood a single inbox) and globally (so rotating
// addresses can't burn the domain's sending reputation). When a cap is hit
// the notification to Antony still goes out; only the auto-reply is skipped.
const AUTO_REPLY_PER_ADDRESS_MAX = 1;
const AUTO_REPLY_PER_ADDRESS_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const AUTO_REPLY_GLOBAL_MAX = 20; // Why: well above real enquiry volume
const AUTO_REPLY_GLOBAL_WINDOW = 60 * 60 * 1000; // 1 hour

// Used when the optional subject field is left blank
const DEFAULT_SUBJECT = 'Portfolio enquiry';

// Where no-JS form posts are sent back to (see respond())
const CONTACT_PAGE_PATH = '/contact/';

type ErrorCode = 'rate' | 'validation' | 'server';

/* ###########################################################
   ###   3. Helper Functions                               ###
   ########################################################### */

// Basic HTML sanitization to prevent XSS in emails
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Detect a native (no-JS) HTML form post. Those expect a page, not JSON,
 * so responses are sent as a 303 redirect back to /contact with a status flag.
 */
function isFormPost(request: Request): boolean {
  const type = request.headers.get('content-type') || '';
  return type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data');
}

/** Read the submitted fields from either a JSON or a form-encoded body. */
async function readBody(request: Request, formPost: boolean): Promise<Record<string, unknown>> {
  if (formPost) {
    const data = await request.formData();
    return Object.fromEntries(
      Array.from(data.entries()).filter(([, v]) => typeof v === 'string')
    );
  }
  return request.json();
}

/** Coerce an unknown body field to a trimmed string. */
function field(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Build the response: JSON for fetch() callers, a 303 redirect back to the
 * contact page for no-JS form posts.
 */
function respond(
  request: Request,
  formPost: boolean,
  status: number,
  body: Record<string, unknown>,
  errorCode?: ErrorCode,
  headers?: Record<string, string>
): NextResponse {
  if (formPost) {
    const url = new URL(CONTACT_PAGE_PATH, request.url);
    if (errorCode) url.searchParams.set('error', errorCode);
    else url.searchParams.set('sent', '1');
    url.hash = 'contact-form';
    return NextResponse.redirect(url, 303);
  }
  return NextResponse.json(body, { status, headers });
}

/* ###########################################################
   ###   4. API Handler                                     ###
   ########################################################### */

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function POST(request: Request) {
  // CORS check
  if (!isOriginAllowed(request)) {
    return corsBlockedResponse();
  }

  const formPost = isFormPost(request);

  try {
    /* ========================================
       Rate Limiting
       ======================================== */
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);

    if (!rateLimit.success) {
      return respond(
        request,
        formPost,
        429,
        {
          error: 'Too many requests',
          message: `Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes`,
        },
        'rate',
        {
          'Retry-After': String(rateLimit.resetIn),
          'X-RateLimit-Remaining': '0',
        }
      );
    }

    const body = await readBody(request, formPost);
    const name = field(body.name);
    const email = field(body.email);
    const message = field(body.message);
    const website = field(body.website);
    // Why: subject is optional in the form; fall back to a neutral default
    const rawSubject = field(body.subject);
    const subject = rawSubject || DEFAULT_SUBJECT;

    /* ========================================
       Honeypot Check (spam prevention)
       ======================================== */
    // The 'website' field is a honeypot - should always be empty
    // Bots typically fill all fields, humans won't see this field
    if (website) {
      // Silently reject but return success to not tip off bots
      console.log('Honeypot triggered from IP:', clientIP);
      return respond(request, formPost, 200, { success: true });
    }

    /* ========================================
       Validate input
       ======================================== */
    const invalid = (error: string) => respond(request, formPost, 400, { error }, 'validation');

    if (!name || !email || !message) {
      return invalid('Name, email and message are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return invalid('Invalid email address');
    }

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return invalid('Name must be between 2 and 100 characters');
    }

    if (rawSubject && (rawSubject.length < 3 || rawSubject.length > 200)) {
      return invalid('Subject must be between 3 and 200 characters');
    }

    if (message.length < 10 || message.length > 5000) {
      return invalid('Message must be between 10 and 5000 characters');
    }

    /* ========================================
       Sanitize input for HTML emails
       ======================================== */
    const safeName = sanitizeHtml(name);
    const safeEmail = sanitizeHtml(email);
    const safeSubject = sanitizeHtml(subject);
    const safeMessage = sanitizeHtml(message);

    /* ========================================
       Send notification to you
       ======================================== */
    const { error: notifyError } = await getResendClient().emails.send({
      from: 'Antony O\'Neill <Antony@aoneill.co.uk>',
      to: ['Antony@aoneill.co.uk'],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <div style="border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #60a5fa; margin: 0 0 8px 0; font-size: 20px;">New Contact Form Submission</h2>
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">From your portfolio at aoneill.co.uk</p>
          </div>

          <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px 0;"><span style="color: #94a3b8;">Name:</span> <strong style="color: #f8fafc;">${safeName}</strong></p>
            <p style="margin: 0 0 12px 0;"><span style="color: #94a3b8;">Email:</span> <strong style="color: #f8fafc;">${safeEmail}</strong></p>
            <p style="margin: 0 0 12px 0;"><span style="color: #94a3b8;">Subject:</span> <strong style="color: #f8fafc;">${safeSubject}</strong></p>
            <p style="margin: 0;"><span style="color: #94a3b8;">IP:</span> <span style="color: #64748b; font-size: 12px;">${clientIP}</span></p>
          </div>

          <div style="background: #1e293b; padding: 20px; border-radius: 8px;">
            <h3 style="color: #60a5fa; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
            <p style="color: #e2e8f0; margin: 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    if (notifyError) {
      console.error('Failed to send notification:', notifyError);
      return respond(request, formPost, 500, { error: 'Failed to send email' }, 'server');
    }

    /* ========================================
       Send auto-reply to the sender
       ======================================== */
    // Why: content-minimal on purpose. Nothing the submitter typed (name,
    // subject, message) is echoed back, so the form can't be used to deliver
    // attacker-written text from this domain to an arbitrary inbox.
    const recipientKey = `autoreply:${email.toLowerCase()}`;
    const perAddress = checkRateLimit(recipientKey, AUTO_REPLY_PER_ADDRESS_MAX, AUTO_REPLY_PER_ADDRESS_WINDOW);
    const globalCap = perAddress.success
      ? checkRateLimit('autoreply:global', AUTO_REPLY_GLOBAL_MAX, AUTO_REPLY_GLOBAL_WINDOW)
      : perAddress;

    if (perAddress.success && globalCap.success) {
      const { error: replyError } = await getResendClient().emails.send({
        from: 'Antony O\'Neill <Antony@aoneill.co.uk>',
        to: [email],
        subject: 'Thanks for getting in touch',
        text:
          'Hi,\n\n' +
          'Thanks for your message through aoneill.co.uk. I have received it and will reply as soon as I can.\n\n' +
          'If you did not send this, you can ignore this email.\n\n' +
          'Antony O\'Neill\n' +
          'ML & Software Engineer, Manchester, UK\n' +
          'https://aoneill.co.uk',
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi,</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Thanks for your message through aoneill.co.uk. I have received it and will reply as soon as I can.
            </p>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 24px 0;">
              If you did not send this, you can ignore this email.
            </p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">
              Antony O'Neill<br>
              <span style="color: #64748b; font-size: 13px;">ML &amp; Software Engineer, Manchester, UK</span><br>
              <a href="https://aoneill.co.uk" style="color: #1e40af; text-decoration: none; font-size: 13px;">aoneill.co.uk</a>
            </p>
          </div>
        </div>
      `,
      });

      // Why: the enquiry already reached Antony, so a failed auto-reply is
      // logged rather than reported to the user as a failed submission.
      if (replyError) console.error('Failed to send auto-reply:', replyError);
    } else {
      console.log('Auto-reply skipped (rate limited) for submission from IP:', clientIP);
    }

    return respond(request, formPost, 200, { success: true }, undefined, {
      'X-RateLimit-Remaining': String(rateLimit.remaining),
    });
  } catch (error) {
    console.error('Contact API error:', error);
    // Why: internal error messages (e.g. missing API key) are logged, not returned
    return respond(request, formPost, 500, { error: 'Internal server error' }, 'server');
  }
}
