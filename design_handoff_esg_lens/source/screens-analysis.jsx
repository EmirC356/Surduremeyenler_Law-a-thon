// Document Analysis — 2 variations
// V1 Intake — large drop zone + queue + stage simulation
// V2 Review — side-by-side document viewer + live findings panel

const { ICON: I2, AppShell: AS2, useI18N: ui18n2 } = window;
const M2 = window.MOCK;
const { Card: C2, Badge: B2, RegPill: RP2, severityTone: ST2 } = window;

// V1 — Intake & Triage ─────────────────────────────────────────────
function AnalysisIntake() {
  const t = ui18n2();
  const [stage, setStage] = React.useState(2); // 0..3

  const stages = [
    { id: 0, label: "Upload", sub: "TLS upload · checksum" },
    { id: 1, label: "Parse",  sub: "OCR · text extraction" },
    { id: 2, label: "Reason", sub: "LLM legal mapping" },
    { id: 3, label: "Score",  sub: "Risk + citations" },
  ];

  return (
    <AS2 active="analysis" title={t.titles.analysis} subtitle={t.titles.analysisSub}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

        {/* LEFT — drop + active job */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "#fff", border: "2px dashed var(--esg-border-strong)",
            borderRadius: 10, padding: 36, textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, margin: "0 auto",
              background: "var(--esg-green-light)", color: "var(--esg-green-text)",
              display: "grid", placeItems: "center",
            }}>{I2.upload}</div>
            <h3 style={{
              margin: "16px 0 6px", fontFamily: "var(--esg-serif)",
              fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em",
            }}>Drop a sustainability report</h3>
            <p style={{ margin: 0, color: "var(--esg-fg-muted)", fontFamily: "var(--esg-sans)", fontSize: 13.5 }}>
              PDF, DOCX up to 80 MB · processed in-EU, never leaves jurisdiction
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
              <button style={{
                padding: "10px 18px", borderRadius: 999,
                background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
                color: "#fff", border: "none", fontFamily: "var(--esg-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Browse files</button>
              <button style={{
                padding: "10px 18px", borderRadius: 999, background: "#fff",
                color: "var(--esg-fg)", border: "1px solid var(--esg-border)",
                fontFamily: "var(--esg-sans)", fontSize: 13, cursor: "pointer",
              }}>Import from SharePoint</button>
            </div>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 16, fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", letterSpacing: "0.06em" }}>
              <span>✓ PDF · OCR</span><span>✓ DOCX</span><span>✓ HTML / XBRL</span><span>✓ Multi-file packets</span>
            </div>
          </div>

          {/* Stage simulation */}
          <C2 title="Active analysis" sub={M2.company.reportFile}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {stages.map(s => {
                const state = s.id < stage ? "done" : s.id === stage ? "active" : "pending";
                const bg  = state === "done" ? "var(--esg-green-light)" : state === "active" ? "var(--esg-surface-2)" : "#fff";
                const bd  = state === "done" ? "rgba(45,106,79,0.25)" : state === "active" ? "var(--esg-border-strong)" : "var(--esg-border)";
                const dot = state === "done" ? "var(--esg-green-text)" : state === "active" ? "var(--esg-orange)" : "var(--esg-border-strong)";
                return (
                  <div key={s.id} onClick={() => setStage(s.id)} style={{
                    display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 12, alignItems: "center",
                    padding: "12px 14px", borderRadius: 6, border: `1px solid ${bd}`, background: bg,
                    cursor: "pointer",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: state === "done" ? "var(--esg-green-text)" : "transparent",
                      border: `2px solid ${dot}`,
                      display: "grid", placeItems: "center", color: "#fff",
                    }}>
                      {state === "done" ? I2.check : <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: dot }}>{s.id + 1}</span>}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--esg-sans)", fontSize: 13, fontWeight: state === "active" ? 600 : 500 }}>{s.label}</div>
                      <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)" }}>{s.sub}</div>
                    </div>
                    {state === "active" && (
                      <div style={{ width: 80 }}>
                        <div style={{ height: 4, background: "var(--esg-border)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: "65%", height: "100%", background: "var(--esg-orange)" }} />
                        </div>
                        <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)", marginTop: 4, textAlign: "right" }}>65% · 14s</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </C2>
        </div>

        {/* RIGHT — queue + recent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <C2 title="Matter documents" sub={`${M2.documents.length} files · 280 pp total`} padding={0}>
            {M2.documents.map((d, i) => (
              <div key={i} style={{
                padding: "12px 18px", display: "grid", gridTemplateColumns: "auto 1fr auto",
                gap: 12, alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
              }}>
                <div style={{
                  width: 32, height: 38, borderRadius: 3,
                  background: d.status === "Analyzed" ? "var(--esg-green-light)" : "var(--esg-surface-2)",
                  color: d.status === "Analyzed" ? "var(--esg-green-text)" : "var(--esg-fg-muted)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--esg-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
                  border: "1px solid var(--esg-border)",
                }}>{d.name.endsWith(".pdf") ? "PDF" : "DOC"}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--esg-mono)", fontSize: 11.5, color: "var(--esg-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 2 }}>
                    {d.size} · {d.pages} pp · {d.flags} flags
                  </div>
                </div>
                <B2 tone={d.status === "Analyzed" ? "safe" : "neutral"}>{d.status}</B2>
              </div>
            ))}
          </C2>

          <C2 title="What we check for" sub="six analysis lenses">
            {[
              { l: "Greenlighting", r: "Selective disclosure asymmetry", n: 8 },
              { l: "Greenrinsing", r: "Pledge mathematical viability", n: 6 },
              { l: "Offset integrity", r: "Removal vs. avoidance, vintages", n: 4 },
              { l: "Taxonomy alignment", r: "Revenue / CapEx tagging accuracy", n: 3 },
              { l: "Marketing claims", r: "EU 2024/825 substantiation", n: 1 },
              { l: "Director liability", r: "ESRS E1-1 disclosure gaps", n: 1 },
            ].map((x, i) => (
              <div key={i} style={{
                padding: "10px 0", display: "grid",
                gridTemplateColumns: "12px 1fr auto", gap: 10, alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--esg-border)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--esg-orange)" }} />
                <div>
                  <div style={{ fontFamily: "var(--esg-sans)", fontSize: 13, fontWeight: 500 }}>{x.l}</div>
                  <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)" }}>{x.r}</div>
                </div>
                <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{x.n}</span>
              </div>
            ))}
          </C2>
        </div>
      </div>
    </AS2>
  );
}

// V2 — In-line Document Review ─────────────────────────────────────
function AnalysisReview() {
  const t = ui18n2();
  const [activeFlag, setActiveFlag] = React.useState(0);

  // Mock document text with highlighted regions
  const paragraphs = [
    { text: "Apex Hydrocarbon Solutions plc remains firmly committed to a science-based transition. Our trajectory toward a Net-Zero future is built into every operating decision we make.", flag: 0 },
    { text: "In FY25, 82% of our external communications addressed the energy transition, decarbonisation, or low-carbon innovation.", flag: 0 },
    { text: "We remain committed to Net Zero across Scope 1 + 2 by 2030, an ambition reaffirmed by the Board on 14 March 2026.", flag: 1 },
    { text: "Where appropriate, targets have been refined to reflect updated baseline data, methodological maturity, and changes in the operating perimeter.", flag: 2 },
    { text: "Across the Group, 45% of revenue qualifies as taxonomy-aligned, demonstrating measurable progress against the EU Taxonomy framework.", flag: 3 },
    { text: "Our pathway combines absolute reductions with high-integrity removals from nature-based and engineered carbon-removal projects.", flag: 4 },
  ];
  const f = M2.flags[activeFlag];

  return (
    <AS2 active="analysis" title="Document Review" subtitle={`${M2.company.reportFile} · p. 14 of 142`} density="dense">

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 380px", gap: 14, height: "100%", minHeight: 620 }}>

        {/* LEFT — page rail */}
        <div style={{ background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8, padding: 12, overflow: "auto" }}>
          <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "var(--esg-fg-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Pages with flags
          </div>
          {[14, 31, 47, 88, 103, 119].map((p, i) => (
            <div key={p} style={{
              padding: "10px 10px", borderRadius: 4, cursor: "pointer",
              background: i === activeFlag ? "var(--esg-surface-2)" : "transparent",
              borderLeft: `3px solid ${i === activeFlag ? "var(--esg-orange)" : "transparent"}`,
              display: "flex", alignItems: "center", gap: 10,
            }} onClick={() => setActiveFlag(i)}>
              <div style={{
                width: 36, height: 46, background: "var(--esg-surface-2)",
                border: "1px solid var(--esg-border)", borderRadius: 2,
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 3, left: 3, right: 3, height: 2, background: "var(--esg-border-strong)" }} />
                <div style={{ position: "absolute", top: 8, left: 3, right: 8, height: 1, background: "var(--esg-border)" }} />
                <div style={{ position: "absolute", top: 12, left: 3, right: 6, height: 1, background: "var(--esg-border)" }} />
                <div style={{ position: "absolute", top: 22, left: 3, width: 14, height: 6, background: "var(--esg-red)", opacity: 0.5 }} />
                <div style={{ position: "absolute", bottom: 3, right: 2, width: 8, height: 8, borderRadius: "50%", background: "var(--esg-red)", border: "1.5px solid #fff" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 11, fontWeight: 600, color: "var(--esg-fg)" }}>p. {p}</div>
                <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)" }}>{M2.flags[i].id}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CENTER — document */}
        <div style={{
          background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8,
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{
            padding: "10px 16px", borderBottom: "1px solid var(--esg-border)",
            background: "var(--esg-surface-2)", display: "flex", alignItems: "center", gap: 12,
            fontFamily: "var(--esg-mono)", fontSize: 11,
          }}>
            <span style={{ color: "var(--esg-fg)", fontWeight: 600 }}>{M2.company.reportFile}</span>
            <span style={{ color: "var(--esg-fg-muted)" }}>·</span>
            <span style={{ color: "var(--esg-fg-muted)" }}>Section 2 · Our Climate Strategy</span>
            <span style={{ flex: 1 }} />
            <button style={{
              padding: "4px 10px", borderRadius: 4, border: "1px solid var(--esg-border)",
              background: "#fff", color: "var(--esg-fg-muted)", fontFamily: "var(--esg-mono)",
              fontSize: 10, cursor: "pointer", letterSpacing: "0.04em",
            }}>FIND</button>
            <span style={{ color: "var(--esg-fg-muted)" }}>14 / 142</span>
          </div>
          <div style={{
            flex: 1, padding: "32px 48px", overflow: "auto",
            fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 14.5, lineHeight: 1.75, color: "#222",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 18, color: "#111" }}>
              2.3 — Trajectory to Net Zero
            </h3>
            {paragraphs.map((p, i) => {
              const isFlagged = p.flag === activeFlag;
              return (
                <p key={i} style={{
                  margin: "0 0 14px",
                  background: isFlagged ? "rgba(196,98,45,0.18)" : "transparent",
                  padding: isFlagged ? "4px 8px" : 0,
                  borderRadius: 3, position: "relative",
                  borderLeft: isFlagged ? "3px solid var(--esg-orange)" : "none",
                  marginLeft: isFlagged ? -11 : 0,
                  paddingLeft: isFlagged ? 8 : 0,
                }}>
                  {p.text}
                  {isFlagged && (
                    <sup style={{
                      marginLeft: 4, padding: "1px 5px", borderRadius: 3,
                      background: "var(--esg-red)", color: "#fff",
                      fontFamily: "var(--esg-mono)", fontSize: 9, fontWeight: 700, verticalAlign: "super",
                    }}>{M2.flags[p.flag].id}</sup>
                  )}
                </p>
              );
            })}
            <p style={{ margin: "0 0 14px", color: "#444" }}>
              The Group continues to invest in adjacent low-carbon technologies, including hydrogen blending pilots, CCUS feasibility studies, and a portfolio of selected nature-based removals across the Iberian Peninsula and East Africa.
            </p>
            <p style={{ margin: "0 0 14px", color: "#444" }}>
              Capital allocation discipline remains a cornerstone of our strategy; the Group's diversified portfolio enables continued cash generation while we accelerate the transition.
            </p>
          </div>
        </div>

        {/* RIGHT — finding panel */}
        <div style={{
          background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 8,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--esg-border)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)" }}>{f.id}</span>
              <B2 tone={ST2(f.severity)}>{f.severity}</B2>
              <span style={{ marginLeft: "auto", fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)" }}>{activeFlag + 1} / {M2.flags.length}</span>
            </div>
            <h3 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 17, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              {f.title}
            </h3>
            <div style={{ marginTop: 8 }}><RP2>{f.regulation}</RP2></div>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 6 }}>Claim asserted</div>
              <div style={{ fontFamily: "var(--esg-serif)", fontSize: 13.5, color: "var(--esg-fg)", lineHeight: 1.5 }}>{f.claim}</div>
            </div>
            <div style={{ padding: 12, background: "var(--esg-red-light)", borderRadius: 5, border: "1px solid rgba(181,61,46,0.2)" }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-red)", textTransform: "uppercase", marginBottom: 6 }}>Verified reality</div>
              <div style={{ fontFamily: "var(--esg-serif)", fontSize: 13.5, color: "var(--esg-fg)", lineHeight: 1.5 }}>{f.reality}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 6 }}>Potential exposure</div>
              <div style={{ fontFamily: "var(--esg-serif)", fontSize: 13.5, color: "var(--esg-fg)", lineHeight: 1.5 }}>{f.damages}</div>
            </div>
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--esg-border)" }}>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 8 }}>Counsel actions</div>
              <textarea placeholder="Add a privileged note…" style={{
                width: "100%", minHeight: 70, padding: 10, borderRadius: 5,
                border: "1px solid var(--esg-border)", background: "var(--esg-surface-2)",
                fontFamily: "var(--esg-sans)", fontSize: 12.5, resize: "vertical", color: "var(--esg-fg)",
              }} />
            </div>
          </div>

          <div style={{
            padding: "10px 16px", borderTop: "1px solid var(--esg-border)",
            background: "var(--esg-surface-2)", display: "flex", gap: 8,
          }}>
            <button style={{
              flex: 1, padding: "8px 12px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
              color: "#fff", border: "none", fontFamily: "var(--esg-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Add to brief</button>
            <button style={{
              padding: "8px 12px", borderRadius: 999, background: "#fff",
              color: "var(--esg-fg)", border: "1px solid var(--esg-border)",
              fontFamily: "var(--esg-sans)", fontSize: 12, cursor: "pointer",
            }}>Dismiss</button>
          </div>
        </div>
      </div>
    </AS2>
  );
}

Object.assign(window, { AnalysisIntake, AnalysisReview });
