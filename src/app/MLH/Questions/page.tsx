/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH QUESTIONS - Client questionnaire route          ###
   ###   Sits beside the static /MLH demo subtree            ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * The Manchester Leisure Hire website questionnaire.
 *
 * A real route, unlike the rest of /MLH: that is a static export served out of
 * /public/MLH, while this needs a server to reach Supabase. The two coexist
 * because no page in the export is called Questions, so nothing collides.
 *
 * noindex, and deliberately not linked from anywhere. The access code is the
 * gate, but a client's business details should not be sitting in a search index
 * even behind one.
 */

import QuestionnaireFlow from '@/components/mlh/QuestionnaireFlow';

export const metadata = {
  title: 'Website questionnaire | Manchester Leisure Hire',
  description: 'Confirm the information needed to finish the Manchester Leisure Hire website.',
  robots: { index: false, follow: false },
};

/** Answers must never be cached or prerendered. */
export const dynamic = 'force-dynamic';

export default function MlhQuestionsPage() {
  return (
    <QuestionnaireFlow turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
  );
}
