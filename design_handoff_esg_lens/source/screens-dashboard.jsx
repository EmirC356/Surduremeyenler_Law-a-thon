// Three dashboard variations
// V1 Editorial — calm, serif-heavy, brief-like
// V2 Evidence-grid — dense, terminal vibe, lots of data per pixel
// V3 Triage — workflow-first, queue of flags + actions
// All consume window.MOCK and shared shell components.

const M = window.MOCK;
const { ICON, AppShell, useI18N } = window;

// Small primitives ────────────────────────────────────────────────
function Card({ children, title, sub, action, style = {}, padding = 20 }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--esg-border)",
      borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", ...style,
    }}>
      {(title || action) && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: `${padding - 4}px ${padding}px 0`,
        }}>
          <div>
            {title && <div style={{ fontFamily: "var(--esg-serif)", fontSize: 14.5, fontWeight: 600, color: "var(--esg-fg)" }}>{title}</div>}
            {sub && <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 3, letterSpacing: "0.04em" }}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

function Badge({ tone = "amber", children }) {
  const map = {
    safe:    { bg: "var(--esg-green-light)", fg: "var(--esg-green-text)", bd: "rgba(45,106,79,0.25)" },
    caution: { bg: "var(--esg-amber-light)", fg: "var(--esg-amber)",      bd: "rgba(176,125,42,0.25)" },
    risk:    { bg: "var(--esg-orange-light)", fg: "var(--esg-orange-dark)", bd: "rgba(196,98,45,0.25)" },
    litig:   { bg: "var(--esg-red-light)",    fg: "var(--esg-red)",        bd: "rgba(181,61,46,0.25)" },
    neutral: { bg: "var(--esg-surface-2)",    fg: "var(--esg-fg-muted)",   bd: "var(--esg-border)" },
  };
  const c = map[tone] || map.neutral;
  return <span style={{
    background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
    fontFamily: "var(--esg-mono)", fontSize: 10, fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap",
  }}>{children}</span>;
}

function RegPill({ children }) {
  return <span style={{
    background: "var(--esg-surface-2)", color: "var(--esg-fg-muted)",
    fontFamily: "var(--esg-mono)", fontSize: 10, fontWeight: 500,
    padding: "2px 6px", borderRadius: 3, border: "1px solid var(--esg-border)",
    letterSpacing: "0.04em",
  }}>{children}</span>;
}

function severityTone(sev) {
  return sev === "Litigation" ? "litig" : sev === "Risk" ? "risk" : sev === "Caution" ? "caution" : "safe";
}

// Risk thermometer: 0-100, marker positioned
function Thermometer({ score, big = false }) {
  const color = score < 30 ? "var(--esg-red)" : score < 55 ? "var(--esg-orange)" : score < 75 ? "var(--esg-amber)" : "var(--esg-green-text)";
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        position: "relative", height: big ? 18 : 12, borderRadius: 999,
        background: "linear-gradient(to right, #2D6A4F 0%, #B07D2A 50%, #B53D2E 100%)",
        opacity: 0.95,
      }}>
        <div style={{
          position: "absolute", top: -3, bottom: -3,
          left: `calc(${score}% - 9px)`,
          width: 18, height: big ? 24 : 18,
          background: "#F0EDE6", border: `2px solid ${color}`,
          borderRadius: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "var(--esg-fg-muted)", letterSpacing: "0.08em" }}>
        <span>0 · LITIGATION</span><span>50 · CAUTION</span><span>100 · SAFE</span>
      </div>
    </div>
  );
}

// Sparkline / line chart ──────────────────────────────────────────
function EmissionsChart({ height = 180 }) {
  const data = M.emissions;
  const w = 560, h = height, pad = { l: 36, r: 16, t: 16, b: 22 };
  const xs = data.map((_, i) => pad.l + (i * (w - pad.l - pad.r)) / (data.length - 1));
  const max = 50, min = 0;
  const yFor = v => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);

  const actual = data.filter(d => d.a != null);
  const aPath = actual.map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${yFor(d.a)}`).join(" ");
  const tPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${yFor(d.t)}`).join(" ");

  const gridYs = [0, 12.5, 25, 37.5, 50];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block" }}>
      {gridYs.map(g => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={yFor(g)} y2={yFor(g)} stroke="var(--esg-border)" strokeDasharray="3 3" />
          <text x={pad.l - 6} y={yFor(g) + 3} fontSize="9" textAnchor="end" fill="var(--esg-fg-muted)" fontFamily="var(--esg-mono)">{g}</text>
        </g>
      ))}
      {/* Target line (dashed green) */}
      <path d={tPath} stroke="var(--esg-green-mid)" strokeWidth="1.6" fill="none" strokeDasharray="5 4" />
      {/* Actual line (red) */}
      <path d={aPath} stroke="var(--esg-red)" strokeWidth="2.4" fill="none" />
      {/* Gap area */}
      <path d={`${aPath} L ${xs[actual.length - 1]} ${yFor(data[actual.length - 1].t)} L ${xs[0]} ${yFor(data[0].t)} Z`}
        fill="var(--esg-red)" opacity="0.08" />
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={h - 6} fontSize="9.5" textAnchor="middle" fill="var(--esg-fg-muted)" fontFamily="var(--esg-mono)">{d.y}</text>
      ))}
      {actual.map((d, i) => (
        <circle key={i} cx={xs[i]} cy={yFor(d.a)} r="3" fill="var(--esg-red)" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// V1 — Editorial Brief
// ═══════════════════════════════════════════════════════════════════
function DashboardEditorial() {
  const t = useI18N();
  const sev = M.kpis.overallScore < 30;

  return (
    <AppShell active="dashboard" title={t.titles.dashboard} subtitle={t.titles.dashboardSub}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* Brief masthead */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24,
          borderBottom: "1px solid var(--esg-border)", paddingBottom: 24, marginBottom: 24,
        }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <Badge tone="litig">Critical exposure</Badge>
              <RegPill>EU 2024/825</RegPill>
              <RegPill>CSRD · ESRS E1</RegPill>
              <RegPill>SFDR</RegPill>
            </div>
            <h2 style={{
              margin: 0, fontFamily: "var(--esg-serif)", fontSize: 34, lineHeight: 1.15,
              fontWeight: 600, letterSpacing: "-0.02em", color: "var(--esg-fg)",
            }}>
              In the matter of <em style={{ fontStyle: "italic" }}>Apex Hydrocarbon Solutions</em>,
              prepared for Borowski Çelik LLP.
            </h2>
            <p style={{
              marginTop: 14, fontFamily: "var(--esg-serif)", fontSize: 16, lineHeight: 1.6,
              color: "var(--esg-fg)", maxWidth: 720,
            }}>
              Across {M.kpis.docsAnalyzed} disclosures spanning {M.company.pages + 38 + 14} pages, ESG Lens identified{" "}
              <strong>{M.kpis.flagsTotal} legal exposure points</strong> — {M.kpis.flagsCritical} of which rise to
              <strong> litigation-grade risk</strong> under EU Green Claims Directive 2024/825.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 16, fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>
              <span>{t.common.analyzedAt} · {M.company.analyzedAt}</span>
              <span>·</span>
              <span>{t.common.analyst} · {M.company.analyst}</span>
            </div>
          </div>

          <div style={{
            background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8,
            padding: 22, boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--esg-fg-muted)", textTransform: "uppercase" }}>
                Compliance score
              </div>
              <Badge tone="litig">{M.kpis.riskTier}</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 72, lineHeight: 1, color: "var(--esg-red)", letterSpacing: "-0.05em" }}>
                {M.kpis.overallScore}
              </span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 16, color: "var(--esg-fg-muted)" }}>/ 100</span>
            </div>
            <div style={{ marginTop: 14 }}><Thermometer score={M.kpis.overallScore} /></div>
            <div style={{
              marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--esg-border)",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontFamily: "var(--esg-mono)", fontSize: 11,
            }}>
              <div><div style={{ color: "var(--esg-fg-muted)" }}>Trailing 30 d</div><div style={{ color: "var(--esg-red)", fontWeight: 600 }}>−14 pts</div></div>
              <div><div style={{ color: "var(--esg-fg-muted)" }}>Sector p50</div><div style={{ color: "var(--esg-fg)" }}>58</div></div>
            </div>
          </div>
        </div>

        {/* Findings list */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
          <Card title="Top findings" sub="ranked by legal exposure · 7 of 23 shown" action={<Badge tone="neutral">↗ View all</Badge>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {M.flags.slice(0, 5).map((f, i) => (
                <div key={f.id} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14,
                  padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
                }}>
                  <div style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)", paddingTop: 3, width: 44 }}>
                    {f.id}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                      <Badge tone="neutral">{f.kind}</Badge>
                      <RegPill>{f.regulation}</RegPill>
                    </div>
                    <div style={{ fontFamily: "var(--esg-serif)", fontSize: 15, fontWeight: 600, color: "var(--esg-fg)" }}>{f.title}</div>
                    <div style={{ fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 13, color: "var(--esg-fg-muted)", marginTop: 4 }}>
                      p. {f.page} — {f.excerpt}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 8, fontFamily: "var(--esg-sans)", fontSize: 12.5 }}>
                      <div><span style={{ color: "var(--esg-fg-muted)" }}>Claim · </span>{f.claim}</div>
                      <div><span style={{ color: "var(--esg-fg-muted)" }}>Reality · </span><span style={{ color: "var(--esg-red)" }}>{f.reality}</span></div>
                    </div>
                  </div>
                  <button style={{
                    alignSelf: "start", background: "transparent",
                    border: "1px solid var(--esg-border)", color: "var(--esg-fg-muted)",
                    padding: "6px 10px", borderRadius: 999, fontSize: 11,
                    fontFamily: "var(--esg-mono)", cursor: "pointer", letterSpacing: "0.04em",
                  }}>Open ›</button>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="Emissions vs. pledge" sub="MtCO₂e · Scope 1 + 2">
              <EmissionsChart height={170} />
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>
                <span><span style={{ display: "inline-block", width: 14, height: 2, background: "var(--esg-red)", marginRight: 6, verticalAlign: "middle" }} /> Actual</span>
                <span><span style={{ display: "inline-block", width: 14, height: 2, background: "var(--esg-green-mid)", marginRight: 6, verticalAlign: "middle", borderTop: "2px dashed" }} /> Pledged</span>
              </div>
            </Card>

            <Card title="Documents in matter" padding={0}>
              <div>
                {M.documents.map((d, i) => (
                  <div key={i} style={{
                    padding: "12px 20px", display: "grid", gridTemplateColumns: "1fr auto",
                    gap: 12, borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--esg-mono)", fontSize: 12, color: "var(--esg-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 2 }}>
                        {d.size} · {d.pages} pp · {d.flags} flags
                      </div>
                    </div>
                    <Badge tone={d.status === "Analyzed" ? "safe" : "neutral"}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// V2 — Evidence Terminal (dense, lots of data)
// ═══════════════════════════════════════════════════════════════════
function DashboardTerminal() {
  const t = useI18N();

  const KPI = ({ label, value, unit, sub, tone = "neutral" }) => (
    <div style={{
      background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 6,
      padding: 14, display: "flex", flexDirection: "column", gap: 4, minHeight: 88,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase" }}>{label}</div>
        <Badge tone={tone}>·</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 30, color: "var(--esg-fg)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontFamily: "var(--esg-mono)", fontSize: 12, color: "var(--esg-fg-muted)" }}>{unit}</span>}
      </div>
      <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: "auto" }}>{sub}</div>
    </div>
  );

  return (
    <AppShell active="dashboard" title={t.titles.dashboard} subtitle={t.titles.dashboardSub} density="dense">
      {/* Sticky meta bar */}
      <div style={{
        background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 6,
        padding: "10px 14px", display: "flex", alignItems: "center", gap: 16,
        fontFamily: "var(--esg-mono)", fontSize: 11, marginBottom: 14, flexWrap: "wrap",
      }}>
        <span style={{ color: "var(--esg-fg-muted)" }}>MATTER</span><span style={{ color: "var(--esg-fg)", fontWeight: 600 }}>2026-114</span>
        <span style={{ color: "var(--esg-border-strong)" }}>·</span>
        <span style={{ color: "var(--esg-fg-muted)" }}>FY</span><span style={{ color: "var(--esg-fg)" }}>{M.company.fy}</span>
        <span style={{ color: "var(--esg-border-strong)" }}>·</span>
        <span style={{ color: "var(--esg-fg-muted)" }}>ISIN</span><span style={{ color: "var(--esg-fg)" }}>{M.company.isin}</span>
        <span style={{ color: "var(--esg-border-strong)" }}>·</span>
        <span style={{ color: "var(--esg-fg-muted)" }}>SECTOR</span><span style={{ color: "var(--esg-fg)" }}>{M.company.sector}</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: "var(--esg-fg-muted)" }}>ANALYSIS</span><span style={{ color: "var(--esg-fg)" }}>{M.company.analyzedAt}</span>
        <Badge tone="safe">live</Badge>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 14 }}>
        <KPI label="Score" value={M.kpis.overallScore} unit="/100" sub="−14 pts in 30d" tone="litig" />
        <KPI label="Critical flags" value={M.kpis.flagsCritical} unit="" sub={`of ${M.kpis.flagsTotal} total`} tone="litig" />
        <KPI label="Reg. touchpoints" value={M.kpis.regulationsTouched} unit="" sub="EU + UK + SBTi" tone="risk" />
        <KPI label="Docs analyzed" value={M.kpis.docsAnalyzed} unit="" sub={`${M.company.pages + 86}p · 3 ms`} tone="safe" />
        <KPI label="Pledge gap" value="−41" unit="% CAGR" sub="vs. trailing +2.4%" tone="litig" />
        <KPI label="CapEx misalignment" value="76" unit="ppt" sub="marketing − capex" tone="litig" />
      </div>

      {/* Two-column data */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12, marginBottom: 12 }}>
        <Card title="Scope 1+2 trajectory" sub="actual vs. pledged MtCO₂e · 2021–2028">
          <EmissionsChart height={210} />
        </Card>

        <Card title="Risk thermometer" sub="aggregate litigation exposure">
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 78, color: "var(--esg-red)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                {M.kpis.overallScore}
              </span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 14, color: "var(--esg-fg-muted)" }}>/ 100</span>
              <span style={{ marginLeft: "auto" }}><Badge tone="litig">{M.kpis.riskTier}</Badge></span>
            </div>
            <Thermometer score={M.kpis.overallScore} big />
            <div style={{
              marginTop: 18, padding: 12, background: "var(--esg-red-light)",
              border: "1px solid rgba(181,61,46,0.2)", borderRadius: 6,
              fontFamily: "var(--esg-serif)", fontSize: 13, color: "var(--esg-fg)", lineHeight: 1.5,
            }}>
              <strong style={{ color: "var(--esg-red)" }}>Counsel note · </strong>
              7 litigation-grade exposures; recommend hold on FY25 publication pending re-draft of pledge language.
            </div>
          </div>
        </Card>
      </div>

      {/* Findings + Regulation matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <Card title="Findings register" sub="all flags · sortable" padding={0}>
          <div style={{
            display: "grid", gridTemplateColumns: "44px 1.6fr 90px 100px 120px",
            padding: "10px 16px", borderBottom: "1px solid var(--esg-border)",
            background: "var(--esg-surface-2)",
            fontFamily: "var(--esg-mono)", fontSize: 9.5, fontWeight: 600,
            color: "var(--esg-fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            <span>ID</span><span>Finding</span><span>Kind</span><span>Severity</span><span>Regulation</span>
          </div>
          {M.flags.map((f, i) => (
            <div key={f.id} style={{
              display: "grid", gridTemplateColumns: "44px 1.6fr 90px 100px 120px",
              padding: "10px 16px", gap: 8, alignItems: "center",
              borderBottom: i === M.flags.length - 1 ? "none" : "1px solid var(--esg-border)",
              fontFamily: "var(--esg-sans)", fontSize: 12.5,
            }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{f.id}</span>
              <span style={{ color: "var(--esg-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.title}</span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{f.kind}</span>
              <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
              <RegPill>{f.regulation}</RegPill>
            </div>
          ))}
        </Card>

        <Card title="Regulation touchpoints" sub="counts by source">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { r: "EU Green Claims Directive 2024/825", n: 8, tone: "litig" },
              { r: "CSRD · ESRS E1 series", n: 6, tone: "litig" },
              { r: "EU Taxonomy Reg. — Art. 8", n: 4, tone: "risk" },
              { r: "SFDR Art. 8 / 9", n: 3, tone: "risk" },
              { r: "MiFID II — Art. 24", n: 1, tone: "caution" },
              { r: "SBTi Protocol", n: 1, tone: "caution" },
            ].map(row => (
              <div key={row.r} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11.5, color: "var(--esg-fg)" }}>{row.r}</span>
                <div style={{
                  width: 80, height: 6, background: "var(--esg-surface-2)", borderRadius: 3, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${Math.min(100, row.n * 12)}%`, height: "100%",
                    background: row.tone === "litig" ? "var(--esg-red)" : row.tone === "risk" ? "var(--esg-orange)" : "var(--esg-amber)",
                  }} />
                </div>
                <span style={{ fontFamily: "var(--esg-mono)", fontSize: 12, fontWeight: 600, width: 24, textAlign: "right" }}>{row.n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// V3 — Triage workspace (action-first, queue view)
// ═══════════════════════════════════════════════════════════════════
function DashboardTriage() {
  const t = useI18N();
  const [selected, setSelected] = React.useState(0);
  const f = M.flags[selected];

  return (
    <AppShell active="dashboard" title={t.titles.dashboard} subtitle="Triage queue · 23 open flags">

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 320px", gap: 16, height: "100%", minHeight: 600 }}>

        {/* LEFT — queue */}
        <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            padding: "12px 14px", borderBottom: "1px solid var(--esg-border)",
            display: "flex", alignItems: "center", gap: 8, background: "var(--esg-surface-2)",
          }}>
            <span style={{ color: "var(--esg-fg-muted)" }}>{ICON.filter}</span>
            <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--esg-fg)", textTransform: "uppercase" }}>
              Triage queue
            </span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>23</span>
          </div>
          <div style={{ display: "flex", gap: 6, padding: "10px 12px", borderBottom: "1px solid var(--esg-border)" }}>
            {["All", "Litigation", "Risk", "Caution"].map((c, i) => (
              <button key={c} style={{
                padding: "4px 9px", borderRadius: 999,
                border: "1px solid var(--esg-border)",
                background: i === 0 ? "var(--esg-fg)" : "#fff",
                color: i === 0 ? "#fff" : "var(--esg-fg-muted)",
                fontFamily: "var(--esg-mono)", fontSize: 10, fontWeight: 600,
                cursor: "pointer", letterSpacing: "0.04em",
              }}>{c}</button>
            ))}
          </div>
          <div style={{ overflow: "auto", flex: 1 }}>
            {M.flags.map((flag, i) => (
              <div key={flag.id} onClick={() => setSelected(i)} style={{
                padding: "12px 14px", borderBottom: "1px solid var(--esg-border)",
                borderLeft: `3px solid ${i === selected ? "var(--esg-orange)" : "transparent"}`,
                background: i === selected ? "var(--esg-surface-2)" : "#fff",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", letterSpacing: "0.06em" }}>{flag.id}</span>
                  <Badge tone={severityTone(flag.severity)}>{flag.severity}</Badge>
                </div>
                <div style={{ fontFamily: "var(--esg-serif)", fontSize: 13.5, fontWeight: 600, color: "var(--esg-fg)", lineHeight: 1.3 }}>
                  {flag.title}
                </div>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 4 }}>
                  p. {flag.page} · {flag.regulation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — detail */}
        <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--esg-border)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{f.id}</span>
              <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
              <Badge tone="neutral">{f.kind}</Badge>
              <RegPill>{f.regulation}</RegPill>
            </div>
            <h2 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 22, fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
              {f.title}
            </h2>
          </div>

          <div style={{ padding: 20, flex: 1, overflow: "auto" }}>

            {/* Source excerpt */}
            <div style={{
              padding: 16, background: "var(--esg-surface-2)",
              borderLeft: "3px solid var(--esg-red)", borderRadius: 4, marginBottom: 18,
            }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                Source — {M.company.reportFile}, p. {f.page}
              </div>
              <div style={{ fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 15, lineHeight: 1.55, color: "var(--esg-fg)" }}>
                {f.excerpt}
              </div>
            </div>

            {/* Claim vs reality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div style={{ padding: 14, border: "1px solid var(--esg-border)", borderRadius: 6 }}>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 6 }}>Company claim</div>
                <div style={{ fontFamily: "var(--esg-serif)", fontSize: 14, color: "var(--esg-fg)", lineHeight: 1.45 }}>{f.claim}</div>
              </div>
              <div style={{ padding: 14, border: "1px solid rgba(181,61,46,0.25)", borderRadius: 6, background: "var(--esg-red-light)" }}>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--esg-red)", textTransform: "uppercase", marginBottom: 6 }}>Verified reality</div>
                <div style={{ fontFamily: "var(--esg-serif)", fontSize: 14, color: "var(--esg-fg)", lineHeight: 1.45 }}>{f.reality}</div>
              </div>
            </div>

            {/* Exposure */}
            <div style={{ paddingTop: 14, borderTop: "1px solid var(--esg-border)" }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 8 }}>Potential exposure</div>
              <div style={{ fontFamily: "var(--esg-serif)", fontSize: 15, color: "var(--esg-fg)", lineHeight: 1.5 }}>{f.damages}</div>
            </div>
          </div>

          <div style={{
            padding: "12px 20px", borderTop: "1px solid var(--esg-border)",
            display: "flex", gap: 8, background: "var(--esg-surface-2)",
          }}>
            <button style={{
              padding: "8px 14px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
              color: "#fff", border: "none", fontFamily: "var(--esg-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Add to brief</button>
            <button style={{
              padding: "8px 14px", borderRadius: 999, background: "#fff",
              color: "var(--esg-orange)", border: "1px solid rgba(196,98,45,0.4)",
              fontFamily: "var(--esg-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Request rebuttal</button>
            <button style={{
              padding: "8px 14px", borderRadius: 999, background: "transparent",
              color: "var(--esg-fg-muted)", border: "1px solid var(--esg-border)",
              fontFamily: "var(--esg-sans)", fontSize: 12, cursor: "pointer",
            }}>Mark reviewed</button>
            <span style={{ flex: 1 }} />
            <span style={{ alignSelf: "center", fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>
              Finding {selected + 1} of {M.flags.length}
            </span>
          </div>
        </div>

        {/* RIGHT — context */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card title="At a glance" sub="matter health">
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 56, color: "var(--esg-red)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                {M.kpis.overallScore}
              </span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 12, color: "var(--esg-fg-muted)" }}>/100</span>
              <span style={{ marginLeft: "auto" }}><Badge tone="litig">{M.kpis.riskTier}</Badge></span>
            </div>
            <Thermometer score={M.kpis.overallScore} />
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontFamily: "var(--esg-mono)", fontSize: 11 }}>
              <div><div style={{ color: "var(--esg-fg-muted)" }}>Flags · critical</div><div style={{ color: "var(--esg-red)", fontWeight: 600, fontSize: 18 }}>{M.kpis.flagsCritical}</div></div>
              <div><div style={{ color: "var(--esg-fg-muted)" }}>Flags · total</div><div style={{ color: "var(--esg-fg)", fontSize: 18 }}>{M.kpis.flagsTotal}</div></div>
            </div>
          </Card>

          <Card title="Deadlines" sub="next 30 days">
            {[
              { d: "May 17", l: "CSRD assurance draft due", tone: "litig" },
              { d: "May 22", l: "Counsel sign-off · Pledge memo", tone: "risk" },
              { d: "Jun 04", l: "Board pre-read circulated", tone: "caution" },
            ].map((x, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
              }}>
                <div style={{ width: 56, fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{x.d}</div>
                <div style={{ flex: 1, fontFamily: "var(--esg-sans)", fontSize: 12.5, color: "var(--esg-fg)" }}>{x.l}</div>
                <Badge tone={x.tone}>·</Badge>
              </div>
            ))}
          </Card>

          <Card title="Activity" sub="last 24 h">
            {[
              { who: "M. Çelik", what: "annotated GL-01", when: "2 m ago" },
              { who: "System", what: "re-ran scope 1+2 model", when: "1 h ago" },
              { who: "P. Sarı", what: "added 2 pages to matter", when: "3 h ago" },
            ].map((x, i) => (
              <div key={i} style={{ padding: "8px 0", borderTop: i === 0 ? "none" : "1px solid var(--esg-border)" }}>
                <div style={{ fontFamily: "var(--esg-sans)", fontSize: 12.5 }}>
                  <strong>{x.who}</strong> {x.what}
                </div>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)" }}>{x.when}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

Object.assign(window, { DashboardEditorial, DashboardTerminal, DashboardTriage, Card, Badge, RegPill, severityTone, Thermometer, EmissionsChart });
