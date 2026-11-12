import { Moon, Sun, ShieldCheck, Users, UserCheck, Compass, LayoutGrid, User, HelpCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export function Navbar() {
  const {
    state,
    t,
    panel,
    setPanel,
    citizenView,
    setCitizenView,
    setLang,
    setTheme,
    activeCitizen
  } = useStore();

  const panelButtons = [
    { id: "citizen", label: t.panels.citizen, icon: Compass },
    { id: "csc", label: t.panels.csc, icon: Users },
    { id: "admin", label: t.panels.admin, icon: ShieldCheck }
  ];

  const citizenTabs = [
    { id: "home", label: t.nav.home, icon: LayoutGrid },
    { id: "discover", label: t.nav.discover, icon: Compass },
    { id: "profile", label: t.nav.profile, icon: User },
    { id: "howItWorks", label: t.nav.howItWorks, icon: HelpCircle }
  ];

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        backgroundColor: state.theme === "dark" ? "rgba(17, 24, 39, 0.92)" : "rgba(255, 255, 255, 0.92)",
        borderColor: "var(--gc-border)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <button
            onClick={() => {
              setPanel("citizen");
              setCitizenView("home");
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm"
              style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
            >
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight" style={{ color: "var(--gc-text)" }}>
                  {t.brand}
                </span>
                <span
                  className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                >
                  HackKumbh 2026
                </span>
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--gc-muted)" }}>
                {t.tagline}
              </p>
            </div>
          </button>

          {/* 3-Panel Switcher */}
          <div
            className="inline-flex items-center p-1 rounded-2xl border gap-1"
            style={{ backgroundColor: "var(--gc-surface-soft)", borderColor: "var(--gc-border)" }}
          >
            {panelButtons.map((btn) => {
              const Icon = btn.icon;
              const active = panel === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setPanel(btn.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  style={
                    active
                      ? { backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }
                      : { color: "var(--gc-text)" }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: 2 Themes + 3 Languages + Active Citizen */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 2-Theme Toggle */}
            <button
              onClick={() => setTheme(state.theme === "light" ? "dark" : "light")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition"
              style={{
                backgroundColor: "var(--gc-surface)",
                borderColor: "var(--gc-border)",
                color: "var(--gc-text)"
              }}
              title="Toggle Civic Light / Gramin Dark"
            >
              {state.theme === "light" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{state.theme === "light" ? t.themes.light : t.themes.dark}</span>
            </button>

            {/* 3-Language Switcher */}
            <div
              className="inline-flex items-center p-1 rounded-xl border"
              style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
            >
              {[
                { code: "en", label: "EN" },
                { code: "hi", label: "हिंदी" },
                { code: "mr", label: "मराठी" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition"
                  style={
                    state.lang === l.code
                      ? { backgroundColor: "var(--gc-accent)", color: "var(--gc-accent-fg)" }
                      : { color: "var(--gc-muted)" }
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>

            {panel === "citizen" && activeCitizen && (
              <button
                onClick={() => setCitizenView("profile")}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
                style={{
                  backgroundColor: "var(--gc-surface-soft)",
                  borderColor: "var(--gc-border-strong)",
                  color: "var(--gc-primary)"
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{activeCitizen.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Citizen Sub-navigation */}
        {panel === "citizen" && (
          <nav className="flex flex-wrap items-center gap-2 pt-1">
            {citizenTabs.map((tab) => {
              const Icon = tab.icon;
              const active = citizenView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCitizenView(tab.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border"
                  style={
                    active
                      ? {
                          backgroundColor: "var(--gc-primary)",
                          borderColor: "var(--gc-primary)",
                          color: "var(--gc-primary-fg)"
                        }
                      : {
                          backgroundColor: "var(--gc-surface)",
                          borderColor: "var(--gc-border)",
                          color: "var(--gc-muted)"
                        }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
