import {
  Sprout,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Sparkles,
  Landmark,
  PiggyBank,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  UserCircle2,
  ExternalLink
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ReadinessRing } from "./ReadinessRing";

const categoryMeta = [
  { key: "Agriculture", icon: Sprout, tint: "#059669" },
  { key: "Housing", icon: Home, tint: "#0284c7" },
  { key: "Healthcare", icon: HeartPulse, tint: "#dc2626" },
  { key: "Education", icon: GraduationCap, tint: "#4f46e5" },
  { key: "Employment", icon: Briefcase, tint: "#d97706" },
  { key: "Women Welfare", icon: Sparkles, tint: "#db2777" },
  { key: "Pension", icon: Landmark, tint: "#7c3aed" },
  { key: "Skill & Savings", icon: PiggyBank, tint: "#0d9488" }
];

export function HomeBento({ onSelectCategory }) {
  const {
    state,
    t,
    activeCitizen,
    setActiveCitizenId,
    setCitizenView,
    setSelectedSchemeId
  } = useStore();

  const verifiedSchemes = state.schemes.filter((s) => s.verificationStatus === "Verified");
  const savedIds = activeCitizen ? state.savedSchemes[activeCitizen.id] || [] : [];

  // Calculate overall document readiness across saved schemes for active citizen
  let totalDocs = 0;
  let readyDocs = 0;
  if (activeCitizen) {
    const citizenDocs = state.docReadiness[activeCitizen.id] || {};
    for (const schId of savedIds) {
      const scheme = verifiedSchemes.find((s) => s.id === schId);
      if (scheme) {
        totalDocs += scheme.documents.length;
        const map = citizenDocs[schId] || {};
        readyDocs += scheme.documents.filter((d) => map[d.id] === "ready").length;
      }
    }
  }
  const readinessPct = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;

  const launchRameshDemo = () => {
    setActiveCitizenId("cit-ramesh");
    setSelectedSchemeId("pm-kisan");
  };

  return (
    <div className="space-y-6">
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hero Bento Card */}
        <div
          className="lg:col-span-8 bento-card p-6 md:p-8 flex flex-col justify-between gap-6"
          style={{
            background:
              state.theme === "dark"
                ? "linear-gradient(135deg, #111827 0%, #0f2922 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)"
          }}
        >
          <div className="space-y-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.hero.badge}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {t.tagline}
            </h1>
            <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: "var(--gc-muted)" }}>
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCitizenView("discover")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
              >
                <span>{t.hero.ctaDiscover}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={launchRameshDemo}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition"
                style={{ backgroundColor: "var(--gc-accent)", color: "var(--gc-accent-fg)" }}
              >
                <span>{t.hero.ctaDemo}</span>
              </button>

              <button
                onClick={() => setCitizenView("profile")}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold border transition"
                style={{
                  backgroundColor: "var(--gc-surface)",
                  borderColor: "var(--gc-border-strong)",
                  color: "var(--gc-text)"
                }}
              >
                <span>{t.hero.ctaRegister}</span>
              </button>
            </div>

            <div
              className="flex items-start gap-2.5 p-3 rounded-xl border text-xs"
              style={{
                backgroundColor: "var(--gc-surface)",
                borderColor: "var(--gc-border)",
                color: "var(--gc-muted)"
              }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--gc-primary)" }} />
              <span>{t.hero.privacyNote}</span>
            </div>
          </div>
        </div>

        {/* Active Citizen Bento Card */}
        <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                Active Citizen Profile
              </span>
              <button
                onClick={() => setCitizenView("profile")}
                className="text-xs font-bold underline"
                style={{ color: "var(--gc-accent)" }}
              >
                Switch / Edit
              </button>
            </div>

            {activeCitizen ? (
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                >
                  <UserCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base">{activeCitizen.name}</h2>
                  <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                    {activeCitizen.occupation} • {activeCitizen.village}, {activeCitizen.district}
                  </p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--gc-primary)" }}>
                    {activeCitizen.state} • Income ₹{Number(activeCitizen.income).toLocaleString("en-IN")}/yr
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="p-4 rounded-2xl border flex items-center justify-between gap-3"
            style={{ backgroundColor: "var(--gc-surface-soft)", borderColor: "var(--gc-border)" }}
          >
            <ReadinessRing
              percentage={readinessPct}
              size={72}
              label={`${readyDocs}/${totalDocs} docs ready across ${savedIds.length} saved`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <button
              onClick={() => setCitizenView("profile")}
              className="p-3 rounded-xl border text-left hover:opacity-90 transition"
              style={{ borderColor: "var(--gc-border)", backgroundColor: "var(--gc-surface)" }}
            >
              <div className="text-lg font-extrabold" style={{ color: "var(--gc-primary)" }}>
                {savedIds.length}
              </div>
              <div className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                Saved Schemes
              </div>
            </button>
            <button
              onClick={() => setCitizenView("profile")}
              className="p-3 rounded-xl border text-left hover:opacity-90 transition"
              style={{ borderColor: "var(--gc-border)", backgroundColor: "var(--gc-surface)" }}
            >
              <div className="text-lg font-extrabold" style={{ color: "var(--gc-accent)" }}>
                {state.applications.filter((a) => a.citizenId === activeCitizen?.id).length}
              </div>
              <div className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                Tracked Apps
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Journey Strip */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
          {t.journey.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {t.journey.steps.map((step) => (
            <div key={step.num} className="bento-card p-4 flex items-start gap-3">
              <span
                className="px-2.5 py-1 rounded-xl text-xs font-extrabold shrink-0"
                style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
              >
                {step.num}
              </span>
              <div>
                <h3 className="font-bold text-sm">{step.title}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Oversized Bento Category Tiles */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
            {t.categoriesTitle}
          </h2>
          <button
            onClick={() => {
              onSelectCategory("All");
              setCitizenView("discover");
            }}
            className="text-xs font-bold inline-flex items-center gap-1"
            style={{ color: "var(--gc-primary)" }}
          >
            <span>View all ({verifiedSchemes.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryMeta.map((cat) => {
            const Icon = cat.icon;
            const count = verifiedSchemes.filter((s) => s.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  onSelectCategory(cat.key);
                  setCitizenView("discover");
                }}
                className="bento-card bento-card-hover p-5 text-left flex flex-col justify-between gap-4 min-h-[124px]"
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${cat.tint}18`, color: cat.tint }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                  >
                    {count} {count === 1 ? "scheme" : "schemes"}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base">{t.categories[cat.key] || cat.key}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Schemes */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
          Featured Verified Schemes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {verifiedSchemes.slice(0, 3).map((sch) => (
            <div key={sch.id} className="bento-card bento-card-hover p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                  >
                    {t.categories[sch.category] || sch.category}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                    {sch.level} • {sch.state}
                  </span>
                </div>
                <h3 className="font-extrabold text-base">{sch.title[state.lang] || sch.title.en}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                  {sch.shortDesc[state.lang] || sch.shortDesc.en}
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="p-2.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-text)" }}
                >
                  {sch.benefits[state.lang] || sch.benefits.en}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedSchemeId(sch.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition"
                    style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                  >
                    {t.scheme.viewDetails}
                  </button>
                  <a
                    href={sch.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border transition"
                    style={{ borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
                    title={t.scheme.officialSource}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
