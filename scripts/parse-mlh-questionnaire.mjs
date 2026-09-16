/**
 * Turns MLH-client-questionnaire.docx into the JSON the /MLH/Questions form renders.
 *
 * Run it again whenever the document changes:
 *   node scripts/parse-mlh-questionnaire.mjs ~/Downloads/MLH-client-questionnaire.docx
 *
 * The document is machine-readable by luck of being written consistently, and the
 * parser leans on that rather than guessing:
 *   Heading1          a section        (7 of them, one page of the form each)
 *   Heading2          a subsection     (53, rendered as a fieldset)
 *   bold run + rest   a question       (the bold run is "12. Trading name", the
 *                                       unbolded remainder is the guidance)
 *   "Answer: [Type here]"              the slot the client types into - skipped,
 *                                       because the form provides its own input
 *
 * Splitting on the bold run matters: a question's guidance often contains full
 * stops and the word "Current", so any regex over the flattened text mangles
 * roughly a third of the 332 questions.
 *
 * Question ids are the document's own numbers (q1..q332). They are stable as long
 * as nobody renumbers the document, which is what makes a half-finished answer set
 * still line up after a re-parse.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const source = process.argv[2] || `${process.env.HOME}/Downloads/MLH-client-questionnaire.docx`;
const target = resolve(process.cwd(), "src/content/mlh-questionnaire.json");

/** Reads word/document.xml out of the .docx without a zip dependency. */
function documentXml(path) {
  return execFileSync("unzip", ["-p", path, "word/document.xml"], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

/** Word escapes these five; nothing else appears in this document. */
function decode(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function textOf(fragment) {
  const parts = fragment.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  return decode(parts.map((p) => p.replace(/<[^>]+>/g, "")).join(""));
}

/**
 * Splits a paragraph into its bold prefix and the remainder.
 *
 * Word emits `<w:b/>` inside a run's properties. A run with no text (spacing,
 * bookmarks) is ignored so it cannot break the run of bold at the start.
 */
function splitBold(paragraph) {
  const runs = paragraph.match(/<w:r[ >][\s\S]*?<\/w:r>/g) || [];
  let bold = "";
  let rest = "";
  let stillBold = true;

  for (const run of runs) {
    const text = textOf(run);
    if (!text) continue;
    const isBold = /<w:b\s*\/>|<w:b\s[^>]*\/>/.test(run);
    if (stillBold && isBold) bold += text;
    else {
      stillBold = false;
      rest += text;
    }
  }

  return { bold: bold.trim(), rest: rest.trim() };
}

const xml = documentXml(source);
const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

const sections = [];
let section = null;
let subsection = null;
let questionCount = 0;
let extras = 0;
/**
 * The last paragraph that was not itself a question.
 *
 * "Anything else" asks its one question as plain prose with no number, so the
 * numbered-bold rule misses it and that page would render empty. Remembering the
 * previous paragraph lets an "Answer:" slot claim it, which catches this case and
 * any other unnumbered prompt added to the document later.
 */
let pendingPrompt = null;

for (const paragraph of paragraphs) {
  const style = (paragraph.match(/w:pStyle w:val="([^"]+)"/) || [])[1] || "";
  const text = textOf(paragraph).trim();
  if (!text) continue;

  if (style === "Heading1") {
    section = { id: slug(text), title: text, subsections: [] };
    sections.push(section);
    subsection = null;
    continue;
  }

  if (style === "Heading2") {
    // The document opens with a "Sections" contents list before any Heading1.
    if (!section) continue;
    subsection = { title: text, questions: [] };
    section.subsections.push(subsection);
    continue;
  }

  if (!section) continue;

  // The answer slots are the document's own writing lines; the form replaces them -
  // but an unnumbered prompt directly above one is still a question worth asking.
  if (/^Answer:/i.test(text)) {
    if (pendingPrompt) {
      if (!subsection) {
        subsection = { title: "", questions: [] };
        section.subsections.push(subsection);
      }
      extras += 1;
      subsection.questions.push({
        id: `extra${extras}`,
        number: null,
        title: pendingPrompt,
        note: null,
        long: true,
      });
      questionCount += 1;
      pendingPrompt = null;
    }
    continue;
  }

  const { bold, rest } = splitBold(paragraph);
  const numbered = bold.match(/^(\d+)\.\s*(.+)$/);
  if (!numbered) {
    // Not a numbered question. Hold it in case an "Answer:" slot follows.
    pendingPrompt = text;
    continue;
  }
  pendingPrompt = null;

  // A question before any Heading2 belongs to the section itself.
  if (!subsection) {
    subsection = { title: "", questions: [] };
    section.subsections.push(subsection);
  }

  const [, number, title] = numbered;
  subsection.questions.push({
    id: `q${number}`,
    number: Number(number),
    title: title.trim(),
    // Verbatim, including any "Current: …" the document offers to confirm. Kept as
    // one string rather than split further: the guidance is prose, and parsing it
    // into fields would invent structure the document does not have.
    note: rest || null,
    // A long answer gets a textarea. Chosen on the question, not the answer, so the
    // form is the same shape every time it is opened.
    long: isLongAnswer(title, rest),
  });
  questionCount += 1;
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Questions that want room: descriptions, lists, policies and copy. */
function isLongAnswer(title, note) {
  const haystack = `${title} ${note || ""}`.toLowerCase();
  return /description|describe|list|features|equipment|policy|policies|terms|copy|story|intro|paragraph|anything else|notes|exceptions|details of/.test(
    haystack,
  );
}

const output = {
  title: "Manchester Leisure Hire",
  subtitle: "Website information questionnaire",
  source: "MLH-client-questionnaire.docx",
  generatedAt: new Date().toISOString(),
  questionCount,
  sections,
};

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);

console.log(`${questionCount} questions across ${sections.length} sections`);
for (const s of sections) {
  const n = s.subsections.reduce((total, sub) => total + sub.questions.length, 0);
  console.log(`  ${s.title}: ${n} questions in ${s.subsections.length} subsection(s)`);
}
console.log(`→ ${target}`);
