// Auth screens — Sign in, Sign up, Forgot password
// V1 — Split: brand panel left, form right
// V2 — Centered minimal card

const { ICON: I4, useI18N: ui18n4 } = window;

function BrandPanel() {
  return (
    <div style={{
      flex: 1, background: "var(--esg-nav)", color: "#fff",
      padding: "44px 44px 36px", display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>
      {/* Mouse-follow grid backdrop */}
      <window.GreenGrid radius={240} cell={32} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: "linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)",
          display: "grid", placeItems: "center", boxShadow: "0 4px 14px rgba(196,98,45,0.4)"
        }}>{I4.scale}</div>
        <div>
          <div style={{ fontFamily: "var(--esg-serif)", fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>ESG Lens</div>
          <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.14em", color: "rgba(212,232,220,0.65)", textTransform: "uppercase", marginTop: 3 }}>Legal verification</div>
        </div>
      </div>

      <div style={{ marginTop: "auto", position: "relative" }}>
        <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--esg-orange)", textTransform: "uppercase", fontWeight: 600 }}>
          Counsel-grade
        </div>
        <h1 style={{
          margin: "12px 0 0", fontFamily: "var(--esg-serif)", fontSize: 38, lineHeight: 1.15,
          fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", maxWidth: 460
        }}>
          Audit ESG disclosures with the precision of a deposition.
        </h1>
        <p style={{
          margin: "16px 0 0", fontFamily: "var(--esg-serif)", fontSize: 15, lineHeight: 1.6,
          color: "rgba(212,232,220,0.85)", maxWidth: 440
        }}>
          Surface greenwashing exposure under EU 2024/825, CSRD, and SFDR — backed by paragraph-level citations
          your team can drop straight into a brief.
        </p>

        <div style={{
          marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18
        }}>
          {[
          { v: "EU-only", l: "Data residency" },
          { v: "SOC 2", l: "Type II controls" },
          { v: "<1 hr", l: "Avg. analysis" }].
          map((s) =>
          <div key={s.l}>
              <div style={{ fontFamily: "var(--esg-serif)", fontSize: 18, fontWeight: 600, color: "#fff" }}>{s.v}</div>
              <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "rgba(212,232,220,0.6)", marginTop: 3, letterSpacing: "0.06em" }}>{s.l}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(212,232,220,0.55)" }}>
          <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Trusted by counsel at</span>
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
        </div>
        <div style={{
          marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14
        }}>
          {["Borowski Çelik", "MARCO LLP", "Halsted&Co.", "Vienna Bench"].map((n) =>
          <div key={n} style={{
            fontFamily: "var(--esg-serif)", fontStyle: "italic", fontSize: 13,
            color: "rgba(212,232,220,0.7)", letterSpacing: "0.02em"
          }}>{n}</div>
          )}
        </div>
      </div>
    </div>);

}

function Input({ label, placeholder, type = "text", hint, value, suffix }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{
        fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.12em",
        color: "var(--esg-fg-muted)", textTransform: "uppercase", marginBottom: 8
      }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 12px", borderRadius: 6,
        background: "#fff", border: "1px solid var(--esg-border-strong)"
      }}>
        <input type={type} placeholder={placeholder} defaultValue={value} style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--esg-sans)", fontSize: 14, color: "var(--esg-fg)"
        }} />
        {suffix}
      </div>
      {hint && <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", marginTop: 6 }}>{hint}</div>}
    </label>);

}

function SignInSplit() {
  const t = ui18n4();
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      background: "var(--esg-page)", fontFamily: "var(--esg-sans)", color: "var(--esg-fg)",
      overflow: "hidden"
    }}>
      <BrandPanel />

      <div style={{
        flex: 1, padding: 48, display: "flex", flexDirection: "column",
        justifyContent: "center", maxWidth: 560
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 30 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", animation: "esg-blink 2.4s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10.5, color: "var(--esg-fg-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            EU · Frankfurt region · operational
          </span>
        </div>

        <h2 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {t.titles.signIn}
        </h2>
        <p style={{ margin: "8px 0 28px", color: "var(--esg-fg-muted)", fontSize: 14 }}>
          {t.titles.signInSub}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Work email" placeholder="m.celik@borowski-celik.com" value="m.celik@borowski-celik.com" type="email" />
          <Input label="Password" placeholder="••••••••••••" type="password" value="passwordhere" suffix={
          <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)", cursor: "pointer", letterSpacing: "0.06em" }}>SHOW</span>
          } />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--esg-fg-muted)", cursor: "pointer" }}>
              <span style={{
                width: 14, height: 14, borderRadius: 3,
                background: "var(--esg-green-mid)", display: "grid", placeItems: "center", color: "#fff"
              }}>{I4.check}</span>
              Stay signed in on this device
            </label>
            <a href="#" style={{ fontSize: 12.5, color: "var(--esg-orange-dark)", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
          </div>

          <button style={{
            padding: "14px 20px", borderRadius: 999,
            background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
            color: "#fff", border: "none",
            fontFamily: "var(--esg-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(45,106,79,0.25)"
          }}>Sign in to workspace →</button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--esg-fg-muted)", margin: "4px 0" }}>
            <span style={{ flex: 1, height: 1, background: "var(--esg-border)" }} />
            <span style={{ fontFamily: "var(--esg-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>or via SSO</span>
            <span style={{ flex: 1, height: 1, background: "var(--esg-border)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["Microsoft Entra", "Okta"].map((p) =>
            <button key={p} style={{
              padding: "11px 14px", borderRadius: 6, background: "#fff",
              border: "1px solid var(--esg-border-strong)", color: "var(--esg-fg)",
              fontFamily: "var(--esg-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer"
            }}>{p}</button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--esg-border)", fontSize: 12.5, color: "var(--esg-fg-muted)" }}>
          New to ESG Lens? <a href="#" style={{ color: "var(--esg-orange-dark)", textDecoration: "none", fontWeight: 600 }}>Create a counsel workspace →</a>
        </div>
      </div>
    </div>);

}

function SignUpCentered() {
  const t = ui18n4();
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      background: "var(--esg-page)", fontFamily: "var(--esg-sans)", color: "var(--esg-fg)",
      overflow: "hidden", justifyContent: "center", alignItems: "center", padding: 32
    }}>
      {/* subtle bg gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.7,
        background: "radial-gradient(circle at 20% -10%, rgba(45,106,79,0.08), transparent 50%), radial-gradient(circle at 100% 110%, rgba(196,98,45,0.06), transparent 50%)"
      }} />

      <div style={{
        position: "relative", width: "100%", maxWidth: 460,
        background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 12,
        padding: 36, boxShadow: "0 16px 48px rgba(0,0,0,0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
            display: "grid", placeItems: "center", color: "#fff"
          }}>{I4.scale}</div>
          <div>
            <div style={{ fontFamily: "var(--esg-serif)", fontSize: 16, fontWeight: 600 }}>ESG Lens</div>
            <div style={{ fontFamily: "var(--esg-mono)", fontSize: 10, color: "var(--esg-fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Counsel workspace</div>
          </div>
        </div>

        {/* step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {[1, 2, 3].map((s) =>
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: s === 1 ? "var(--esg-green-mid)" : "var(--esg-border)"
          }} />
          )}
        </div>

        <h2 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {t.titles.signUp}
        </h2>
        <p style={{ margin: "6px 0 22px", color: "var(--esg-fg-muted)", fontSize: 13.5 }}>
          {t.titles.signUpSub}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Full name" placeholder="M. Çelik" value="Merve Çelik" />
          <Input label="Work email" placeholder="you@firm.com" value="m.celik@borowski-celik.com" type="email"
          hint="Personal-domain addresses (gmail, outlook) are not accepted." />
          <Input label="Firm or organisation" placeholder="Borowski Çelik LLP" value="Borowski Çelik LLP" />
          <Input label="Password" placeholder="At least 12 characters" type="password" value="passwordhere" />

          <label style={{ display: "flex", gap: 10, fontSize: 12.5, color: "var(--esg-fg-muted)", marginTop: 4, lineHeight: 1.5 }}>
            <span style={{
              flexShrink: 0, marginTop: 2, width: 14, height: 14, borderRadius: 3,
              border: "1.5px solid var(--esg-border-strong)", background: "#fff"
            }} />
            I confirm I am acting in a professional legal or compliance capacity and accept the{" "}
            <a href="#" style={{ color: "var(--esg-orange-dark)", textDecoration: "none", fontWeight: 600 }}>Master Services Agreement</a>.
          </label>

          <button style={{
            padding: "13px 20px", borderRadius: 999,
            background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
            color: "#fff", border: "none",
            fontFamily: "var(--esg-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            marginTop: 4
          }}>Continue · Step 1 of 3 →</button>
        </div>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--esg-border)", textAlign: "center", fontSize: 12.5, color: "var(--esg-fg-muted)" }}>
          Already have a workspace? <a href="#" style={{ color: "var(--esg-orange-dark)", textDecoration: "none", fontWeight: 600 }}>Sign in →</a>
        </div>
      </div>
    </div>);

}

function ForgotPassword() {
  const t = ui18n4();
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      background: "var(--esg-page)", fontFamily: "var(--esg-sans)", color: "var(--esg-fg)",
      overflow: "hidden", justifyContent: "center", alignItems: "center", padding: 32
    }}>
      <div style={{
        position: "relative", width: "100%", maxWidth: 440,
        background: "#fff", border: "1px solid var(--esg-border)", borderRadius: 12,
        padding: 36, boxShadow: "0 16px 48px rgba(0,0,0,0.08)"
      }}>
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--esg-mono)", fontSize: 11, color: "var(--esg-fg-muted)",
          textDecoration: "none", letterSpacing: "0.06em", marginBottom: 20
        }}>← Back to sign in</a>

        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: "var(--esg-amber-light)", color: "var(--esg-amber)",
          display: "grid", placeItems: "center", marginBottom: 14
        }}>{I4.shield}</div>

        <h2 style={{ margin: 0, fontFamily: "var(--esg-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {t.titles.forgot}
        </h2>
        <p style={{ margin: "8px 0 24px", color: "var(--esg-fg-muted)", fontSize: 13.5, lineHeight: 1.55 }}>
          {t.titles.forgotSub} Recovery links expire after 30 minutes.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Work email" placeholder="you@firm.com" value="m.celik@borowski-celik.com" type="email" />

          <button style={{
            padding: "13px 20px", borderRadius: 999,
            background: "linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))",
            color: "#fff", border: "none",
            fontFamily: "var(--esg-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>Send recovery link</button>

          <div style={{
            padding: 12, borderRadius: 6, background: "var(--esg-surface-2)",
            border: "1px solid var(--esg-border)", fontSize: 12, color: "var(--esg-fg-muted)", lineHeight: 1.55
          }}>
            <strong style={{ color: "var(--esg-fg)" }}>Need MFA help?</strong> If you have lost access to your authenticator,
            reach <a href="#" style={{ color: "var(--esg-orange-dark)", textDecoration: "none", fontWeight: 600 }}>support@esglens.eu</a>.
            Identity recovery requires firm-admin co-signature under SOC 2.
          </div>
        </div>
      </div>
    </div>);

}

Object.assign(window, { SignInSplit, SignUpCentered, ForgotPassword });