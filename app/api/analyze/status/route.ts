import { NextResponse } from 'next/server';

// Diagnostic endpoint — reports whether OPENAI_API_KEY is loaded on the server.
// Safe to expose: returns only presence + length + prefix, never the key itself.
export async function GET() {
  const key = process.env.OPENAI_API_KEY ?? '';
  const present = key.length > 0;
  const looksValid = key.length >= 20 && !key.startsWith('YOUR_');
  const prefix = key ? `${key.slice(0, 7)}…` : null;

  return NextResponse.json({
    present,
    looksValid,
    length: key.length,
    prefix,
    mode: looksValid ? 'openai-gpt' : 'offline-fallback',
  });
}
