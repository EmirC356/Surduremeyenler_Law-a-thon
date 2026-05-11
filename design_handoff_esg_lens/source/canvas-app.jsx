// Main canvas app — composes all screens into a DesignCanvas with sections.
// Provides Tweaks panel for lang + density + accent swap.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "en",
  "accent": "orange",
  "navTheme": "forest"
}/*EDITMODE-END*/;

const {
  DesignCanvas, DCSection, DCArtboard,
  TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor,
  Sidebar, Header, AppShell, AnalysisIntake, AnalysisReview,
  DashboardEditorial, DashboardTerminal, DashboardTriage,
  GreenlightingBrief, GreenlightingCompare,
  SignInSplit, SignUpCentered, ForgotPassword,
} = window;

const ACCENTS = {
  orange: { orange: "#C4622D", orangeLight: "#FAE8DC", orangeDark: "#8B3A18" },
  cobalt: { orange: "#2B5BD7", orangeLight: "#E1ECFF", orangeDark: "#1E40AF" },
  rust:   { orange: "#A23F1A", orangeLight: "#F7DCCB", orangeDark: "#6B260D" },
};
const NAV_THEMES = {
  forest:   { nav: "#1A3D2B", navHover: "#2D6A4F" },
  charcoal: { nav: "#1F1F1D", navHover: "#383834" },
  ink:      { nav: "#10243A", navHover: "#1F3854" },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Expose to children
  React.useEffect(() => {
    window.__esg = window.__esg || {};
    window.__esg.lang = t.lang;
    window.__esg.setTweak = setTweak;
  }, [t.lang, setTweak]);

  // Apply theme vars to documentElement on every change
  React.useEffect(() => {
    const a = ACCENTS[t.accent] || ACCENTS.orange;
    const nv = NAV_THEMES[t.navTheme] || NAV_THEMES.forest;
    const r = document.documentElement.style;
    r.setProperty("--esg-orange",        a.orange);
    r.setProperty("--esg-orange-light",  a.orangeLight);
    r.setProperty("--esg-orange-dark",   a.orangeDark);
    r.setProperty("--esg-nav",           nv.nav);
    r.setProperty("--esg-nav-hover",     nv.navHover);
  }, [t.accent, t.navTheme]);

  const W = 1440, H = 920;

  return (
    <>
      <DesignCanvas
        title="ESG Lens — Frontend redesign"
        subtitle="Bold rethink · 3 dashboards · 2 analyses · 2 risk views · auth · EN/TR"
      >
        <DCSection id="dashboard" title="Dashboard" subtitle="Compliance overview · 3 directions">
          <DCArtboard id="d-editorial" label="V1 · Editorial Brief" width={W} height={H}>
            <DashboardEditorial />
          </DCArtboard>
          <DCArtboard id="d-terminal" label="V2 · Evidence Terminal" width={W} height={H}>
            <DashboardTerminal />
          </DCArtboard>
          <DCArtboard id="d-triage" label="V3 · Triage Workspace" width={W} height={H}>
            <DashboardTriage />
          </DCArtboard>
        </DCSection>

        <DCSection id="analysis" title="Document Analysis" subtitle="Upload & review · 2 directions">
          <DCArtboard id="a-intake" label="V1 · Intake & Stages" width={W} height={H}>
            <AnalysisIntake />
          </DCArtboard>
          <DCArtboard id="a-review" label="V2 · Document Review" width={W} height={H}>
            <AnalysisReview />
          </DCArtboard>
        </DCSection>

        <DCSection id="risk" title="Greenlighting Risk" subtitle="2 directions">
          <DCArtboard id="r-brief" label="V1 · Legal Brief" width={W} height={H}>
            <GreenlightingBrief />
          </DCArtboard>
          <DCArtboard id="r-ledger" label="V2 · Claim · Reality Ledger" width={W} height={H}>
            <GreenlightingCompare />
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="Auth" subtitle="Sign in · Sign up · Forgot">
          <DCArtboard id="auth-signin" label="Sign in · Split" width={1200} height={760}>
            <SignInSplit />
          </DCArtboard>
          <DCArtboard id="auth-signup" label="Sign up · Centered" width={1200} height={760}>
            <SignUpCentered />
          </DCArtboard>
          <DCArtboard id="auth-forgot" label="Forgot password" width={1200} height={760}>
            <ForgotPassword />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Localization">
          <TweakRadio
            label="Language"
            value={t.lang}
            options={[{ value: "en", label: "EN" }, { value: "tr", label: "TR" }]}
            onChange={v => setTweak("lang", v)}
          />
        </TweakSection>

        <TweakSection title="Brand">
          <TweakColor
            label="Accent (active state + CTA)"
            value={t.accent}
            options={[
              { value: "orange", color: "#C4622D", label: "Orange (current)" },
              { value: "cobalt", color: "#2B5BD7", label: "Cobalt" },
              { value: "rust",   color: "#A23F1A", label: "Rust" },
            ]}
            onChange={v => setTweak("accent", v)}
          />
          <TweakColor
            label="Sidebar"
            value={t.navTheme}
            options={[
              { value: "forest",   color: "#1A3D2B", label: "Forest (current)" },
              { value: "charcoal", color: "#1F1F1D", label: "Charcoal" },
              { value: "ink",      color: "#10243A", label: "Ink" },
            ]}
            onChange={v => setTweak("navTheme", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
