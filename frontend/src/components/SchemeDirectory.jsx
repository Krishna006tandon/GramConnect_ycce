import { useMemo, useState } from "react";
import { Search, Bookmark, BookmarkCheck, ExternalLink, CheckCircle2, Filter } from "lucide-react";
import { useStore } from "../context/StoreContext";

export function SchemeDirectory({ initialCategory = "All", onCategoryChange }) {
  const {
    state,
    t,
    activeCitizen,
    toggleSaveScheme,
    setSelectedSchemeId
  } = useStore();

  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("All");

  const verifiedSchemes = useMemo(
    () => state.schemes.filter((s) => s.verificationStatus === "Verified"),
    [state.schemes]
  );

  const categories = Object.keys(t.categories);
  const beneficiaries = useMemo(
    () => ["All", ...Array.from(new Set(verifiedSchemes.map((s) => s.targetBeneficiaries)))],
    [verifiedSchemes]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return verifiedSchemes.filter((s) => {
      if (initialCategory !== "All" && s.category !== initialCategory) return false;
      if (selectedState !== "All" && s.state !== selectedState && s.state !== "All India") return false;
      if (selectedLevel !== "All" && s.level !== selectedLevel) return false;
      if (selectedBeneficiary !== "All" && s.targetBeneficiaries !== selectedBeneficiary) return false;
      if (!q) return true;
      const titleAll = `${s.title.en} ${s.title.hi} ${s.title.mr}`.toLowerCase();
      const descAll = `${s.shortDesc.en} ${s.benefits.en} ${s.department} ${s.code}`.toLowerCase();
      return titleAll.includes(q) || descAll.includes(q);
    });
  }, [verifiedSchemes, initialCategory, selectedState, selectedLevel, selectedBeneficiary, query]);

  const savedIds = activeCitizen ? state.savedSchemes[activeCitizen.id] || [] : [];

  return (
    <div className="space-y-5">
      {/* Search & Filters Bento Card */}
      <div className="bento-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--gc-muted)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.filters.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--gc-bg)",
                borderColor: "var(--gc-border)",
                color: "var(--gc-text)"
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2" style={{ color: "var(--gc-muted)" }}>
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2.5 rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
            >
              <option value="All">{t.filters.allStates}</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="All India">All India (Central)</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2.5 rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
            >
              <option value="All">{t.filters.allLevels}</option>
              <option value="Central">Central</option>
              <option value="State">State</option>
            </select>

            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="px-3 py-2.5 rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
            >
              {beneficiaries.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? t.filters.allBeneficiaries : b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = initialCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition"
                style={
                  active
                    ? {
                        backgroundColor: "var(--gc-primary)",
                        borderColor: "var(--gc-primary)",
                        color: "var(--gc-primary-fg)"
                      }
                    : {
                        backgroundColor: "var(--gc-bg)",
                        borderColor: "var(--gc-border)",
                        color: "var(--gc-muted)"
                      }
                }
              >
                {t.categories[cat]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
        <span>
          {t.filters.showing} <strong style={{ color: "var(--gc-text)" }}>{filtered.length}</strong> {t.filters.schemes}
        </span>
        <span>Unverified drafts are hidden until Admin review</span>
      </div>

      {/* Scheme Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bento-card p-10 text-center space-y-2">
          <p className="font-bold text-base">No matching verified schemes found</p>
          <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
            Try clearing your search or switching category/state filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sch) => {
            const isSaved = savedIds.includes(sch.id);
            return (
              <div key={sch.id} className="bento-card bento-card-hover p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                    >
                      {t.categories[sch.category] || sch.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                      {activeCitizen && (
                        <button
                          onClick={() => toggleSaveScheme(activeCitizen.id, sch.id)}
                          className="p-1.5 rounded-xl border transition"
                          style={{ borderColor: "var(--gc-border)", color: isSaved ? "var(--gc-primary)" : "var(--gc-muted)" }}
                          title={isSaved ? t.scheme.saved : t.scheme.save}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base leading-snug">
                      {sch.title[state.lang] || sch.title.en}
                    </h3>
                    <p className="text-xs mt-1 font-medium" style={{ color: "var(--gc-muted)" }}>
                      {sch.department} • {sch.targetBeneficiaries}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                    {sch.shortDesc[state.lang] || sch.shortDesc.en}
                  </p>

                  <div
                    className="p-3 rounded-xl text-xs space-y-1"
                    style={{ backgroundColor: "var(--gc-surface-soft)" }}
                  >
                    <div className="font-bold" style={{ color: "var(--gc-primary)" }}>
                      {t.scheme.benefits}
                    </div>
                    <div style={{ color: "var(--gc-text)" }}>{sch.benefits[state.lang] || sch.benefits.en}</div>
                  </div>

                  <div className="text-xs" style={{ color: "var(--gc-muted)" }}>
                    <strong style={{ color: "var(--gc-text)" }}>{t.scheme.eligibilitySummary}:</strong>{" "}
                    {sch.eligibilitySummary[state.lang] || sch.eligibilitySummary.en}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t" style={{ borderColor: "var(--gc-border)" }}>
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--gc-muted)" }}>
                    <span>
                      {t.scheme.verifiedOn}: <strong style={{ color: "var(--gc-text)" }}>{sch.lastVerified}</strong>
                    </span>
                    <a
                      href={sch.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold hover:underline"
                      style={{ color: "var(--gc-accent)" }}
                    >
                      <span>{sch.applicationGuide.portalName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedSchemeId(sch.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition"
                    style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                  >
                    {t.scheme.viewDetails}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
