import { NextRequest, NextResponse } from 'next/server';

// Production note: this route would integrate with a Python microservice using
// pdfplumber or PyMuPDF, or use the Vercel AI SDK file handling.
// For the hackathon demo, text extraction is simulated client-side.

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
      return NextResponse.json({ error: 'Only PDF and DOCX files are supported' }, { status: 415 });
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      message: 'Text extraction will be processed client-side',
    });
  } catch {
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
