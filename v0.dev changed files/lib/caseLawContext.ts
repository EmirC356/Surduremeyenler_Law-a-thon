/**
 * caseLawContext.ts
 *
 * Reads the "Case Law" folder at request time and returns its contents as
 * structured data for the OpenAI call.
 *
 * VERCEL DEPLOYMENT NOTE: The Vercel filesystem is read-only at runtime.
 * Only files present in the Git repository at build time are accessible via
 * fs in production. Any document added to the Case Law folder must be
 * committed and pushed to trigger a new Vercel deployment before the API
 * route can see it in production. The local development server reads files
 * live from disk, so local testing always reflects the current folder contents.
 */

import fs from 'fs/promises';
import path from 'path';
import type { OffsetProject } from './caseData';

const CASE_LAW_DIR = path.join(process.cwd(), 'Case Law');

export interface CaseLawDocument {
  fileName: string;
  text: string;
  excerpt: string;
}

/**
 * Reads every supported file in the Case Law folder and returns an array of
 * documents. Supported formats: .txt, .md (read directly), .pdf (via pdf-parse).
 * Any other extension is skipped. Unreadable files are skipped with a warning.
 * Returns an empty array if the folder does not exist.
 */
export async function loadCaseLawContext(): Promise<CaseLawDocument[]> {
  const docs: CaseLawDocument[] = [];

  let entries: string[];
  try {
    entries = await fs.readdir(CASE_LAW_DIR);
  } catch {
    // Folder doesn't exist or can't be read — demo mode, no context available
    return [];
  }

  for (const fileName of entries) {
    const ext = path.extname(fileName).toLowerCase();
    if (ext !== '.txt' && ext !== '.md' && ext !== '.pdf') continue;

    const filePath = path.join(CASE_LAW_DIR, fileName);

    try {
      let text: string;

      if (ext === '.pdf') {
        const buffer = await fs.readFile(filePath);
        // pdf-parse v1 is a CommonJS module; require is safe here in Next.js API routes
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        text = result.text;
      } else {
        text = await fs.readFile(filePath, 'utf-8');
      }

      // Normalise whitespace
      text = text.replace(/\r\n/g, '\n').trim();

      docs.push({
        fileName,
        text,
        excerpt: text.slice(0, 500),
      });
    } catch (err) {
      console.warn(`[caseLawContext] Could not read "${fileName}":`, err);
    }
  }

  return docs;
}

/**
 * Given the user's claim text and the loaded documents, returns a single
 * formatted string of the most relevant passages, within maxChars budget.
 *
 * Algorithm: split each document into ~800-char paragraph-aligned chunks,
 * score each chunk by how many significant claim words appear in it, take
 * top-scoring chunks until the character budget is reached.
 */
export function selectRelevantPassages(
  claimText: string,
  docs: CaseLawDocument[],
  maxChars = 8000,
): string {
  if (docs.length === 0) return '';

  // Significant words from the claim: lowercase, longer than 4 chars, deduplicated
  const claimWords = Array.from(
    new Set(
      claimText
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 4),
    ),
  );

  interface Chunk {
    fileName: string;
    text: string;
    score: number;
  }

  const chunks: Chunk[] = [];

  for (const doc of docs) {
    // Split on blank lines (paragraph boundaries), then accumulate into ~800-char chunks
    const paragraphs = doc.text.split(/\n\s*\n/);
    let buffer = '';

    for (const para of paragraphs) {
      const candidate = buffer ? buffer + '\n\n' + para : para;
      if (candidate.length > 800 && buffer.length > 0) {
        chunks.push({ fileName: doc.fileName, text: buffer.trim(), score: 0 });
        buffer = para;
      } else {
        buffer = candidate;
      }
    }
    if (buffer.trim()) {
      chunks.push({ fileName: doc.fileName, text: buffer.trim(), score: 0 });
    }
  }

  // Score each chunk by term frequency of claim words
  for (const chunk of chunks) {
    const lower = chunk.text.toLowerCase();
    chunk.score = claimWords.reduce((sum, w) => sum + (lower.includes(w) ? 1 : 0), 0);
  }

  // Sort descending by score; take chunks until budget exhausted
  chunks.sort((a, b) => b.score - a.score);

  const DELIMITER = '\n─────────────────────────────────────\n';
  const parts: string[] = [];
  let used = 0;

  for (const chunk of chunks) {
    if (chunk.score === 0) break; // remaining chunks have no overlap with claim
    const entry = `[SOURCE: ${chunk.fileName}]\n${chunk.text}`;
    const cost = entry.length + DELIMITER.length;
    if (used + cost > maxChars) break;
    parts.push(entry);
    used += cost;
  }

  return parts.join(DELIMITER);
}

/**
 * Serialises the offset project integrity scores into a compact plain-text
 * block for the LLM system prompt. Stays under ~1500 characters.
 */
export function serializeOffsetContext(projects: OffsetProject[]): string {
  const fmt = (v: number | null | undefined): string =>
    v == null ? 'not assessed' : String(v);

  return projects
    .map(
      (p) =>
        `Project: ${p.projectName}\n` +
        `  Type: ${p.projectType} | Certifier: ${p.certificationBody}\n` +
        `  Additionality: ${fmt(p.additionalityScore)}/100 | Permanence: ${fmt(p.permanenceScore)}/100 | Leakage Control: ${fmt(p.leakageScore)}/100\n` +
        `  Overall Integrity: ${fmt(p.overallIntegrityScore)}/100 | Status: ${p.status.toUpperCase()}\n` +
        `  Notes: ${p.notes}`,
    )
    .join('\n\n');
}
