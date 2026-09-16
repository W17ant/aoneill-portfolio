/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH COSTS - Fees and third-party running costs      ###
   ###   Edit the numbers here, not in the component         ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * What the Manchester Leisure Hire website costs to build and to run.
 *
 * Kept in one file, apart from the component, so a price can be corrected
 * without touching layout. Every figure a client sees comes from here.
 *
 * VERIFY BEFORE SENDING. Third-party list prices are checked at the date in
 * `pricesCheckedOn` below and they do move. Where a service bills in dollars the
 * sterling figure is an approximation and is labelled as one on screen — the
 * client is billed by the provider in their currency, not by us.
 */

/** Shown to the client so they know how fresh the third-party prices are. */
export const pricesCheckedOn = '16 September 2026';

/** Rate used to convert the dollar-billed services for display only. */
export const usdToGbp = 0.79;

export interface FeeLine {
  label: string;
  /** Display string rather than a number: some are one-off, some monthly. */
  amount: string;
  /** One sentence, plain English, no jargon. */
  what: string;
}

/**
 * What Antony O'Neill charges.
 *
 * These are the two figures Antony set. Everything below them is somebody
 * else's price list.
 */
export const ourFees: FeeLine[] = [
  {
    label: 'Website build and set-up',
    amount: '£1,500 one-off',
    what: 'Designing and building the site, setting up the booking system, and getting everything live and working.',
  },
  {
    label: 'SEO and upkeep',
    amount: '£150 per month',
    what: 'Keeping the site fast, secure and up to date, and working on your position in Google results.',
  },
];

export interface ServiceLine extends FeeLine {
  /** True when the service has no charge on the plan we need. */
  free?: boolean;
  /** Shown as a footnote where the price is billed in another currency. */
  note?: string;
}

/**
 * The outside services the site needs to run.
 *
 * Billed by each provider to accounts in Manchester Leisure Hire's name, not
 * through Antony — which is why they are listed separately from the fees above.
 */
export const services: ServiceLine[] = [
  {
    label: 'Supabase Pro',
    amount: '£20 per month',
    what: 'The database. It holds your campers, prices, bookings and customer details.',
    note: 'Billed by Supabase at $25 per month, so the pound figure moves with the exchange rate.',
  },
  {
    label: 'Vercel Pro',
    amount: '£16 per month',
    what: 'The hosting. It serves the website to your customers and keeps it quick.',
    note: 'Billed by Vercel at $20 per month, so the pound figure moves with the exchange rate.',
  },
  {
    label: 'Cloudflare Turnstile',
    amount: 'Free',
    free: true,
    what: 'Stops bots filling in your booking and contact forms, without making real customers solve a puzzle.',
  },
  {
    label: 'Sentry',
    amount: 'Free',
    free: true,
    what: 'Tells us straight away if something breaks for a customer, with enough detail to fix it.',
  },
  {
    label: 'UptimeRobot',
    amount: 'Free',
    free: true,
    what: 'Checks the site is still up every few minutes and alerts us if it goes down.',
  },
  {
    label: 'Resend',
    amount: 'Free to start',
    free: true,
    what: 'Sends your booking confirmations and enquiry emails so they arrive reliably rather than landing in spam.',
    note: 'Free covers 3,000 emails a month, capped at 100 a day. Beyond that it is about £16 a month.',
  },
  {
    label: 'Cloudflare DNS',
    amount: 'Free',
    free: true,
    what: 'Points your web address at the site, and shields it from junk traffic.',
  },
  {
    label: 'Upstash Redis',
    amount: 'Free to start',
    free: true,
    what: 'Stops the same person hammering the booking form, and holds a booking briefly while a customer pays.',
    note: 'Free covers 500,000 commands a month, which is far more than a hire business will use.',
  },
  {
    label: 'GitHub',
    amount: 'Free',
    free: true,
    what: 'Where the website code lives, so there is a full history and nothing depends on one laptop.',
  },
  {
    label: 'Google Search Console',
    amount: 'Free',
    free: true,
    what: 'Shows what people search to find you and flags anything stopping Google listing your pages.',
  },
  {
    label: 'Domain name',
    amount: 'Around £15 per year',
    what: 'Your web address. Renewed yearly, and the price depends on the ending you choose.',
  },
  {
    label: 'Business email',
    amount: 'From £5.90 per person per month',
    what: 'An address at your own domain, like hello@yourname.co.uk, rather than a Gmail one.',
    note: 'Google Workspace Business Starter on an annual plan, excluding VAT. Microsoft 365 is similar. Skip it if you already have business email.',
  },
];

/**
 * Things that still need a decision, and therefore have no price yet.
 *
 * Shown separately rather than hidden: a client who is told the monthly cost is
 * £186 and then meets a driver-licence-check bill has been misled, even if the
 * £186 was accurate for what it covered.
 */
export const undecided: FeeLine[] = [
  {
    label: 'Driving licence check',
    amount: 'Optional - cost per check, TBC',
    what: 'Confirms a hirer holds a valid licence before they collect. Providers charge per check, so the cost depends on which one you pick and how many bookings you take.',
  },
  {
    label: 'Photo storage and backup',
    amount: 'Usually included',
    what: 'Somewhere your camper photographs live safely. The site can hold them alongside the database at no extra cost, but keep your own copies too.',
  },
];

/**
 * Card fees, which come out of each booking rather than arriving as a bill.
 *
 * Stripe's published UK rates, not a rounded estimate: a client comparing
 * providers will look these up, and being wrong in either direction is bad.
 * There is no monthly charge and no set-up fee.
 */
export const transactionFees: FeeLine[] = [
  {
    label: 'UK cards',
    amount: '1.5% + 20p',
    what: 'Taken by Stripe out of each booking paid on a standard UK card.',
  },
  {
    label: 'European cards',
    amount: '2.5% + 20p',
    what: 'Slightly more for cards issued elsewhere in Europe.',
  },
  {
    label: 'Cards from further afield',
    amount: '3.25% + 20p',
    what: 'Most expensive, for cards issued outside Europe. Currency conversion adds 2% where it applies.',
  },
];

/**
 * A worked example, because percentages are hard to feel.
 *
 * Uses the demo nightly price and the UK card rate above.
 */
export const workedExample = {
  booking: '£500 booking (four nights at £125)',
  fee: '£7.70',
  detail: '1.5% of £500 is £7.50, plus 20p.',
};

/** Rough monthly running total, for the question every client asks first. */
export const monthlyTotal = {
  amount: 'About £186 per month',
  detail:
    'Antony’s £150 upkeep, plus roughly £36 of Supabase and Vercel. Everything marked free stays free at the volumes a hire business of this size will reach, and card fees only apply when you take a booking.',
  /** Kept separate so the headline figure is never quietly wrong. */
  excluded:
    'Not included: the domain at around £15 a year, business email from £5.90 per person a month if you need it, and driving licence checks if you choose to add them.',
};
