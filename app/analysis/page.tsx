'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Check, FileText, X, AlertTriangle } from 'lucide-react';
import { useLang } from '../../lib/langContext';
import { ESG_MOCK } from '../../lib/esgMockData';
import PageTitle from '../../components/PageTitle';
import { Card, Badge } from '../../components/ui/Primitives';

type Mode = 'idle' | 'paste' | 'analyzing' | 'done' | 'error';

const STAGES = [
  { id: 0, label: 'Upload',  sub: 'TLS upload · checksum',     duration: 800  },
  { id: 1, label: 'Parse',   sub: 'OCR · text extraction',     duration: 1400 },
  { id: 2, label: 'Reason',  sub: 'LLM legal mapping',         duration: 2100 },
  { id: 3, label: 'Score',   sub: 'Risk + citations',          duration: 1300 },
];

const LENSES = [
  { l: 'Greenlighting',      r: 'Selective disclosure asymmetry',     n: 8 },
  { l: 'Greenrinsing',       r: 'Pledge mathematical viability',      n: 6 },
  { l: 'Offset integrity',   r: 'Removal vs. avoidance, vintages',    n: 4 },
  { l: 'Taxonomy alignment', r: 'Revenue / CapEx tagging accuracy',   n: 3 },
  { l: 'Marketing claims',   r: 'EU 2024/825 substantiation',         n: 1 },
  { l: 'Director liability', r: 'ESRS E1-1 disclosure gaps',          n: 1 },
];

export default function AnalysisIntakePage() {
  const { t } = useLang();
  const M = ESG_MOCK;

  const [mode, setMode] = useState<Mode>('idle');
  const [stage, setStage] = useState<number | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [activeFile, setActiveFile] = useState<{ name: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const reset = () => {
    setMode('idle');
    setStage(null);
    setPasteText('');
    setActiveFile(null);
    setError(null);
    setResultSummary(null);
  };

  const runStages = useCallback(async () => {
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, STAGES[i].duration));
    }
    setStage(null);
  }, []);

  const analyzeText = useCallback(async (text: string) => {
    setMode('analyzing');
    setError(null);
    setResultSummary(null);

    // Drive the visual stage ladder while the real API call runs
    const stagesPromise = runStages();
    const apiPromise = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .catch(() => ({ summary: 'Analysis service unavailable. Showing fallback results.' }));

    await Promise.all([stagesPromise, apiPromise]);
    const data = await apiPromise as { summary?: string; flaggedPhrases?: unknown[]; overallScore?: number };

    const count = data.flaggedPhrases?.length ?? 0;
    setResultSummary(
      data.summary ??
        `Analysis complete · ${count} flagged phrase${count !== 1 ? 's' : ''}` +
          (typeof data.overallScore === 'number' ? ` · overall score ${data.overallScore}/100` : '')
    );
    setMode('done');
  }, [runStages]);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setError('Only PDF or DOCX files are supported.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File exceeds 50 MB. Please paste the text instead.');
      return;
    }
    setActiveFile({ name: file.name, size: formatBytes(file.size) });
    setError(null);
    setMode('analyzing');
    setStage(0);

    // Stage 0: upload + extract
    try {
      const fd = new FormData();
      fd.append('file', file);
      const resp = await fetch('/api/extract-text', { method: 'POST', body: fd });
      const data = (await resp.json()) as { text?: string; error?: string };
      if (!resp.ok || !data.text) {
        throw new Error(data.error ?? 'Failed to extract text from the document.');
      }
      // Move to remaining stages and run real analysis on the extracted text
      await analyzeText(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process the document.');
      setMode('error');
      setStage(null);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset the input so re-picking the same file works
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const submitPaste = () => {
    const trimmed = pasteText.trim();
    if (trimmed.length < 20) {
      setError('Please paste at least 20 characters of text to analyse.');
      return;
    }
    setActiveFile({ name: 'Pasted text', size: `${pasteText.length} chars` });
    analyzeText(trimmed);
  };

  return (
    <>
      <PageTitle title={t.titles.analysis} subtitle={t.titles.analysisSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          className="grid gap-5"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {/* LEFT — drop / paste + active job */}
          <div className="flex flex-col gap-4" style={{ minWidth: 0 }}>
            {mode !== 'paste' ? (
              <div
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                  background: isDragging ? 'var(--esg-green-light)' : 'var(--esg-surface)',
                  border: `2px dashed ${isDragging ? 'var(--esg-green-text)' : 'var(--esg-border-strong)'}`,
                  borderRadius: 10,
                  padding: 36,
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  className="grid place-items-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    margin: '0 auto',
                    background: 'var(--esg-green-light)',
                    color: 'var(--esg-green-text)',
                  }}
                >
                  <Upload size={22} />
                </div>
                <h3
                  style={{
                    margin: '16px 0 6px',
                    fontFamily: 'var(--esg-serif)',
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Drop a sustainability report
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--esg-fg-muted)',
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 13.5,
                  }}
                >
                  PDF, DOCX up to 50 MB · processed in-EU, never leaves jurisdiction
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={onFileInputChange}
                />

                <div className="flex gap-2.5 justify-center flex-wrap" style={{ marginTop: 18 }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={mode === 'analyzing'}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 999,
                      background: mode === 'analyzing'
                        ? 'var(--esg-border)'
                        : 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                      color: '#fff',
                      border: 'none',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: mode === 'analyzing' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Browse files
                  </button>
                  <button
                    onClick={() => { setMode('paste'); setError(null); }}
                    disabled={mode === 'analyzing'}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 999,
                      background: 'var(--esg-surface)',
                      color: 'var(--esg-fg)',
                      border: '1px solid var(--esg-border)',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 13,
                      cursor: mode === 'analyzing' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Write / paste text
                  </button>
                </div>
                <div
                  className="flex gap-4 justify-center flex-wrap"
                  style={{
                    marginTop: 16,
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10.5,
                    color: 'var(--esg-fg-muted)',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span>✓ PDF · OCR</span>
                  <span>✓ DOCX</span>
                  <span>✓ Paste plain text</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--esg-surface)',
                  border: '1px solid var(--esg-border)',
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <div className="flex items-start justify-between gap-2" style={{ marginBottom: 12 }}>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--esg-serif)',
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Paste claim or report text
                    </h3>
                    <p
                      style={{
                        margin: '4px 0 0',
                        color: 'var(--esg-fg-muted)',
                        fontFamily: 'var(--esg-sans)',
                        fontSize: 13,
                      }}
                    >
                      Drop in a sustainability claim or any block of corporate copy. Min. 20 characters.
                    </p>
                  </div>
                  <button
                    onClick={() => { setMode('idle'); setPasteText(''); setError(null); }}
                    aria-label="Close paste"
                    style={{
                      background: 'var(--esg-surface-2)',
                      border: '1px solid var(--esg-border)',
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      cursor: 'pointer',
                      color: 'var(--esg-fg-muted)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={9}
                  placeholder="Paste the sustainability claim, marketing copy, or report excerpt here…"
                  style={{
                    width: '100%',
                    background: 'var(--esg-surface-2)',
                    border: '1px solid var(--esg-border)',
                    borderRadius: 6,
                    padding: 12,
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: 'var(--esg-fg)',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
                <div className="flex items-center justify-between" style={{ marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>
                    {pasteText.length} characters
                  </span>
                  <button
                    onClick={submitPaste}
                    disabled={pasteText.trim().length < 20}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 999,
                      background: pasteText.trim().length < 20
                        ? 'var(--esg-border)'
                        : 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                      color: '#fff',
                      border: 'none',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: pasteText.trim().length < 20 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Analyse text →
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div
                className="flex items-start gap-2"
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--esg-red-light)',
                  border: '1px solid rgba(181,61,46,0.3)',
                }}
              >
                <AlertTriangle size={16} style={{ color: 'var(--esg-red)', flexShrink: 0, marginTop: 1 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, color: 'var(--esg-red)', fontWeight: 500 }}>
                    {error}
                  </div>
                  <button
                    onClick={reset}
                    style={{
                      marginTop: 4,
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--esg-red)',
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 11,
                      textDecoration: 'underline',
                    }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Active analysis card — only meaningful during/after a run */}
            <Card
              title="Active analysis"
              sub={activeFile?.name ?? M.company.reportFile}
            >
              {mode === 'idle' || mode === 'paste' ? (
                <div
                  style={{
                    padding: '14px 0',
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 11,
                    color: 'var(--esg-fg-muted)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Upload a file or paste text above to begin. The processing ladder below will activate when a job starts.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {STAGES.map((s) => {
                    const state =
                      stage === null
                        ? (mode === 'done' ? 'done' : 'pending')
                        : s.id < stage
                        ? 'done'
                        : s.id === stage
                        ? 'active'
                        : 'pending';

                    const bg =
                      state === 'done' ? 'var(--esg-green-light)' :
                      state === 'active' ? 'var(--esg-surface-2)' :
                      'var(--esg-surface)';
                    const bd =
                      state === 'done' ? 'rgba(45,106,79,0.25)' :
                      state === 'active' ? 'var(--esg-border-strong)' :
                      'var(--esg-border)';
                    const dotColor =
                      state === 'done' ? 'var(--esg-green-text)' :
                      state === 'active' ? 'var(--esg-orange)' :
                      'var(--esg-border-strong)';

                    return (
                      <div
                        key={s.id}
                        className="grid items-center"
                        style={{
                          gridTemplateColumns: '28px 1fr auto',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: 6,
                          border: `1px solid ${bd}`,
                          background: bg,
                        }}
                      >
                        <div
                          className="grid place-items-center"
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: state === 'done' ? 'var(--esg-green-text)' : 'transparent',
                            border: `2px solid ${dotColor}`,
                            color: '#fff',
                          }}
                        >
                          {state === 'done'
                            ? <Check size={12} />
                            : <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 10, color: dotColor }}>{s.id + 1}</span>
                          }
                        </div>
                        <div className="min-w-0">
                          <div
                            style={{
                              fontFamily: 'var(--esg-sans)',
                              fontSize: 13,
                              fontWeight: state === 'active' ? 600 : 500,
                            }}
                          >
                            {s.label}
                          </div>
                          <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>
                            {s.sub}
                          </div>
                        </div>
                        {state === 'active' && (
                          <div style={{ width: 80 }}>
                            <div className="progress-indeterminate" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {mode === 'done' && resultSummary && (
                    <div
                      style={{
                        marginTop: 6,
                        padding: 14,
                        borderRadius: 6,
                        background: 'var(--esg-green-light)',
                        border: '1px solid rgba(45,106,79,0.25)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--esg-mono)',
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          color: 'var(--esg-green-text)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Result
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'var(--esg-sans)',
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: 'var(--esg-fg)',
                        }}
                      >
                        {resultSummary}
                      </p>
                      <div style={{ marginTop: 10 }}>
                        <button
                          onClick={reset}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 999,
                            background: 'var(--esg-surface)',
                            border: '1px solid var(--esg-border)',
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 11,
                            color: 'var(--esg-fg)',
                            cursor: 'pointer',
                          }}
                        >
                          New analysis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT — queue + lenses */}
          <div className="flex flex-col gap-4" style={{ minWidth: 0 }}>
            <Card title="Matter documents" sub={`${M.documents.length} files · 280 pp total`} padding={0}>
              {M.documents.map((d, i) => (
                <div
                  key={i}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: 'auto minmax(0,1fr) auto',
                    gap: 12,
                    padding: '12px 18px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 32,
                      height: 38,
                      borderRadius: 3,
                      background: d.status === 'Analyzed' ? 'var(--esg-green-light)' : 'var(--esg-surface-2)',
                      color: d.status === 'Analyzed' ? 'var(--esg-green-text)' : 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      border: '1px solid var(--esg-border)',
                    }}
                  >
                    {d.name.endsWith('.pdf') ? 'PDF' : 'DOC'}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="truncate"
                      style={{ fontFamily: 'var(--esg-mono)', fontSize: 11.5, color: 'var(--esg-fg)' }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--esg-mono)',
                        fontSize: 10.5,
                        color: 'var(--esg-fg-muted)',
                        marginTop: 2,
                      }}
                    >
                      {d.size} · {d.pages} pp · {d.flags} flags
                    </div>
                  </div>
                  <Badge tone={d.status === 'Analyzed' ? 'safe' : 'neutral'}>{d.status}</Badge>
                </div>
              ))}
            </Card>

            <Card title="What we check for" sub="six analysis lenses">
              {LENSES.map((x, i) => (
                <div
                  key={i}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '12px minmax(0,1fr) auto',
                    gap: 10,
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--esg-orange)' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, fontWeight: 500 }}>{x.l}</div>
                    <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>{x.r}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{x.n}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
