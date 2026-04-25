'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  File,
} from 'lucide-react';
import Link from 'next/link';

type UploadStage = 'idle' | 'uploading' | 'parsing' | 'scoring' | 'complete' | 'error';

const STAGES: { key: UploadStage; label: string; detail: string }[] = [
  { key: 'uploading', label: 'Uploading document…',           detail: 'Transferring file to secure parsing environment' },
  { key: 'parsing',   label: 'LLM parsing in progress…',      detail: 'Extracting sustainability claims, pledges, and financial disclosures' },
  { key: 'scoring',   label: 'Generating legal risk scores…', detail: 'Cross-referencing against EU Green Claims Directive, CSRD, and SFDR frameworks' },
  { key: 'complete',  label: 'Analysis complete',             detail: 'Greenwashing risk profile generated successfully' },
];

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-normal)' }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%`, background: color }}
      />
    </div>
  );
}

export default function AnalysisPage() {
  const [stage, setStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runSimulation = useCallback((name: string, size: string) => {
    setFileName(name);
    setFileSize(size);
    setStage('uploading');
    setProgress(0);

    // Stage 1: uploading (0 → 30%)
    let p = 0;
    const s1 = setInterval(() => {
      p += 3;
      setProgress(p);
      if (p >= 30) {
        clearInterval(s1);
        setStage('parsing');
        // Stage 2: parsing (30 → 70%)
        const s2 = setInterval(() => {
          p += 1.5;
          setProgress(p);
          if (p >= 70) {
            clearInterval(s2);
            setStage('scoring');
            // Stage 3: scoring (70 → 100%)
            const s3 = setInterval(() => {
              p += 2;
              setProgress(Math.min(p, 100));
              if (p >= 100) {
                clearInterval(s3);
                setStage('complete');
                setProgress(100);
              }
            }, 60);
          }
        }, 80);
      }
    }, 50);
  }, []);

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setStage('error');
      return;
    }
    const kb = (file.size / 1024).toFixed(0);
    const size = Number(kb) > 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${kb} KB`;
    runSimulation(file.name, size);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const reset = () => { setStage('idle'); setProgress(0); setFileName(null); setFileSize(null); };

  const currentStageIndex = STAGES.findIndex((s) => s.key === stage);
  const stageColor =
    stage === 'complete' ? 'var(--accent-green)' :
    stage === 'error'    ? 'var(--danger)'        : 'var(--blue-data)';

  return (
    <div className="px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
          Sustainability Report Parser
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Accepted formats: PDF, DOCX · Max file size: 50 MB · Parsed under EU data residency standards
        </p>
      </div>

      {/* Upload zone */}
      {stage === 'idle' && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="animate-fade-up"
          style={{
            opacity: 0,
            animationFillMode: 'forwards',
            animationDelay: '100ms',
            cursor: 'pointer',
            background: isDragging ? 'rgba(59,130,246,0.08)' : 'var(--bg-card)',
            border: `2px dashed ${isDragging ? 'var(--blue-data)' : 'var(--border-normal)'}`,
            borderRadius: '12px',
            padding: '64px 40px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            <Upload size={28} style={{ color: 'var(--blue-data)' }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.3rem' }}>
            Upload Corporate Sustainability Report or Financial Prospectus for Legal Parsing
          </h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Drag and drop your file here, or click to browse
          </p>
          <div className="flex justify-center gap-3">
            {['.PDF', '.DOCX'].map((ext) => (
              <span key={ext} className="px-3 py-1 rounded text-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-normal)', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {ext}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            All documents are processed in an isolated, encrypted environment and are not retained post-analysis.
          </p>
        </div>
      )}

      {/* Progress view */}
      {(stage === 'uploading' || stage === 'parsing' || stage === 'scoring') && (
        <div className="card p-8 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {/* File info */}
          <div className="flex items-center gap-4 mb-8 px-4 py-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <File size={18} style={{ color: 'var(--blue-data)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace' }}>{fileName}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{fileSize}</div>
            </div>
            <Loader2 size={16} style={{ color: 'var(--blue-data)', animation: 'spin 1s linear infinite' }} />
          </div>

          {/* Overall progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>Analysis Progress</span>
              <span className="text-xs font-bold" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} color="var(--blue-data)" />
          </div>

          {/* Stage list */}
          <div className="flex flex-col gap-3">
            {STAGES.slice(0, 3).map((s, i) => {
              const isDone    = currentStageIndex > i;
              const isCurrent = currentStageIndex === i;
              return (
                <div key={s.key} className="flex items-start gap-3 px-4 py-3 rounded-lg transition-all" style={{ background: isCurrent ? 'var(--blue-dim)' : 'var(--bg-secondary)', border: `1px solid ${isCurrent ? 'rgba(59,130,246,0.25)' : 'var(--border-subtle)'}` }}>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5" style={{ background: isDone ? 'var(--accent-green-dim)' : isCurrent ? 'var(--blue-dim)' : 'var(--border-normal)', border: `1px solid ${isDone ? 'var(--border-accent)' : isCurrent ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)'}` }}>
                    {isDone
                      ? <CheckCircle2 size={12} style={{ color: 'var(--accent-green)' }} />
                      : isCurrent
                        ? <Loader2 size={10} style={{ color: 'var(--blue-data)', animation: 'spin 1s linear infinite' }} />
                        : <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)' }} />
                    }
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: isCurrent ? 'var(--text-primary)' : isDone ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete state */}
      {stage === 'complete' && (
        <div className="card p-8 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards', border: '1px solid var(--border-accent)' }}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.4rem' }}>
              Analysis Complete
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Legal risk profile generated for <strong style={{ color: 'var(--text-primary)' }}>{fileName}</strong>
            </p>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Greenlighting Risk',  value: 'HIGH',   color: 'var(--danger)' },
              { label: 'Greenrinsing Risk',   value: 'CRITICAL', color: 'var(--danger)' },
              { label: 'Compliance Score',    value: '23/100', color: 'var(--danger)' },
            ].map((m) => (
              <div key={m.label} className="text-center px-4 py-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-lg font-bold" style={{ color: m.color, fontFamily: 'IBM Plex Mono, monospace' }}>{m.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <ProgressBar progress={100} color="var(--accent-green)" />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent-green)', color: '#000', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              View Analysis Results <ArrowRight size={15} />
            </Link>
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-normal)', color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              <X size={14} /> Upload Another Document
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="card p-8 flex flex-col items-center text-center animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={28} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.2rem' }}>Unsupported File Format</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>Only PDF and DOCX files are accepted. Please re-upload a compatible document.</p>
          <button onClick={reset} className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-normal)', color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <X size={14} /> Try Again
          </button>
        </div>
      )}

      {/* Info panels */}
      {stage === 'idle' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: FileText,     title: 'Supported Standards',    body: 'EU CSRD, SFDR, Green Claims Directive, EU Taxonomy Regulation, ESRS E1 series' },
            { icon: AlertCircle,  title: 'What is Analyzed',       body: 'Sustainability claims, Net Zero pledges, CapEx allocation, revenue attribution, and interim target consistency' },
            { icon: CheckCircle2, title: 'Output Delivered',       body: 'Legal risk scores (Greenlighting + Greenrinsing), regulation citations, and exportable audit report' },
          ].map((info, i) => {
            const Icon = info.icon;
            return (
              <div key={i} className="card p-4 animate-fade-up" style={{ animationDelay: `${200 + i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>{info.title}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>{info.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Spin keyframe inline */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
