// Greenlighting Risk — 2 variations
// V1 Brief — narrative memo-style page with split chart + red-flag column
// V2 Compare — claim-vs-reality side-by-side ledger with bar viz

const M3 = window.MOCK;
const { ICON: I3, AppShell: AS3, useI18N: ui18n3, Card: C3, Badge: B3, RegPill: RP3, severityTone: ST3 } = window;

const GL = M3.greenlighting; // [{ label, value }]

// Stacked horizontal bar
function ProportionBar({ data, tone }) {
  const colors = {
    orange: "var(--esg-orange)", amber: "var(--esg-amber)",
    "green-text": "var(--esg-green-text)", red: "var(--esg-red)",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--esg-sans)", fontSize: 12.5, color: "var(--esg-fg)" }}>{d.label}</span>
            <span style={{ fontFamily: "var(--esg-mono)", fontSize: 13, fontWeight: 500, color: colors[d.color] }}>
              {d.value}%
            </span>
          </div>
          <div style={{ height: 10, background: "var(--esg-surface-2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--esg-border)" }}>
            <div style={{
              width: `${d.value}%`, height: "100%",
              background: colors[d.color], borderRadius: 999,
              transition: "width 600ms ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// V1 — Legal Brief
// ═══════════════════════════════════════════════════════════════════
function GreenlightingBrief() {
  const t = ui18n3();

  const flags = M3.flags.filter(f => f.kind === "Greenlighting");

  return (
    <AS3 active="greenlighting" title={t.titles.greenlighting} subtitle={t.titles.greenlightingSub}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* Memo header */}
        <div style={{
          padding: "20px 24px", background: "#fff", border: "1px solid var(--esg-border)",
          borderRadius: 8, marginBottom: 20,
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 8,
              background: "linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)",
              color: "#fff", display: "grid", placeItems: "center",
            }}>{I3.flag}</div>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <B3 tone="litig">Litigation tier</B3>
                <RP3>EU 2024/825</RP3>
                <RP3>SFDR · Art. 8</RP3>
              </div>
              <h2 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Selective disclosure — marketing eclipses real green spend
              </h2>
              <p style={{
                margin: "6px 0 0", fontFamily: "var(--esg-serif)", fontSize: 14, color: "var(--esg-fg-muted)", lineHeight: 1.5, maxWidth: 720,
              }}>
                The disclosure surface devotes <strong>82%</strong> of column-inches to climate transition narrative,
                while real green CapEx for FY25 is <strong>6.1%</strong>. Counsel exposure under EU Green Claims Directive 2024/825 is material.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "var(--esg-fg-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Gap</div>
              <div style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 56, color: "var(--esg-red)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                75.9<span style={{ fontSize: 22, color: "var(--esg-fg-muted)" }}>pp</span>
              </div>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 4 }}>marketing − capex</div>
            </div>
          </div>
        </div>

        {/* Body: chart + flags */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <C3 title="Marketing focus vs. actual investment" sub="FY25 — % of disclosed activity">
            <ProportionBar data={GL} />
            <div style={{
              marginTop: 18, padding: 12, borderRadius: 6, background: "var(--esg-surface-2)",
              fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 13, color: "var(--esg-fg)", lineHeight: 1.55,
            }}>
              "Marketing focus" — share of FY25 communications surface (sustainability report + investor decks + press)
              addressing climate / transition / low-carbon themes. Method: ESG Lens NLP topic classifier; reviewed by counsel.
            </div>
          </C3>

          <C3 title="Citation register" sub={`${flags.length} legal findings`} padding={0}>
            {flags.map((f, i) => (
              <div key={f.id} style={{
                padding: "14px 20px", borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
                display: "grid", gridTemplateColumns: "16px 1fr", gap: 12,
              }}>
                <div style={{ width: 3, background: "var(--esg-red)", borderRadius: 2 }} />
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)" }}>{f.id}</span>
                    <B3 tone={ST3(f.severity)}>{f.severity}</B3>
                    <RP3>{f.regulation}</RP3>
                  </div>
                  <div style={{ fontFamily: "var(--esg-serif)", fontSize: 14, fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 12.5, color: "var(--esg-fg-muted)", marginTop: 4, lineHeight: 1.5 }}>
                    p. {f.page} — {f.excerpt}
                  </div>
                  <div style={{ marginTop: 6, fontFamily: "var(--esg-sans)", fontSize: 12, color: "var(--esg-red)" }}>
                    {f.reality}
                  </div>
                </div>
              </div>
            ))}
          </C3>
        </div>

        {/* Bottom: regulation card */}
        <div style={{ marginTop: 20 }}>
          <C3 title="Applicable framework" sub="EU Green Claims Directive 2024/825">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { art: "Art. 5(2)(b)", t: "Substantiation", body: "Environmental claims must be supported by widely-recognised scientific evidence and use up-to-date data." },
                { art: "Art. 8", t: "Verification", body: "Independent third-party verification required before substantive environmental claims may be made." },
                { art: "Art. 17", t: "Enforcement", body: "Penalties up to 4% of EU annual turnover for misleading green claims; potential consumer redress." },
              ].map(x => (
                <div key={x.art} style={{ padding: 14, background: "var(--esg-surface-2)", borderRadius: 6, border: "1px solid var(--esg-border)" }}>
                  <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-orange-dark)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{x.art}</div>
                  <div style={{ fontFamily: "var(--esg-serif)", fontSize: 14, fontWeight: 600, marginTop: 4 }}>{x.t}</div>
                  <div style={{ fontFamily: "var(--esg-serif)", fontSize: 12.5, color: "var(--esg-fg-muted)", marginTop: 6, lineHeight: 1.5 }}>{x.body}</div>
                </div>
              ))}
            </div>
          </C3>
        </div>
      </div>
    </AS3>
  );
}

// ═══════════════════════════════════════════════════════════════════
// V2 — Claim vs Reality ledger
// ═══════════════════════════════════════════════════════════════════
function GreenlightingCompare() {
  const t = ui18n3();
  const rows = [
    { lbl: "Sustainability report — column inches", claim: "82%", reality: "82%", note: "Surface dominance", t: "neutral" },
    { lbl: "Group revenue — green / aligned", claim: "45%", reality: "11.8%", note: "Auditor-reconciled", t: "litig" },
    { lbl: "Group CapEx — green / transition", claim: "—", reality: "6.1%", note: "FY25 actuals", t: "litig" },
    { lbl: "Investor-deck mentions of 'transition'", claim: "31 mentions", reality: "31 mentions", note: "Q1–Q4 calls", t: "neutral" },
    { lbl: "Headline pledge — Net Zero year", claim: "2030", reality: "2061 (extrapolated)", note: "On current CAGR", t: "litig" },
    { lbl: "R&D — low-carbon", claim: "Quote 'significant'", reality: "1.7% R&D budget", note: "Note 18 audit", t: "risk" },
  ];

  return (
    <AS3 active="greenlighting" title={t.titles.greenlighting} subtitle="Side-by-side · claim vs. reality" density="dense">

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>

        {/* MAIN — ledger */}
        <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{
            padding: "12px 18px", borderBottom: "1px solid var(--esg-border)",
            background: "var(--esg-surface-2)", display: "flex", alignItems: "center", gap: 12,
          }}>
            <h3 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 16, fontWeight: 600 }}>
              Claim · Reality ledger
            </h3>
            <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>FY25</span>
            <span style={{ flex: 1 }} />
            <button style={{
              padding: "5px 10px", borderRadius: 4, border: "1px solid var(--esg-border)",
              background: "#fff", color: "var(--esg-fg-muted)",
              fontFamily: "var(--esg-mono)", fontSize: 10.5, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 6,
            }}>{I3.download} EXPORT</button>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.4fr 90px",
            padding: "10px 18px", borderBottom: "1px solid var(--esg-border)",
            fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "var(--esg-fg-muted)",
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
          }}>
            <span>Metric</span><span>Marketing claim</span><span>Verified reality</span><span>Note</span><span style={{ textAlign: "right" }}>Severity</span>
          </div>

          {rows.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.4fr 90px",
              padding: "16px 18px", gap: 10, alignItems: "center",
              borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--esg-border)",
            }}>
              <span style={{ fontFamily: "var(--esg-sans)", fontSize: 13, color: "var(--esg-fg)" }}>{r.lbl}</span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 14, color: "var(--esg-fg)" }}>{r.claim}</span>
              <span style={{
                fontFamily: "var(--esg-mono)", fontSize: 14,
                color: r.t === "litig" ? "var(--esg-red)" : r.t === "risk" ? "var(--esg-orange)" : "var(--esg-fg)",
                fontWeight: 600,
              }}>{r.reality}</span>
              <span style={{ fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 12.5, color: "var(--esg-fg-muted)" }}>{r.note}</span>
              <span style={{ textAlign: "right" }}>{r.t !== "neutral" && <B3 tone={r.t}>{r.t === "litig" ? "Litig." : r.t === "risk" ? "Risk" : ""}</B3>}</span>
            </div>
          ))}
        </div>

        {/* SIDE — summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, padding: 18 }}>
            <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase" }}>Greenlighting score</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontWeight: 300, fontSize: 56, color: "var(--esg-red)", letterSpacing: "-0.05em", lineHeight: 1 }}>14</span>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 14, color: "var(--esg-fg-muted)" }}>/ 100</span>
            </div>
            <div style={{ marginTop: 12, height: 8, background: "linear-gradient(to right, #2D6A4F, #B07D2A 50%, #B53D2E)", borderRadius: 999, position: "relative" }}>
              <div style={{ position: "absolute", left: "calc(14% - 7px)", top: -3, width: 14, height: 14, borderRadius: 2, background: "#F0EDE6", border: "2px solid var(--esg-red)" }} />
            </div>
            <div style={{ marginTop: 12 }}><B3 tone="litig">Critical</B3></div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, padding: 18 }}>
            <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 8 }}>Distribution</div>
            <ProportionBar data={GL} />
          </div>

          <div style={{
            background: "var(--esg-orange-light)", border: "1px solid rgba(196,98,45,0.25)",
            borderRadius: 8, padding: 16,
          }}>
            <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-orange-dark)", textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>
              Counsel recommendation
            </div>
            <div style={{ fontFamily: "var(--esg-serif)", fontSize: 13, lineHeight: 1.55, color: "var(--esg-fg)" }}>
              Hold FY25 publication of all marketing assets referencing transition until CapEx / revenue claim is re-substantiated. Draft notice to investor relations within 5 business days.
            </div>
          </div>
        </div>
      </div>
    </AS3>
  );
}

Object.assign(window, { GreenlightingBrief, GreenlightingCompare, ProportionBar });
