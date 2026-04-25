import type { CompanyDataset } from '../../lib/mockData';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

const SEV_LABEL: Record<Severity, string> = {
  CRITICAL: '!!! CRITICAL',
  HIGH:     '!! HIGH',
  MEDIUM:   '! MEDIUM',
  LOW:      'LOW',
};

export default function AuditReportPrint({ data }: { data: CompanyDataset }) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const sortedFlags = [...data.exportFlags].sort((a, b) => {
    const order: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return order.indexOf(a.severity as Severity) - order.indexOf(b.severity as Severity);
  });

  return (
    <div className="print-only" style={{ display: 'none', fontFamily: 'Georgia, serif', color: '#000', background: '#fff', padding: '40px 48px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
          ESG LENS · Legal Compliance Suite v1.0
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Legal Audit Report
        </h1>
        <div style={{ fontSize: '16px', color: '#333' }}>
          {data.company.name} — {data.company.sector}
        </div>
      </div>

      {/* Report metadata */}
      <table style={{ width: '100%', fontSize: '12px', fontFamily: 'monospace', borderCollapse: 'collapse', marginBottom: '28px' }}>
        <tbody>
          {[
            ['Company',        `${data.company.name} [${data.company.ticker}]`],
            ['Jurisdiction',   data.company.jurisdiction],
            ['Report Title',   data.company.reportTitle],
            ['Reporting Year', `FY${data.company.reportYear}`],
            ['Generated',      today],
            ['Risk Level',     data.compliance.riskLevel],
            ['Compliance Score', `${data.compliance.overallScore}/100 — Grade ${data.compliance.grade}`],
            ['Critical Flags', String(data.compliance.criticalFlags)],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px 0', color: '#666', width: '160px' }}>{label}</td>
              <td style={{ padding: '5px 0', fontWeight: 500 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Risk inventory */}
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '6px', marginBottom: '14px' }}>
        Detected Legal Risks — {sortedFlags.length} Flag{sortedFlags.length !== 1 ? 's' : ''}
      </h2>

      {sortedFlags.map((flag, i) => (
        <div key={flag.id} style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: i < sortedFlags.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}>{flag.id}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}>
              {SEV_LABEL[flag.severity as Severity]} · {flag.category}
            </span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', marginBottom: '4px' }}>
            Regulation: {flag.regulation}
            {flag.page ? ` · Ref: ${flag.page}` : ''}
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.6 }}>{flag.description}</div>
        </div>
      ))}

      {/* Emissions summary */}
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '6px', marginBottom: '14px', marginTop: '28px' }}>
        Emission Trajectory vs. Pledged Targets
      </h2>
      <table style={{ width: '100%', fontSize: '12px', fontFamily: 'monospace', borderCollapse: 'collapse', marginBottom: '28px' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['Year', 'Actual (ktCO₂e)', 'Pledged Target', 'Variance'].map((h) => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #ccc', fontSize: '11px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.emissions.map((e) => {
            const variance = e.actual - e.pledgedTarget;
            return (
              <tr key={e.year} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '5px 8px' }}>{e.year}</td>
                <td style={{ padding: '5px 8px' }}>{e.actual.toLocaleString()}</td>
                <td style={{ padding: '5px 8px' }}>{e.pledgedTarget.toLocaleString()}</td>
                <td style={{ padding: '5px 8px', fontWeight: variance > 0 ? 'bold' : 'normal' }}>
                  {variance > 0 ? '+' : ''}{variance.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '14px', borderTop: '2px solid #000', fontSize: '10px', fontFamily: 'monospace', color: '#666', lineHeight: 1.7 }}>
        <strong>LEGAL DISCLAIMER</strong><br />
        This report was generated by ESG Lens, an automated AI-assisted analysis tool. It does not constitute formal legal advice. All findings must be reviewed by qualified legal counsel before any regulatory submission, investor communication, or enforcement response. Regulations referenced include EU CSRD, SFDR, Green Claims Directive 2024/825, EU Taxonomy Regulation, and Turkish SPK Tebliği III-35.2.<br /><br />
        ESG Lens v1.0 · Generated {today} · Confidential — For Internal Legal Review Only
      </div>
    </div>
  );
}
