import { mockCaseLaw, mockOffsetProjects, type OffsetProject } from '../../lib/caseData';
import LegalDisclaimer from '../../components/LegalDisclaimer';

const PROSE_MAX = '72ch';
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' };
const SANS: React.CSSProperties = { fontFamily: 'var(--font-sans)' };
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' };

const SCORE_CARDS = [
  {
    title: 'Keyword Analysis — 30%',
    body:
      '13 high-risk terms and 25 synonyms are scanned with case-insensitive substring matching. ' +
      'Each matched term contributes to the score.',
  },
  {
    title: 'Precedent Case Matching — 40%',
    body:
      'Detected terms are compared against a database of 20 real court rulings. ' +
      'Weighting is derived from the average similarity threshold across matched cases.',
  },
  {
    title: 'Offset Integrity — 30%',
    body:
      'If the claim references a named offset project, that project\'s additionality, ' +
      'permanence and leakage scores are folded into the assessment.',
  },
];

const RISK_ZONES = [
  { range: '0–29',   label: 'Safe Claim',     desc: 'No concrete violation pattern detected',           color: 'var(--accent-green)', bg: 'var(--green-light)' },
  { range: '30–69',  label: 'Grey Zone',      desc: 'Potentially misleading — legal review recommended', color: 'var(--amber)',         bg: 'var(--amber-light)' },
  { range: '70–100', label: 'Litigable',      desc: 'High alignment with documented court rulings',     color: 'var(--red)',           bg: 'var(--red-light)' },
];

const LIMITATIONS = [
  {
    title: 'No Formal Validation',
    body:
      'The platform has not been measured for precision/recall against a labelled test set. ' +
      'Built in a hackathon context and undergoing independent validation.',
  },
  {
    title: 'Semantic Blind Spot',
    body:
      'Keyword detection relies on exact substring matching. A claim using synonyms or ' +
      "idiomatic phrasing may bypass the pre-filter; this is partially mitigated by OpenAI's " +
      'semantic understanding.',
  },
  {
    title: 'Geographic Scope',
    body:
      'The case database covers EU and UK jurisdictions. Jurisdiction-specific case law for ' +
      'other regions is still being integrated.',
  },
  {
    title: 'AI Variance',
    body:
      'GPT-4o-mini runs at temperature 0.2, but small input differences can move the score. ' +
      'For strict consistency, results should be reviewed by qualified legal counsel.',
  },
  {
    title: 'Not Legal Advice',
    body:
      'Outputs from this platform are provided for screening purposes. They are not a substitute for legal counsel.',
  },
];

const REFERENCES = [
  'Shell Netherlands v. Milieudefensie — District Court of The Hague, Judgment C/09/571932 / HA ZA 19-379 (26 May 2021)',
  'ClientEarth v. Shell — UK High Court, Case No. FL-2023-000011 (2023)',
  'Lufthansa Green Fares — Deutschen Umwelthilfe, German Consumer Authority ruling (2023)',
  'KLM "Fly Responsibly" — Reclame Code Commissie (RCC), Dossier 2022/00670 (2023)',
  'HSBC Holdings plc — UK ASA Ruling, Ref A22-1167573 (Oct 2022)',
  'BP Target Neutral — UK ASA Ruling, Ref A21-1147830 (Jan 2022)',
  'DWS Group — SEC Order, File No. 3-21376 (Sep 2023)',
  'Verra — Kariba REDD+ Project Suspension Statement (Jan 2023)',
  'Guardian/Zeit/SourceMaterial — "Revealed: more than 90% of rainforest carbon offsets by biggest certifier are worthless" (Jan 2023)',
  'Germanwatch — Carbon Offset Assessment Report (2016)',
  'EU Green Claims Directive — Directive 2024/825/EU of the European Parliament (Mar 2024)',
  'Paris Agreement Article 6 — UNFCCC, Decision 3/CMA.3 (Nov 2021)',
];

function statusBadgeStyles(status: OffsetProject['status']) {
  if (status === 'valid') return { bg: 'var(--green-light)', color: 'var(--green-text)', border: 'var(--border-strong)' };
  if (status === 'disputed') return { bg: 'var(--amber-light)', color: 'var(--amber)', border: 'rgba(176,125,42,0.3)' };
  return { bg: 'var(--red-light)', color: 'var(--red)', border: 'rgba(181,61,46,0.3)' };
}

function statusLabel(status: OffsetProject['status']) {
  if (status === 'valid') return 'Valid';
  if (status === 'disputed') return 'Disputed';
  return 'Invalid';
}

function scoreColor(score: number) {
  if (score >= 70) return 'var(--green-text)';
  if (score >= 40) return 'var(--amber)';
  return 'var(--red)';
}

const sectionH2: React.CSSProperties = {
  ...SERIF,
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-headline-md)',
  lineHeight: 'var(--line-height-headline-md)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  marginBottom: '12px',
};

const proseP: React.CSSProperties = {
  ...SANS,
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-body-lg)',
  lineHeight: 'var(--line-height-body-lg)',
  maxWidth: PROSE_MAX,
};

const tableTh: React.CSSProperties = {
  ...SANS,
  textAlign: 'left',
  padding: '10px 12px',
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-label-lg)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-surface-2)',
};

const tableTd: React.CSSProperties = {
  ...SANS,
  padding: '10px 12px',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-body-sm)',
  lineHeight: 'var(--line-height-body-sm)',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'top',
};

export default function MethodologyPage() {
  return (
    <div className="page-pad" style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Section 1 — About the platform */}
      <section style={{ marginBottom: '48px' }}>
        <h1
          style={{
            ...SERIF,
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-headline-lg)',
            lineHeight: 'var(--line-height-headline-lg)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Methodology and Data Sources
        </h1>
        <p
          style={{
            ...SANS,
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-body-lg)',
            lineHeight: 'var(--line-height-body-lg)',
            marginBottom: '24px',
          }}
        >
          ESG Lens Legal Verification Platform — Version 2.0 · April 2026
        </p>
        <p style={proseP}>
          ESG Lens is a legal-risk screening tool that automatically detects patterns
          similar to documented European greenwashing rulings in environmental marketing
          claims. It is not a legal advisory service. It flags claims where the violation
          pattern matches European case law on record, but all outputs should be reviewed
          by qualified legal counsel before any compliance decision is made.
        </p>
      </section>

      {/* Section 2 — How the Risk Score is Computed */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>How the risk score is computed</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
          {SCORE_CARDS.map((c) => (
            <div
              key={c.title}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  ...SANS,
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: '8px',
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  ...SANS,
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-body-sm)',
                  lineHeight: 'var(--line-height-body-sm)',
                }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableTh, width: '15%' }}>Range</th>
                <th style={{ ...tableTh, width: '25%' }}>Label</th>
                <th style={tableTh}>Description</th>
              </tr>
            </thead>
            <tbody>
              {RISK_ZONES.map((z) => (
                <tr key={z.range}>
                  <td style={{ ...tableTd, ...MONO, color: z.color, fontWeight: 700 }}>{z.range}</td>
                  <td style={tableTd}>
                    <span
                      style={{
                        ...SANS,
                        background: z.bg,
                        color: z.color,
                        border: `1px solid ${z.color}33`,
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: 'var(--font-size-label-lg)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {z.label}
                    </span>
                  </td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{z.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 — Precedent Case Database */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Precedent case database ({mockCaseLaw.length} cases)</h2>
        <p style={{ ...proseP, marginBottom: '20px' }}>
          All cases are sourced from primary legal records and the official rulings of
          regulatory authorities, then structured for matching.
        </p>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={tableTh}>Case ID</th>
                <th style={tableTh}>Defendant</th>
                <th style={tableTh}>Year</th>
                <th style={tableTh}>Jurisdiction</th>
                <th style={tableTh}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {mockCaseLaw.map((c) => (
                <tr key={c.id}>
                  <td style={{ ...tableTd, ...MONO, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c.id}</td>
                  <td style={{ ...tableTd, fontWeight: 600 }}>{c.defendant}</td>
                  <td style={{ ...tableTd, ...MONO, color: 'var(--text-secondary)' }}>{c.year}</td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{c.jurisdiction}</td>
                  <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>
                    {c.outcome.length > 80 ? c.outcome.slice(0, 80) + '...' : c.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4 — Offset Project Database */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Offset project integrity database</h2>
        <p style={{ ...proseP, marginBottom: '20px' }}>
          Scores are derived from academic literature, corporate audit reports and
          independent researcher findings.
        </p>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={tableTh}>Project</th>
                <th style={tableTh}>Type</th>
                <th style={tableTh}>Certification</th>
                <th style={tableTh}>Overall Score</th>
                <th style={tableTh}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOffsetProjects.map((p) => {
                const badge = statusBadgeStyles(p.status);
                return (
                  <tr key={p.projectName}>
                    <td style={{ ...tableTd, fontWeight: 600 }}>{p.projectName}</td>
                    <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{p.projectType}</td>
                    <td style={{ ...tableTd, color: 'var(--text-secondary)' }}>{p.certificationBody}</td>
                    <td style={{ ...tableTd, ...MONO, color: scoreColor(p.overallIntegrityScore), fontWeight: 700 }}>
                      {p.overallIntegrityScore}/100
                    </td>
                    <td style={tableTd}>
                      <span
                        style={{
                          ...SANS,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          fontSize: 'var(--font-size-label-lg)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {statusLabel(p.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5 — Known Limitations */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Known limitations</h2>
        <ol
          style={{
            listStyle: 'decimal',
            paddingLeft: '24px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {LIMITATIONS.map((l, i) => (
            <li
              key={i}
              style={{
                ...SANS,
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-body-lg)',
                lineHeight: 'var(--line-height-body-lg)',
                maxWidth: PROSE_MAX,
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.title}</span>
              <br />
              {l.body}
            </li>
          ))}
        </ol>
      </section>

      {/* Section 6 — Data Sources */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={sectionH2}>Data sources and references</h2>
        <ul
          style={{
            listStyle: 'disc',
            paddingLeft: '24px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {REFERENCES.map((r, i) => (
            <li
              key={i}
              style={{
                ...SANS,
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-body-md)',
                lineHeight: 'var(--line-height-body-md)',
                maxWidth: PROSE_MAX,
              }}
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <LegalDisclaimer variant="inline" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />
      <p
        style={{
          ...SANS,
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-label-lg)',
          lineHeight: 1.6,
        }}
      >
        ESG Lens — Team Sürdüremeyenler · Sabancı University Law-a-thon 2026 · Last updated: April 2026
      </p>
    </div>
  );
}
