import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

// Extracts plain text from an uploaded PDF or DOCX file and returns it.
// PDF: pdf-parse v1 (Buffer → { text }).
// DOCX: mammoth.extractRawText (Buffer → { value }).
// All other types are rejected with 415.
//
// Note: this runs on the Node.js runtime (default for App Router API routes).
// Local dev accepts up to 50 MB (matches the client-side cap in the analysis
// page). On Vercel Hobby/Pro, the platform body-size limit is ~4.5 MB per
// request — uploads larger than that will be rejected at the edge before
// reaching this handler. For production support of 50 MB files, deploy on a
// plan that allows larger function bodies, or switch to direct-to-blob
// upload (e.g. Vercel Blob signed URL) and pass the URL here instead of
// the file body.


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const isPdf = name.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx =
      name.endsWith('.docx') ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are supported' },
        { status: 415 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    if (isPdf) {
      // IMPORTANT: require the inner module, NOT the package root.
      // pdf-parse@1.x's index.js runs a "debug mode" branch on load that reads
      // a non-existent test PDF when bundled under Next.js — this crashes the
      // route. The inner file is a clean function with no side effects.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (
        buf: Buffer,
      ) => Promise<{ text: string; numpages: number }>;
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    text = text.replace(/\r\n/g, '\n').trim();

    if (text.length < 30) {
      return NextResponse.json(
        {
          error:
            'Could not extract usable text from the file. The document may be a scanned image without OCR.',
          filename: file.name,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      text,
      charCount: text.length,
    });
  } catch (err) {
    console.error('[extract-text] failed:', err);
    const message = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      {
        error: `Failed to process document: ${message}`,
        details: message,
      },
      { status: 500 },
    );
  }
}
