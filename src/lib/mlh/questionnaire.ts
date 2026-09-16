/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH QUESTIONNAIRE - Question set and progress       ###
   ###   Reads the generated question JSON                   ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * The question set for the Manchester Leisure Hire questionnaire.
 *
 * The JSON is generated from the client's Word document by
 * scripts/parse-mlh-questionnaire.mjs - do not hand-edit it. Re-run the script
 * when the document changes; question ids are the document's own numbers, so
 * answers already given still line up afterwards.
 */

import data from '@/content/mlh-questionnaire.json';

/* ###########################################################
   ###   1. Types                                           ###
   ########################################################### */

export interface Question {
  /** Stable key used for the answer, e.g. "q41". */
  id: string;
  /** The document's own numbering, or null for the unnumbered final prompt. */
  number: number | null;
  title: string;
  /** Guidance from the document, including any "Current: …" to confirm. */
  note: string | null;
  /** True when the answer wants a textarea rather than a single line. */
  long: boolean;
}

export interface Subsection {
  /** Empty for questions that sit directly under a section heading. */
  title: string;
  questions: Question[];
}

export interface Section {
  id: string;
  title: string;
  subsections: Subsection[];
}

export interface Questionnaire {
  title: string;
  subtitle: string;
  source: string;
  generatedAt: string;
  questionCount: number;
  sections: Section[];
}

/** An answer per question id. Missing and empty-string both mean unanswered. */
export type Answers = Record<string, string>;

/* ###########################################################
   ###   2. The question set                                ###
   ########################################################### */

export const questionnaire = data as Questionnaire;

/** Every question, flattened, in document order. */
export function allQuestions(): Question[] {
  return questionnaire.sections.flatMap((section) =>
    section.subsections.flatMap((subsection) => subsection.questions),
  );
}

/** Every question in one section, flattened. */
export function sectionQuestions(section: Section): Question[] {
  return section.subsections.flatMap((subsection) => subsection.questions);
}

/* ###########################################################
   ###   3. Progress                                        ###
   ########################################################### */

/**
 * Counts answered questions, treating whitespace as unanswered.
 *
 * Why trim: a textarea left with a stray newline is not an answer, and a
 * progress bar that reads 100% while questions are blank is worse than no
 * progress bar. Matches the count in the mlh_response_progress view so the
 * screen and the database agree.
 */
export function countAnswered(questions: Question[], answers: Answers): number {
  return questions.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;
}

/** Answered/total for one section, for the per-section progress display. */
export function sectionProgress(
  section: Section,
  answers: Answers,
): { answered: number; total: number } {
  const questions = sectionQuestions(section);
  return { answered: countAnswered(questions, answers), total: questions.length };
}
