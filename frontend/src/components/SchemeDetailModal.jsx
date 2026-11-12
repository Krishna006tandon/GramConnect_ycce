import { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  FileCheck2,
  ClipboardList,
  ShieldAlert,
  Copy,
  Check
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { evaluateSchemeEligibility, prefillAnswersFromProfile } from "../utils/eligibilityEngine";
import { ReadinessRing } from "./ReadinessRing";

export function SchemeDetailModal({ schemeId, onClose, citizenOverride = null, performedBy = "Self" }) {
  const {
    state,
    t,
    activeCitizen,
    toggleSaveScheme,
    recordAssessment,
    updateDocStatus,
    upsertApplication,
    logAssistance
  } = useStore();

  const targetCitizen = citizenOverride || activeCitizen;
  const scheme = state.schemes.find((s) => s.id === schemeId);

  const [tab, setTab] = useState("overview");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [refNo, setRefNo] = useState("");
  const [appStatus, setAppStatus] = useState("Preparation pending");
  const [appNotes, setAppNotes] = useState("");
  const [appSavedMsg, setAppSavedMsg] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!scheme) return;
    const prefilled = prefillAnswersFromProfile(scheme.rules, targetCitizen);
    setAnswers(prefilled);
    setResult(null);

    if (targetCitizen) {
      const existingApp = state.applications.find(
        (a) => a.citizenId === targetCitizen.id && a.schemeId === scheme.id
      );
      if (existingApp) {
        setRefNo(existingApp.referenceNo || "");
        setAppStatus(existingApp.status || "Preparation pending");
        setAppNotes(existingApp.notes || "");
      } else {
        setRefNo("");
        setAppStatus("Preparation pending");
        setAppNotes("");
      }
    }
    setAppSavedMsg("");
  }, [schemeId, targetCitizen?.id]);

  if (!scheme) return null;

  const safeOfficialUrl = /^https?:\/\//i.test(scheme.officialUrl || "")
    ? scheme.officialUrl
    : `https://${scheme.officialUrl || "www.myscheme.gov.in"}`;

  const handleCopyPortalUrl = async () => {
    try {
      await navigator.clipboard.writeText(safeOfficialUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Ignore clipboard permission failures
    }
  };

  const isSaved = targetCitizen
    ? (state.savedSchemes[targetCitizen.id] || []).includes(scheme.id)
    : false;

  const docMap = targetCitizen
    ? (state.docReadiness[targetCitizen.id] && state.docReadiness[targetCitizen.id][scheme.id]) || {}
    : {};

  const readyCount = scheme.documents.filter((d) => docMap[d.id] === "ready").length;
  const docPct = scheme.documents.length
    ? Math.round((readyCount / scheme.documents.length) * 100)
    : 0;

  const handleEvaluate = () => {
    const evalRes = evaluateSchemeEligibility(scheme.rules, answers);
    setResult(evalRes);
    if (targetCitizen) {
      recordAssessment(targetCitizen.id, scheme.id, evalRes.outcome, answers, performedBy);
      if (performedBy !== "Self") {
        logAssistance(
          targetCitizen.id,
          performedBy,
          `Evaluated ${scheme.code} eligibility (${evalRes.outcome})`
        );
      }
    }
  };

  const handleResetAnswers = () => {
    setAnswers({});
    setResult(null);
  };

  const handleDocChange = (docId, newStatus) => {
    if (!targetCitizen) return;
    updateDocStatus(targetCitizen.id, scheme.id, docId, newStatus);
    if (performedBy !== "Self") {
      logAssistance(targetCitizen.id, performedBy, `Updated ${scheme.code} document checklist`);
    }
  };

  const handleSaveApplication = (e) => {
    e.preventDefault();
    if (!targetCitizen) return;
    const existing = state.applications.find(
      (a) => a.citizenId === targetCitizen.id && a.schemeId === scheme.id
    );
    upsertApplication({
      id: existing?.id,
      citizenId: targetCitizen.id,
      schemeId: scheme.id,
      referenceNo: refNo.trim(),
      status: appStatus,
      notes: appNotes.trim(),
      assistedBy: performedBy
    });
    if (performedBy !== "Self") {
      logAssistance(
        targetCitizen.id,
        performedBy,
        `Recorded ${scheme.code} application status (${appStatus})`
      );
    }
    setAppSavedMsg("Application record saved!");
    setTimeout(() => setAppSavedMsg(""), 3000);
  };

  const outcomeBannerStyle = (outcome) => {
    if (outcome === "eligible") {
      return { bg: "rgba(5, 150, 105, 0.12)", border: "#059669", text: "#059669", icon: CheckCircle2 };
    }
    if (outcome === "not_eligible") {
      return { bg: "rgba(220, 38, 38, 0.12)", border: "#dc2626", text: "#dc2626", icon: XCircle };
    }
    if (outcome === "needs_verification") {
      return { bg: "rgba(217, 119, 6, 0.12)", border: "#d97706", text: "#d97706", icon: AlertTriangle };
    }
    return { bg: "rgba(79, 70, 229, 0.12)", border: "#4f46e5", text: "#4f46e5", icon: HelpCircle };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
      >
        {/* Modal Header */}
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: "var(--gc-border)", backgroundColor: "var(--gc-surface-soft)" }}
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
              >
                {scheme.code}
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                {scheme.level} • {scheme.state} • {t.scheme.verifiedOn}: {scheme.lastVerified}
              </span>
              {targetCitizen && (
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{ borderColor: "var(--gc-border-strong)", color: "var(--gc-accent)" }}
                >
                  Citizen: {targetCitizen.name}
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-extrabold">{scheme.title[state.lang] || scheme.title.en}</h2>
            <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
              {scheme.department}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {targetCitizen && (
              <button
                onClick={() => toggleSaveScheme(targetCitizen.id, scheme.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold"
                style={{ borderColor: "var(--gc-border-strong)", color: isSaved ? "var(--gc-primary)" : "var(--gc-text)" }}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? t.scheme.saved : t.scheme.save}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border hover:opacity-80"
              style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="px-5 py-2.5 border-b flex flex-wrap gap-2"
          style={{ borderColor: "var(--gc-border)" }}
        >
          {[
            { id: "overview", label: t.scheme.tabs.overview },
            { id: "eligibility", label: t.scheme.tabs.eligibility },
            { id: "documents", label: `${t.scheme.tabs.documents} (${readyCount}/${scheme.documents.length})` },
            { id: "apply", label: t.scheme.tabs.apply }
          ].map((tb) => {
            const active = tab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition"
                style={
                  active
                    ? { backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }
                    : { backgroundColor: "var(--gc-bg)", color: "var(--gc-muted)" }
                }
              >
                {tb.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="bento-card p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                  Description
                </h3>
                <p className="text-sm leading-relaxed">{scheme.shortDesc[state.lang] || scheme.shortDesc.en}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bento-card p-4 space-y-2" style={{ backgroundColor: "var(--gc-surface-soft)" }}>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                    {t.scheme.benefits}
                  </h3>
                  <p className="text-sm font-semibold">{scheme.benefits[state.lang] || scheme.benefits.en}</p>
                </div>

                <div className="bento-card p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-accent)" }}>
                    {t.scheme.eligibilitySummary}
                  </h3>
                  <p className="text-sm">{scheme.eligibilitySummary[state.lang] || scheme.eligibilitySummary.en}</p>
                </div>
              </div>

              <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs space-y-1">
                  <div style={{ color: "var(--gc-muted)" }}>
                    Target Group: <strong style={{ color: "var(--gc-text)" }}>{scheme.targetBeneficiaries}</strong>
                  </div>
                  <div style={{ color: "var(--gc-muted)" }}>
                    Helpline: <strong style={{ color: "var(--gc-text)" }}>{scheme.applicationGuide.helpline}</strong>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTab("eligibility")}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                  >
                    Run Eligibility Checker →
                  </button>
                  <a
                    href={safeOfficialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold"
                    style={{ borderColor: "var(--gc-border-strong)", color: "var(--gc-accent)" }}
                  >
                    <span>{t.scheme.officialSource}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {tab === "eligibility" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold">{t.eligibility.title}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
                  {t.eligibility.subtitle}
                </p>
              </div>

              <div className="space-y-3">
                {scheme.rules.map((rule, idx) => (
                  <div key={rule.id} className="bento-card p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold">
                        {idx + 1}. {rule.question}
                      </span>
                      <span
                        className="text-xs font-extrabold px-2 py-0.5 rounded-md shrink-0"
                        style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-accent)" }}
                      >
                        {rule.logic}
                      </span>
                    </div>

                    {rule.type === "yesno" && (
                      <div className="flex flex-wrap gap-2">
                        {[
                          { val: "yes", label: "Yes" },
                          { val: "no", label: "No" },
                          { val: "unsure", label: "Not Sure / Verify" }
                        ].map((opt) => {
                          const selected = answers[rule.id] === opt.val;
                          return (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [rule.id]: opt.val }))}
                              className="px-3.5 py-2 rounded-xl border text-xs font-bold transition"
                              style={
                                selected
                                  ? {
                                      backgroundColor: "var(--gc-primary)",
                                      borderColor: "var(--gc-primary)",
                                      color: "var(--gc-primary-fg)"
                                    }
                                  : {
                                      backgroundColor: "var(--gc-bg)",
                                      borderColor: "var(--gc-border)",
                                      color: "var(--gc-text)"
                                    }
                              }
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {rule.type === "select" && (
                      <select
                        value={answers[rule.id] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [rule.id]: e.target.value }))}
                        className="w-full sm:w-72 px-3 py-2 rounded-xl border text-xs font-semibold"
                        style={{
                          backgroundColor: "var(--gc-bg)",
                          borderColor: "var(--gc-border)",
                          color: "var(--gc-text)"
                        }}
                      >
                        <option value="">-- Select option --</option>
                        {(rule.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {rule.type === "number" && (
                      <input
                        type="number"
                        value={answers[rule.id] ?? ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [rule.id]: e.target.value }))}
                        placeholder="Enter numeric value..."
                        className="w-full sm:w-64 px-3 py-2 rounded-xl border text-xs font-semibold"
                        style={{
                          backgroundColor: "var(--gc-bg)",
                          borderColor: "var(--gc-border)",
                          color: "var(--gc-text)"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleEvaluate}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                >
                  {t.eligibility.evaluateBtn}
                </button>
                <button
                  onClick={handleResetAnswers}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold"
                  style={{ borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
                >
                  {t.eligibility.resetBtn}
                </button>
              </div>

              {result && (
                <div className="space-y-3 pt-2">
                  {(() => {
                    const st = outcomeBannerStyle(result.outcome);
                    const Icon = st.icon;
                    return (
                      <div
                        className="p-4 rounded-2xl border space-y-2"
                        style={{ backgroundColor: st.bg, borderColor: st.border }}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-base" style={{ color: st.text }}>
                          <Icon className="w-5 h-5" />
                          <span>{t.eligibility.outcomes[result.outcome]}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--gc-text)" }}>
                          {t.eligibility.disclaimer}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="bento-card p-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
                      Rule-by-Rule Evaluation Breakdown
                    </h4>
                    <div className="space-y-2">
                      {result.details.map((d) => (
                        <div
                          key={d.ruleId}
                          className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl text-xs"
                          style={{ backgroundColor: "var(--gc-bg)" }}
                        >
                          <span className="font-semibold">
                            [{d.logic}] {d.label}
                          </span>
                          <span
                            className="font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              color:
                                d.status === "passed"
                                  ? "#059669"
                                  : d.status === "failed"
                                  ? "#dc2626"
                                  : d.status === "manual"
                                  ? "#d97706"
                                  : "#4f46e5"
                            }}
                          >
                            {d.status === "passed" && t.eligibility.passed}
                            {d.status === "failed" && t.eligibility.failed}
                            {d.status === "manual" && t.eligibility.manual}
                            {d.status === "missing" && t.eligibility.missing}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "documents" && (
            <div className="space-y-4">
              <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold">{t.documents.title}</h3>
                  <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
                    {t.documents.subtitle}
                  </p>
                </div>
                <ReadinessRing
                  percentage={docPct}
                  size={74}
                  label={`${readyCount}/${scheme.documents.length} ${t.documents.prepared}`}
                />
              </div>

              <div
                className="p-3 rounded-xl border flex items-center gap-2 text-xs"
                style={{ backgroundColor: "var(--gc-surface-soft)", borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: "var(--gc-primary)" }} />
                <span>Illustrative checklist for prototype readiness tracking — no Aadhaar or sensitive file uploads.</span>
              </div>

              <div className="space-y-2.5">
                {scheme.documents.map((doc) => {
                  const status = docMap[doc.id] || "not_prepared";
                  return (
                    <div
                      key={doc.id}
                      className="bento-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck2 className="w-4 h-4 shrink-0" style={{ color: "var(--gc-primary)" }} />
                        <span className="text-sm font-bold">{doc.name}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "not_prepared", label: t.documents.states.not_prepared, color: "#dc2626" },
                          { id: "needs_verification", label: t.documents.states.needs_verification, color: "#d97706" },
                          { id: "ready", label: t.documents.states.ready, color: "#059669" }
                        ].map((st) => {
                          const active = status === st.id;
                          return (
                            <button
                              key={st.id}
                              onClick={() => handleDocChange(doc.id, st.id)}
                              className="px-3 py-1.5 rounded-xl border text-xs font-bold transition"
                              style={
                                active
                                  ? { backgroundColor: st.color, borderColor: st.color, color: "#ffffff" }
                                  : { backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-muted)" }
                              }
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "apply" && (
            <div className="space-y-5">
              <div className="bento-card p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold">{t.apply.title}</h3>
                    <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
                      <strong>{t.apply.method}:</strong> {scheme.applicationGuide.method}
                    </p>
                    <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                      <strong>{t.apply.department}:</strong> {scheme.department}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={safeOfficialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                      style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                    >
                      <span>{t.apply.portalBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyPortalUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold"
                      style={{ borderColor: "var(--gc-border-strong)", color: "var(--gc-text)" }}
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? "Copied" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>
                <div className="text-xs font-mono px-3 py-2 rounded-xl" style={{ backgroundColor: "var(--gc-bg)", color: "var(--gc-muted)" }}>
                  Official URL:{" "}
                  <a href={safeOfficialUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--gc-accent)" }}>
                    {safeOfficialUrl}
                  </a>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                    {t.apply.stepsTitle}
                  </h4>
                  {scheme.applicationGuide.steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-2.5 rounded-xl text-xs"
                      style={{ backgroundColor: "var(--gc-bg)" }}
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-extrabold shrink-0"
                        style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="pt-0.5 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Application Tracking Form */}
              <form onSubmit={handleSaveApplication} className="bento-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" style={{ color: "var(--gc-accent)" }} />
                  <h3 className="text-base font-extrabold">{t.apply.trackTitle}</h3>
                </div>
                <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                  {t.apply.trackNotice}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder={t.apply.refPlaceholder}
                    className="px-3.5 py-2.5 rounded-xl border text-xs font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border text-xs font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  >
                    {t.apply.statuses.map((st, idx) => (
                      <option key={idx} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Optional preparation notes (e.g. visited Setu Kendra on 12 Nov)"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold"
                  style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                />

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: "var(--gc-accent)", color: "var(--gc-accent-fg)" }}
                  >
                    {t.apply.saveTrackBtn}
                  </button>
                  {appSavedMsg && (
                    <span className="text-xs font-bold" style={{ color: "var(--gc-primary)" }}>
                      ✓ {appSavedMsg}
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
