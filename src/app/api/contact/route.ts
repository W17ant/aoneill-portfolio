/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CONTACT API ROUTE - Email handling endpoint        ###
   ###   Processes contact form submissions via Resend      ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Imports                                         ###
   ########################################################### */

import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limit: 3 submissions per hour per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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

/* ###########################################################
   ###   4. API Handler                                     ###
   ########################################################### */

export async function POST(request: Request) {
  try {
    /* ========================================
       Rate Limiting
       ======================================== */
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website } = body;

    /* ========================================
       Honeypot Check (spam prevention)
       ======================================== */
    // The 'website' field is a honeypot - should always be empty
    // Bots typically fill all fields, humans won't see this field
    if (website) {
      // Silently reject but return success to not tip off bots
      console.log('Honeypot triggered from IP:', clientIP);
      return NextResponse.json({ success: true });
    }

    /* ========================================
       Validate input
       ======================================== */
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 3 || subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 3 and 200 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
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
    const { error: notifyError } = await resend.emails.send({
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
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    /* ========================================
       Send auto-reply to the sender
       (Only sent after rate limit check passes)
       ======================================== */
    await resend.emails.send({
      from: 'Antony O\'Neill <Antony@aoneill.co.uk>',
      to: [email],
      subject: `Thanks for reaching out, ${name.split(' ')[0]}!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #1e40af 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Message Received</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 15px;">Thanks for getting in touch!</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi ${safeName.split(' ')[0]},
            </p>

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
              Thanks for reaching out through my portfolio. I've received your message about <strong>"${safeSubject}"</strong> and will get back to you as soon as possible.
            </p>

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
              I typically respond within 24-48 hours. In the meantime, feel free to check out my latest work:
            </p>

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://aoneill.co.uk/projects" style="display: inline-block; background: #1e40af; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View My Projects
              </a>
            </div>

            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">
              Speak soon,<br>
              <strong style="color: #1e293b;">Antony O'Neill</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Full-Stack Developer · Next.js · React · TypeScript
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">
              <a href="https://aoneill.co.uk" style="color: #1e40af; text-decoration: none;">aoneill.co.uk</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
