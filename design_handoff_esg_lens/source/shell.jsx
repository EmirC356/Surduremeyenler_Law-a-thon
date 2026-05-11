// Shared shell — Sidebar only (header removed; chrome moved into the sidebar).
// Sidebar now hosts: wordmark, search, matter context, nav, notification + account.
// The sidebar green plane has a subtle grid that pulses toward the cursor.

const ICON = {
  leaf:    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 4C12 4 4 8 4 18c0 2 1 3 3 3 8 0 13-6 13-13 0-2-1-4 0-4Z"/><path d="M4 21 11 14"/></svg>,
  dash:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  file:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><circle cx="16" cy="16" r="3"/><path d="m20 20-1.5-1.5"/></svg>,
  target:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>,
  scale:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 8h14"/><path d="m5 8-3 7a4 4 0 0 0 6 0Z"/><path d="m19 8-3 7a4 4 0 0 0 6 0Z"/></svg>,
  book:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v15a2 2 0 0 0 2 2h14V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z"/><path d="M4 4v15"/><path d="M8 8h8"/><path d="M8 12h6"/></svg>,
  card:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/><path d="M6 16h4"/></svg>,
  shield:  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z"/></svg>,
  bell:    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16H6l1.5-2V10a4.5 4.5 0 1 1 9 0v4Z"/><path d="M10.5 20a2 2 0 0 0 3 0"/></svg>,
  search:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  alert:   <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 10 17H2z"/><path d="M12 10v4"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/></svg>,
  check:   <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>,
  chev:    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>,
  chevDown:<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  download:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12"/><path d="m6 12 6 6 6-6"/><path d="M4 20h16"/></svg>,
  upload:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12"/><path d="m6 10 6-6 6 6"/><path d="M4 20h16"/></svg>,
  filter:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 9v6l-4-2v-4Z"/></svg>,
  share:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4"/><path d="m8 13 8 4"/></svg>,
  flag:    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v17"/><path d="M5 4h12l-2 4 2 4H5"/></svg>,
};

// Localization strings ───────────────────────────────────────────
const I18N = {
  en: {
    nav: {
      dashboard: "Dashboard", analysis: "Document Analysis",
      greenlighting: "Greenlighting", greenrinsing: "Greenrinsing",
      export: "Legal Export", methodology: "Methodology", pricing: "Plan & Billing",
    },
    subnav: {
      dashboard: "Compliance overview", analysis: "Upload & parse reports",
      greenlighting: "Selective disclosure", greenrinsing: "Pledge viability",
      export: "Audit packet & CSV", methodology: "Scoring logic",
    },
    titles: {
      dashboard: "Compliance Dashboard",
      dashboardSub: "Counsel-grade ESG risk review",
      analysis: "Document Intake",
      analysisSub: "Upload sustainability disclosures for legal analysis",
      greenlighting: "Greenlighting Risk",
      greenlightingSub: "Marketing vs. operational reality",
      signIn: "Sign in to ESG Lens",
      signInSub: "Continue to your counsel workspace",
      signUp: "Create a counsel workspace",
      signUpSub: "Two-minute setup. Audit-grade from day one.",
      forgot: "Reset password",
      forgotSub: "We will email a one-time recovery link.",
    },
    common: {
      search: "Search reports, regulations, flags",
      newAnalysis: "New analysis",
      exportPacket: "Export audit packet",
      caseRecords: "20 Case Records",
      ssl: "256-bit TLS · Privileged",
      legalNote: "Privileged & confidential · Atty. work product",
      counselFor: "Counsel for",
      activeMatter: "Active matter",
      lawFirm: "Borowski Çelik LLP",
      analyzedAt: "Analyzed",
      analyst: "Lead reviewer",
    },
  },
  tr: {
    nav: {
      dashboard: "Gösterge", analysis: "Belge Analizi",
      greenlighting: "Yeşil Yıkama", greenrinsing: "Yeşil Yıkama (Söz)",
      export: "Hukuki Dışa Aktarım", methodology: "Metodoloji", pricing: "Abonelik",
    },
    subnav: {
      dashboard: "Uyum genel görünümü", analysis: "Rapor yükle ve çözümle",
      greenlighting: "Seçici ifşa", greenrinsing: "Söz uygulanabilirliği",
      export: "Denetim paketi ve CSV", methodology: "Puanlama yöntemi",
    },
    titles: {
      dashboard: "Uyum Gösterge Paneli",
      dashboardSub: "Hukuk müşaviri için ESG risk incelemesi",
      analysis: "Belge Girişi",
      analysisSub: "Sürdürülebilirlik raporlarını hukuki incelemeye yükleyin",
      greenlighting: "Yeşil Yıkama Riski",
      greenlightingSub: "Pazarlama söylemi ile operasyonel gerçeklik",
      signIn: "ESG Lens'e giriş yapın",
      signInSub: "Hukuk çalışma alanınıza devam edin",
      signUp: "Hukuk çalışma alanı oluştur",
      signUpSub: "İki dakikada kurulum. İlk günden denetim düzeyinde.",
      forgot: "Parola sıfırla",
      forgotSub: "Tek seferlik bir kurtarma bağlantısı göndereceğiz.",
    },
    common: {
      search: "Rapor, mevzuat, ihlal ara",
      newAnalysis: "Yeni analiz",
      exportPacket: "Denetim paketi indir",
      caseRecords: "20 İçtihat Kaydı",
      ssl: "256-bit TLS · Gizli",
      legalNote: "Avukat–müvekkil gizliliği · İş ürünü",
      counselFor: "Müvekkil",
      activeMatter: "Aktif dava",
      lawFirm: "Borowski Çelik Hukuk Bürosu",
      analyzedAt: "İnceleme",
      analyst: "Sorumlu avukat",
    },
  },
};

const useI18N = () => {
  const lang = (window.__esg && window.__esg.lang) || "en";
  return I18N[lang];
};

// ── Mouse-follow grid for green plane ─────────────────────────────
// A two-layer grid: a faint static one + a stronger one masked by a
// radial spotlight that follows the cursor. When the cursor is idle
// the spotlight slowly drifts so the surface always feels alive.
function GreenGrid({
  baseColor = "rgba(212,232,220,0.05)",
  hotColor  = "rgba(196,98,45,0.22)",
  cell      = 28,
  radius    = 180,
}) {
  const ref = React.useRef(null);
  const stateRef = React.useRef({ x: 50, y: 50, idle: true });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setVars = (x, y) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--mxBg", `${x % cell}px`);
      el.style.setProperty("--myBg", `${y % cell}px`);
    };
    setVars(stateRef.current.x, stateRef.current.y);

    // Find the closest "artboard" (scaled container) and translate
    // pointer coords into local space so it works inside DesignCanvas.
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      // Use clientX/Y relative to bounding rect (works even at scale).
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only react when cursor is inside or near (200px) the sidebar.
      if (x < -200 || x > rect.width + 200 || y < -200 || y > rect.height + 200) return;
      stateRef.current.x = x;
      stateRef.current.y = y;
      stateRef.current.idle = false;
      setVars(x, y);
    };

    window.addEventListener("mousemove", onMove);

    // Idle drift — slow lissajous so it feels organic.
    let raf, t = 0;
    const tick = () => {
      t += 0.006;
      if (stateRef.current.idle) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) {
          const cx = rect.width * 0.5  + Math.sin(t * 0.7) * rect.width  * 0.25;
          const cy = rect.height * 0.5 + Math.cos(t)       * rect.height * 0.32;
          setVars(cx, cy);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // After 1.6s without mouse movement, resume idle drift from last pos.
    let idleTimer;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { stateRef.current.idle = true; }, 1600);
    };
    window.addEventListener("mousemove", resetIdle);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", resetIdle);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, [cell]);

  const gridImage = (color) => `
    linear-gradient(${color} 1px, transparent 1px),
    linear-gradient(90deg, ${color} 1px, transparent 1px)
  `;

  return (
    <div ref={ref} aria-hidden style={{
      position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden"
    }}>
      {/* Base grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: gridImage(baseColor),
        backgroundSize: `${cell}px ${cell}px`,
      }}/>
      {/* Hot spotlight grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: gridImage(hotColor),
        backgroundSize: `${cell}px ${cell}px`,
        WebkitMaskImage: `radial-gradient(${radius}px circle at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)`,
        maskImage:       `radial-gradient(${radius}px circle at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)`,
        transition: "background-position 220ms linear",
      }}/>
      {/* Soft warm glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(${radius * 1.4}px circle at var(--mx,50%) var(--my,50%), rgba(196,98,45,0.10), transparent 70%)`,
      }}/>
    </div>
  );
}

// Sidebar ─────────────────────────────────────────────────────────
function Sidebar({ active = "dashboard" }) {
  const t = useI18N();
  const lang = (window.__esg && window.__esg.lang) || "en";

  const items = [
    { id: "dashboard",     icon: ICON.dash,   label: t.nav.dashboard,     sub: t.subnav.dashboard },
    { id: "analysis",      icon: ICON.file,   label: t.nav.analysis,      sub: t.subnav.analysis },
    { id: "greenlighting", icon: ICON.flag,   label: t.nav.greenlighting, sub: t.subnav.greenlighting },
    { id: "greenrinsing",  icon: ICON.target, label: t.nav.greenrinsing,  sub: t.subnav.greenrinsing },
    { id: "export",        icon: ICON.scale,  label: t.nav.export,        sub: t.subnav.export },
    { id: "methodology",   icon: ICON.book,   label: t.nav.methodology,   sub: t.subnav.methodology },
  ];

  return (
    <aside style={{
      width: 248, height: "100%", flexShrink: 0, position: "relative",
      background: "var(--esg-nav)", color: "#D4E8DC",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      <GreenGrid />

      {/* Wordmark */}
      <div style={{
        position: "relative",
        padding: "18px 20px 16px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)",
          display: "grid", placeItems: "center", color: "#fff",
          boxShadow: "0 2px 8px rgba(196,98,45,0.35)",
        }}>{ICON.scale}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            color: "#fff", fontFamily: "var(--esg-serif)", fontWeight: 600,
            fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>ESG Lens</div>
          <div style={{
            color: "rgba(212,232,220,0.65)", fontFamily: "var(--esg-mono)",
            fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3,
          }}>Legal Verification</div>
        </div>
        {/* Lang toggle pinned in wordmark row */}
        <button onClick={() => { window.__esg.setTweak('lang', lang === 'en' ? 'tr' : 'en'); }}
          style={{
            padding: "4px 7px", borderRadius: 4,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(212,232,220,0.85)", fontFamily: "var(--esg-mono)",
            fontSize: 9.5, fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em",
          }}>{lang === 'en' ? "EN" : "TR"}</button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", padding: "12px 14px 6px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px", borderRadius: 6,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(212,232,220,0.7)",
        }}>
          <span style={{ display: "flex", color: "rgba(212,232,220,0.6)" }}>{ICON.search}</span>
          <span style={{ flex: 1, fontFamily: "var(--esg-sans)", fontSize: 12.5, color: "rgba(212,232,220,0.65)" }}>
            {t.common.search}
          </span>
          <span style={{
            fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "rgba(212,232,220,0.7)",
            border: "1px solid rgba(255,255,255,0.14)", borderRadius: 3, padding: "1px 4px",
          }}>⌘K</span>
        </div>
      </div>

      {/* Matter context */}
      <div style={{ position: "relative", padding: "10px 20px 12px" }}>
        <div style={{
          color: "rgba(212,232,220,0.45)", fontFamily: "var(--esg-mono)",
          fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
        }}>{t.common.activeMatter}</div>

        <div style={{
          padding: "10px 12px", borderRadius: 6,
          background: "rgba(181,61,46,0.18)", border: "1px solid rgba(181,61,46,0.35)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ color: "#F5B7AC", display: "flex" }}>{ICON.alert}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: "#fff", fontFamily: "var(--esg-serif)", fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>
              Apex Hydrocarbon · AXHS
            </div>
            <div style={{ color: "rgba(245,183,172,0.85)", fontFamily: "var(--esg-mono)", fontSize: 10, marginTop: 2 }}>
              MATTER 2026-114 · Critical
            </div>
          </div>
          <span style={{ color: "#F5B7AC", display: "flex" }}>{ICON.chevDown}</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ position: "relative", flex: 1, padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{
          color: "rgba(212,232,220,0.4)", fontFamily: "var(--esg-mono)",
          fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "6px 12px 6px",
        }}>Navigation</div>
        {items.map(it => {
          const isActive = it.id === active;
          return (
            <a key={it.id} href="#" style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "9px 12px", borderRadius: 6, textDecoration: "none",
              borderLeft: `3px solid ${isActive ? "var(--esg-orange)" : "transparent"}`,
              background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
              color: isActive ? "#fff" : "rgba(212,232,220,0.85)",
              cursor: "pointer",
            }}>
              <span style={{ color: isActive ? "var(--esg-orange)" : "rgba(212,232,220,0.65)", display: "flex" }}>{it.icon}</span>
              <span style={{ flex: 1, fontFamily: "var(--esg-sans)", fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{it.label}</span>
              {isActive && <span style={{ color: "var(--esg-orange)" }}>{ICON.chev}</span>}
            </a>
          );
        })}
      </nav>

      {/* Account row — notification + user */}
      <div style={{
        position: "relative",
        padding: "12px 14px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button aria-label="Notifications" style={{
          width: 34, height: 34, borderRadius: 6, position: "relative",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(212,232,220,0.85)", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}>
          {ICON.bell}
          <span style={{
            position: "absolute", top: 6, right: 6, width: 7, height: 7,
            borderRadius: "50%", background: "var(--esg-orange)",
            boxShadow: "0 0 0 2px var(--esg-nav)",
          }} />
        </button>

        <button style={{
          flex: 1, display: "flex", alignItems: "center", gap: 9,
          padding: "4px 8px 4px 4px", borderRadius: 999,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(212,232,220,0.95)", cursor: "pointer",
          textAlign: "left",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--esg-orange), #E48553)",
            color: "#fff", display: "grid", placeItems: "center", flexShrink: 0,
            fontFamily: "var(--esg-serif)", fontSize: 11, fontWeight: 600,
          }}>MÇ</div>
          <div style={{ minWidth: 0, flex: 1, lineHeight: 1.1 }}>
            <div style={{ fontFamily: "var(--esg-sans)", fontSize: 12, fontWeight: 600, color: "#fff" }}>M. Çelik</div>
            <div style={{ fontFamily: "var(--esg-mono)", fontSize: 9.5, color: "rgba(212,232,220,0.6)", marginTop: 2 }}>
              Lead reviewer
            </div>
          </div>
          <span style={{ color: "rgba(212,232,220,0.55)", display: "flex" }}>{ICON.chevDown}</span>
        </button>
      </div>

      {/* SSL footer */}
      <div style={{ position: "relative", padding: "10px 20px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "rgba(212,232,220,0.7)", display: "flex" }}>{ICON.shield}</span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
            display: "inline-block", animation: "esg-blink 2.4s ease-in-out infinite",
          }} />
          <span style={{ color: "rgba(212,232,220,0.85)", fontFamily: "var(--esg-mono)", fontSize: 10.5, fontWeight: 500 }}>
            {t.common.ssl}
          </span>
        </div>
      </div>
    </aside>
  );
}

// Inline page title (replaces the removed top bar) ────────────────
function PageTitle({ title, subtitle, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 16,
      padding: "20px 24px 16px",
      borderBottom: "1px solid var(--esg-border)",
      background: "transparent",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          margin: 0, fontFamily: "var(--esg-serif)", fontWeight: 600,
          fontSize: 24, lineHeight: 1.15, color: "var(--esg-fg)",
          letterSpacing: "-0.01em",
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            margin: "4px 0 0", fontFamily: "var(--esg-mono)", fontSize: 11,
            color: "var(--esg-fg-muted)", letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

// Shell wrapper used by every screen artboard ────────────────────
function AppShell({ active, title, subtitle, children, headerRight }) {
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      background: "var(--esg-page)", color: "var(--esg-fg)",
      fontFamily: "var(--esg-sans)", fontSize: 13, lineHeight: 1.5,
      overflow: "hidden",
    }}>
      <Sidebar active={active} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {title && <PageTitle title={title} subtitle={subtitle} right={headerRight} />}
        <main style={{ flex: 1, overflow: "auto", padding: "20px 24px 24px" }}>{children}</main>
      </div>
    </div>
  );
}

// Header kept as a thin compatibility shim (in case any older screen
// still calls it directly) — renders the inline page title instead
// of the old bar, with no chrome.
function Header({ title, subtitle }) {
  return <PageTitle title={title} subtitle={subtitle} />;
}

Object.assign(window, { Sidebar, Header, AppShell, PageTitle, GreenGrid, ICON, useI18N, I18N });
