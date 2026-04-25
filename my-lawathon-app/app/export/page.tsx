'use client';

import { useState } from 'react';
import { useDataset } from '../../lib/DatasetContext';
import {
  Download,
  FileText,
  Table2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Scale,
  FileDown,
  Printer,
} from 'lucide-react';
import AuditReportPrint from './AuditReportPrint';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

const SEVERITY_ORDER: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: 'rgba(239,68,68,0.15)',   text: '#F87171',             border: 'rgba(239,68,68,0.4)' },
  HIGH:     { bg: 'rgba(249,115,22,0.12)',   text: '#FB923C',             border: 'rgba(249,115,22,0.3)' },
  MEDIUM:   { bg: 'var(--amber-dim)',        text: 'var(--amber)',        border: 'rgba(245,158,11,0.3)' },
  LOW:      { bg: 'var(--accent-green-dim)', text: 'var(--accent-green)', border: 'var(--border-accent)' },
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-lg z-50 animate-fade-up"
      style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animationFillMode: 'forwards' }}
    >
      <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace' }}>{message}</span>
      <button onClick={onClose} className="ml-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>✕</button>
    </div>
  );
}

export default function ExportPage() {
  const { activeDataset: data } = useDataset();
  const [toast, setToast] = useState<string | null>(null);

  const handlePDF = () => {
    window.print();
  };

  const handleCSV = () => {
    const today = new Date().toISOString().slice(0, 10);
    const headers = ['Flag ID', 'Company Name', 'Risk Type', 'Severity', 'Regulation Cited', 'Description', 'Page Reference', 'Detected Date'];
    const rows = data.exportFlags.map((f) =>
      [
        f.id,
        `"${data.company.name}"`,
        f.category,
        f.severity,
        `"${f.regulation.replace(/"/g, '""')}"`,
        `"${f.description.replace(/"/g, '""')}"`,
        f.page ?? '—',
        today,
      ].join(',')
    );
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `ESGLens_Audit_${data.company.ticker}_${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast(`CSV exported — ${data.exportFlags.length} flags for ${data.company.name}`);
    setTimeout(() => setToast(null), 4000);
  };

  const sortedFlags = [...data.exportFlags].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity as Severity) - SEVERITY_ORDER.indexOf(b.severity as Severity)
  );

  const countBySeverity = (sev: Severity) => data.exportFlags.filter((f) => f.severity === sev).length;

  return (
    <>
      {/* Print-only audit report — hidden on screen, visible when printing */}
      <AuditReportPrint data={data} />

      {/* Screen UI — hidden when printing */}
      <div className="no-print px-8 py-6 max-w-7xl mx-auto">
        <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
            Legal Audit Export
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Full risk inventory with regulatory citations · Generated {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Report header card */}
        <div className="card p-6 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards' }}>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <Building2 size={16} style={{ color: 'var(--blue-data)' }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>{data.company.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{data.company.ticker} · {data.company.sector}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {[
                  { label: 'Jurisdiction', value: data.company.jurisdiction },
                  { label: 'Report Year',  value: `FY${data.company.reportYear}` },
                  { label: 'Risk Level',   value: data.compliance.riskLevel },
                  { label: 'Overall Score', value: `${data.compliance.overallScore}/100 (${data.compliance.grade})` },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ color: 'var(--text-muted)' }}>{m.label}</div>
                    <div className="font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {SEVERITY_ORDER.map((sev) => {
                const count = countBySeverity(sev);
                if (count === 0) return null;
                const cfg = SEVERITY_CONFIG[sev];
                return (
                  <div key={sev} className="flex items-center gap-3 px-3 py-1.5 rounded-md" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <span className="text-xs font-bold w-16 tracking-widest" style={{ color: cfg.text, fontFamily: 'IBM Plex Mono, monospace' }}>{sev}</span>
                    <span className="text-xl font-light" style={{ color: cfg.text, fontFamily: 'IBM Plex Mono, monospace' }}>{count}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>flag{count !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Download buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ opacity: 0, animationDelay: '160ms', animationFillMode: 'forwards' }}>
          <button
            onClick={handlePDF}
            className="flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(59,130,246,0.35)', cursor: 'pointer' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <FileText size={22} style={{ color: 'var(--blue-data)' }} />
            </div>
            <div className="text-left">
              <div className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
                Download Legal Audit Report
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                PDF via browser print dialog · Save As PDF
              </div>
            </div>
            <FileDown size={18} style={{ color: 'var(--blue-data)', marginLeft: 'auto' }} />
          </button>

          <button
            onClick={handleCSV}
            className="flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.06) 100%)', border: '1px solid var(--border-accent)', cursor: 'pointer' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}>
              <Table2 size={22} style={{ color: 'var(--accent-green)' }} />
            </div>
            <div className="text-left">
              <div className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
                Export Risk Data (CSV)
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                Direct browser download · All flags + metadata
              </div>
            </div>
            <Download size={18} style={{ color: 'var(--accent-green)', marginLeft: 'auto' }} />
          </button>
        </div>

        {/* Risk table */}
        <div className="card animate-fade-up" style={{ opacity: 0, animationDelay: '240ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} style={{ color: 'var(--amber)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
                Detected Risk Inventory
              </h3>
              <span className="ml-1 px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'var(--danger-dim)', color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {data.exportFlags.length} Flags
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Printer size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {data.company.ticker}_FY{data.company.reportYear}
              </span>
            </div>
          </div>

          {/* Table header */}
          <div className="grid" style={{ gridTemplateColumns: '100px 120px 1fr 1fr 80px' }}>
            {['Flag ID', 'Severity', 'Regulation', 'Description', 'Ref.'].map((h) => (
              <div key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', borderBottom: '1px solid var(--border-subtle)' }}>{h}</div>
            ))}
          </div>

          {sortedFlags.map((flag, i) => {
            const sev = flag.severity as Severity;
            const cfg = SEVERITY_CONFIG[sev];
            const isEven = i % 2 === 0;
            return (
              <div
                key={flag.id}
                className="grid items-start"
                style={{ gridTemplateColumns: '100px 120px 1fr 1fr 80px', background: isEven ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', wordBreak: 'break-word' }}>{flag.id}</div>
                <div className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-bold tracking-widest uppercase" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap' }}>{flag.severity}</span>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{flag.category}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-start gap-1.5">
                    <Scale size={11} style={{ color: 'var(--blue-data)', marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.5 }}>{flag.regulation}</span>
                  </div>
                </div>
                <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>{flag.description}</div>
                <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{flag.page ?? '—'}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-start gap-3 px-4 py-3 rounded-lg animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', opacity: 0, animationDelay: '360ms', animationFillMode: 'forwards' }}>
          <FileText size={13} style={{ color: 'var(--text-muted)', marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Legal Disclaimer:</strong> This report is generated by an automated AI-assisted analysis system and does not constitute formal legal advice. All findings should be reviewed by qualified legal counsel prior to any regulatory submission. ESG Lens v1.0 · {new Date().getFullYear()}.
          </p>
        </div>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
