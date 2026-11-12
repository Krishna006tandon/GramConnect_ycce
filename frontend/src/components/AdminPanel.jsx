import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  ClipboardCheck,
  ShieldCheck,
  X,
  RefreshCw
} from "lucide-react";
import { useStore } from "../context/StoreContext";

const emptySchemeTemplate = {
  id: "",
  code: "NEW-SCH",
  category: "Agriculture",
  level: "Central",
  state: "All India",
  targetBeneficiaries: "Farmers",
  department: "",
  officialUrl: "https://myscheme.gov.in/",
  lastVerified: new Date().toISOString().slice(0, 10),
  verificationStatus: "Draft",
  title: { en: "", hi: "", mr: "" },
  shortDesc: { en: "", hi: "", mr: "" },
  benefits: { en: "", hi: "", mr: "" },
  eligibilitySummary: { en: "", hi: "", mr: "" },
  rules: [
    {
      id: "rule-1",
      logic: "AND",
      question: "Are you a resident of the eligible state/region?",
      type: "yesno",
      operator: "boolean_yes",
      value: true
    }
  ],
  documents: [{ id: "doc-1", name: "Official Identity Proof (where required)" }],
  applicationGuide: {
    method: "Online via Official Portal or Authorized CSC",
    portalName: "myscheme.gov.in",
    helpline: "1800-11-0001",
    steps: [
      "Check scheme eligibility rules.",
      "Prepare required documents in the checklist.",
      "Apply on the official portal and save reference ID."
    ]
  }
};

export function AdminPanel() {
  const {
    state,
    t,
    upsertScheme,
    updateSchemeVerification,
    deleteScheme,
    resetDemoData,
    triggerExternalSync,
    fetchSyncHistory
  } = useStore();

  const [adminTab, setAdminTab] = useState("schemes"); // schemes | citizens | applications | sync
  const [editingScheme, setEditingScheme] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncHistory, setSyncHistory] = useState([]);
  const [adminSecret, setAdminSecret] = useState("");

  const loadSyncHistory = async () => {
    try {
      const logs = await fetchSyncHistory(adminSecret);
      setSyncHistory(logs);
    } catch (err) {
      setSyncMessage(`Sync history error: ${err.message}`);
    }
  };

  const handleRunSync = async () => {
    setSyncLoading(true);
    setSyncMessage("");
    try {
      const res = await triggerExternalSync(adminSecret);
      setSyncMessage(res.message || "Synchronization finished.");
      await loadSyncHistory();
    } catch (err) {
      setSyncMessage(`Sync failed: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const verifiedCount = state.schemes.filter((s) => s.verificationStatus === "Verified").length;

  const openEditor = (scheme = null) => {
    if (scheme) {
      setEditingScheme(JSON.parse(JSON.stringify(scheme)));
    } else {
      setEditingScheme(JSON.parse(JSON.stringify(emptySchemeTemplate)));
    }
  };

  const handleSaveScheme = (e) => {
    e.preventDefault();
    if (!editingScheme.title.en.trim()) return;
    const payload = {
      ...editingScheme,
      title: {
        en: editingScheme.title.en,
        hi: editingScheme.title.hi || editingScheme.title.en,
        mr: editingScheme.title.mr || editingScheme.title.en
      },
      shortDesc: {
        en: editingScheme.shortDesc.en,
        hi: editingScheme.shortDesc.hi || editingScheme.shortDesc.en,
        mr: editingScheme.shortDesc.mr || editingScheme.shortDesc.en
      },
      benefits: {
        en: editingScheme.benefits.en,
        hi: editingScheme.benefits.hi || editingScheme.benefits.en,
        mr: editingScheme.benefits.mr || editingScheme.benefits.en
      },
      eligibilitySummary: {
        en: editingScheme.eligibilitySummary.en,
        hi: editingScheme.eligibilitySummary.hi || editingScheme.eligibilitySummary.en,
        mr: editingScheme.eligibilitySummary.mr || editingScheme.eligibilitySummary.en
      }
    };
    upsertScheme(payload);
    setEditingScheme(null);
  };

  const addRuleRow = () => {
    setEditingScheme((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: `r-${Date.now()}`,
          logic: "AND",
          question: "",
          type: "yesno",
          operator: "boolean_yes",
          value: true
        }
      ]
    }));
  };

  const updateRuleRow = (idx, patch) => {
    setEditingScheme((prev) => ({
      ...prev,
      rules: prev.rules.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    }));
  };

  const removeRuleRow = (idx) => {
    setEditingScheme((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx)
    }));
  };

  const addDocRow = () => {
    setEditingScheme((prev) => ({
      ...prev,
      documents: [...prev.documents, { id: `doc-${Date.now()}`, name: "" }]
    }));
  };

  const statusBadge = (status) => {
    if (status === "Verified") return { bg: "rgba(5,150,105,0.14)", color: "#059669" };
    if (status === "Needs Review") return { bg: "rgba(217,119,6,0.14)", color: "#d97706" };
    if (status === "Archived") return { bg: "rgba(220,38,38,0.14)", color: "#dc2626" };
    return { bg: "rgba(100,116,139,0.16)", color: "var(--gc-muted)" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bento-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold">{t.admin.title}</h1>
          <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
            {t.admin.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openEditor(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
          >
            <Plus className="w-4 h-4" />
            <span>{t.admin.addScheme}</span>
          </button>
          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold"
            style={{ borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.admin.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Bento Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Citizens", value: state.citizens.length, icon: Users, color: "var(--gc-accent)" },
          { label: "Total Schemes", value: state.schemes.length, icon: FileText, color: "var(--gc-text)" },
          { label: "Verified Active", value: verifiedCount, icon: ShieldCheck, color: "var(--gc-primary)" },
          { label: "Assessments Run", value: state.assessments.length, icon: CheckCircle2, color: "var(--gc-primary)" },
          { label: "App Records", value: state.applications.length, icon: ClipboardCheck, color: "var(--gc-accent)" }
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bento-card p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                  {m.label}
                </span>
                <Icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <div className="text-2xl font-extrabold" style={{ color: m.color }}>
                {m.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "schemes", label: `Manage Schemes & Rules (${state.schemes.length})` },
          { id: "citizens", label: `Citizen Records (${state.citizens.length})` },
          { id: "applications", label: `Application Preparation Records (${state.applications.length})` },
          { id: "sync", label: "Data.gov.in Sync" }
        ].map((tb) => (
          <button
            key={tb.id}
            onClick={() => {
              setAdminTab(tb.id);
              if (tb.id === "sync") loadSyncHistory();
            }}
            className="px-4 py-2 rounded-xl border text-xs font-bold transition"
            style={
              adminTab === tb.id
                ? { backgroundColor: "var(--gc-primary)", borderColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }
                : { backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)", color: "var(--gc-muted)" }
            }
          >
            {tb.label}
          </button>
        ))}
      </div>

      {adminTab === "schemes" && (
        <div className="space-y-3">
          {state.schemes.map((sch) => {
            const st = statusBadge(sch.verificationStatus);
            return (
              <div
                key={sch.id}
                className="bento-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                    >
                      {sch.code}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: st.bg, color: st.color }}
                    >
                      {sch.verificationStatus}
                    </span>
                    <span className="text-xs" style={{ color: "var(--gc-muted)" }}>
                      {sch.category} • {sch.level} ({sch.state}) • {sch.rules.length} rules • {sch.documents.length} docs
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base">{sch.title.en}</h3>
                  <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                    {sch.department} • Last Verified: <strong>{sch.lastVerified}</strong> •{" "}
                    <a href={sch.officialUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--gc-accent)" }}>
                      {sch.applicationGuide.portalName}
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={sch.verificationStatus}
                    onChange={(e) => updateSchemeVerification(sch.id, e.target.value)}
                    className="px-3 py-2 rounded-xl border text-xs font-bold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Needs Review">Needs Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <button
                    onClick={() => openEditor(sch)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold"
                    style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit &amp; Rules</span>
                  </button>

                  <button
                    onClick={() => deleteScheme(sch.id)}
                    className="p-2 rounded-xl border text-xs font-bold text-red-600"
                    style={{ borderColor: "var(--gc-border)" }}
                    title="Delete scheme"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {adminTab === "citizens" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.citizens.map((c) => (
            <div key={c.id} className="bento-card p-4 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm">{c.name}</span>
                <span
                  className="px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                >
                  {c.occupation}
                </span>
              </div>
              <div style={{ color: "var(--gc-muted)" }}>
                {c.village}, {c.district}, {c.state}
              </div>
              <div style={{ color: "var(--gc-muted)" }}>
                Age: {c.age} • Income: ₹{Number(c.income).toLocaleString("en-IN")}/yr • Mobile: {c.mobile}
              </div>
              <div className="pt-1 font-semibold" style={{ color: "var(--gc-accent)" }}>
                Registered by: {c.registeredBy} ({c.createdAt})
              </div>
            </div>
          ))}
        </div>
      )}

      {adminTab === "applications" && (
        <div className="space-y-2.5">
          {state.applications.map((app) => {
            const cit = state.citizens.find((c) => c.id === app.citizenId);
            const sch = state.schemes.find((s) => s.id === app.schemeId);
            return (
              <div key={app.id} className="bento-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-sm">
                    {cit?.name || app.citizenId} — {sch?.title.en || app.schemeId}
                  </div>
                  <div style={{ color: "var(--gc-muted)" }}>
                    Ref: <strong className="font-mono">{app.referenceNo || "None"}</strong> • Assisted by: {app.assistedBy} • {app.updatedAt}
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full font-bold"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                >
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {adminTab === "sync" && (
        <div className="space-y-4">
          <div className="bento-card p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold">Open Government Data (data.gov.in) Synchronization</h2>
                <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
                  Fetches configured datasets from <code>api.data.gov.in</code>, normalizes fields, deduplicates by{" "}
                  <code>(resourceId, externalId)</code>, and imports records as <strong>Needs Review</strong> in MongoDB.
                </p>
              </div>
              <button
                type="button"
                disabled={syncLoading}
                onClick={handleRunSync}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-60"
                style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin" : ""}`} />
                <span>{syncLoading ? "Syncing Datasets..." : "Run Sync Now (data.gov.in)"}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs">
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Optional Admin Sync Secret (if ADMIN_SYNC_SECRET is set in backend/.env)"
                className="w-full sm:w-96 px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
              />
              <button
                type="button"
                onClick={loadSyncHistory}
                className="px-3.5 py-2 rounded-xl border font-bold"
                style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              >
                Refresh History
              </button>
            </div>

            {syncMessage && (
              <div
                className="p-3 rounded-xl border text-xs font-semibold"
                style={{ backgroundColor: "var(--gc-surface-soft)", borderColor: "var(--gc-border)" }}
              >
                {syncMessage}
              </div>
            )}
          </div>

          <div className="bento-card p-5 space-y-3">
            <h3 className="text-sm font-extrabold">Recent Sync History</h3>
            {syncHistory.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                No sync logs recorded yet. Configure <code>DATA_GOV_API_KEY</code> and{" "}
                <code>DATA_GOV_RESOURCE_IDS</code> in <code>backend/.env</code>, then click Run Sync Now.
              </p>
            ) : (
              <div className="space-y-2">
                {syncHistory.map((log) => (
                  <div
                    key={log._id || log.resourceId + log.completedAt}
                    className="p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs"
                    style={{ backgroundColor: "var(--gc-bg)" }}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold">
                        {log.sourceName || log.resourceId}{" "}
                        <span className="font-mono" style={{ color: "var(--gc-muted)" }}>
                          ({log.resourceId})
                        </span>
                      </div>
                      {log.error ? (
                        <div className="text-red-500 font-semibold">{log.error}</div>
                      ) : (
                        <div style={{ color: "var(--gc-muted)" }}>
                          Processed: {log.processed} • Failed: {log.failed}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: log.status === "success" ? "rgba(5,150,105,0.14)" : "rgba(220,38,38,0.14)",
                          color: log.status === "success" ? "#059669" : "#dc2626"
                        }}
                      >
                        {log.status}
                      </span>
                      <span style={{ color: "var(--gc-muted)" }}>
                        {log.completedAt ? new Date(log.completedAt).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheme & Configurable Rule Editor Modal */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
          <form
            onSubmit={handleSaveScheme}
            className="w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
            style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
          >
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "var(--gc-border)", backgroundColor: "var(--gc-surface-soft)" }}
            >
              <h2 className="font-extrabold text-lg">
                {editingScheme.id ? `Edit Scheme: ${editingScheme.code}` : "Create New Government Scheme"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="p-2 rounded-xl border"
                style={{ borderColor: "var(--gc-border)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">Scheme Name (English) *</label>
                  <input
                    required
                    value={editingScheme.title.en}
                    onChange={(e) =>
                      setEditingScheme({
                        ...editingScheme,
                        title: { ...editingScheme.title, en: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Scheme Code</label>
                  <input
                    value={editingScheme.code}
                    onChange={(e) => setEditingScheme({ ...editingScheme, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={editingScheme.category}
                    onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  >
                    {Object.keys(t.categories)
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Level / State</label>
                  <div className="flex gap-2">
                    <select
                      value={editingScheme.level}
                      onChange={(e) => setEditingScheme({ ...editingScheme, level: e.target.value })}
                      className="w-1/2 px-2 py-2 rounded-xl border font-semibold"
                      style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                    >
                      <option value="Central">Central</option>
                      <option value="State">State</option>
                    </select>
                    <input
                      value={editingScheme.state}
                      onChange={(e) => setEditingScheme({ ...editingScheme, state: e.target.value })}
                      className="w-1/2 px-2 py-2 rounded-xl border font-semibold"
                      style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold block mb-1">Verification Status</label>
                  <select
                    value={editingScheme.verificationStatus}
                    onChange={(e) => setEditingScheme({ ...editingScheme, verificationStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Needs Review">Needs Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Department</label>
                  <input
                    value={editingScheme.department}
                    onChange={(e) => setEditingScheme({ ...editingScheme, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Official Portal URL</label>
                  <input
                    value={editingScheme.officialUrl}
                    onChange={(e) => setEditingScheme({ ...editingScheme, officialUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Short Description (EN)</label>
                  <input
                    value={editingScheme.shortDesc.en}
                    onChange={(e) =>
                      setEditingScheme({
                        ...editingScheme,
                        shortDesc: { ...editingScheme.shortDesc, en: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Key Benefits (EN)</label>
                  <input
                    value={editingScheme.benefits.en}
                    onChange={(e) =>
                      setEditingScheme({
                        ...editingScheme,
                        benefits: { ...editingScheme.benefits, en: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border font-semibold"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                  />
                </div>
              </div>

              {/* Configurable Eligibility Rules */}
              <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: "var(--gc-border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold">Configurable Eligibility Rules (AND / OR / NOT)</h3>
                  <button
                    type="button"
                    onClick={addRuleRow}
                    className="px-3 py-1.5 rounded-xl font-bold"
                    style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                  >
                    + Add Rule
                  </button>
                </div>

                {editingScheme.rules.map((r, idx) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
                  >
                    <select
                      value={r.logic}
                      onChange={(e) => updateRuleRow(idx, { logic: e.target.value })}
                      className="sm:col-span-2 px-2 py-1.5 rounded-lg border font-bold"
                      style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                      <option value="NOT">NOT</option>
                    </select>
                    <input
                      value={r.question}
                      onChange={(e) => updateRuleRow(idx, { question: e.target.value })}
                      placeholder="Eligibility question prompt..."
                      className="sm:col-span-6 px-2.5 py-1.5 rounded-lg border font-semibold"
                      style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
                    />
                    <select
                      value={r.operator}
                      onChange={(e) => {
                        const op = e.target.value;
                        updateRuleRow(idx, {
                          operator: op,
                          type: op === "lte" || op === "gte" ? "number" : "yesno",
                          value: op === "boolean_yes" ? true : op === "boolean_no" ? false : r.value
                        });
                      }}
                      className="sm:col-span-2 px-2 py-1.5 rounded-lg border font-semibold"
                      style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
                    >
                      <option value="boolean_yes">Yes == True</option>
                      <option value="lte">Value &lt;=</option>
                      <option value="gte">Value &gt;=</option>
                      <option value="eq">Equals</option>
                    </select>
                    <div className="sm:col-span-2 flex items-center gap-1">
                      {(r.operator === "lte" || r.operator === "gte" || r.operator === "eq") && (
                        <input
                          value={String(r.value)}
                          onChange={(e) => updateRuleRow(idx, { value: e.target.value })}
                          placeholder="Target"
                          className="w-full px-2 py-1.5 rounded-lg border font-semibold"
                          style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeRuleRow(idx)}
                        className="p-1.5 text-red-500 font-bold"
                        title="Remove rule"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Checklist Requirements */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--gc-border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold">Required Documents Checklist</h3>
                  <button
                    type="button"
                    onClick={addDocRow}
                    className="px-3 py-1.5 rounded-xl font-bold"
                    style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                  >
                    + Add Document
                  </button>
                </div>
                {editingScheme.documents.map((doc, idx) => (
                  <div key={doc.id} className="flex gap-2">
                    <input
                      value={doc.name}
                      onChange={(e) =>
                        setEditingScheme({
                          ...editingScheme,
                          documents: editingScheme.documents.map((d, i) =>
                            i === idx ? { ...d, name: e.target.value } : d
                          )
                        })
                      }
                      placeholder="Document requirement name"
                      className="flex-1 px-3 py-1.5 rounded-xl border font-semibold"
                      style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingScheme({
                          ...editingScheme,
                          documents: editingScheme.documents.filter((_, i) => i !== idx)
                        })
                      }
                      className="px-2.5 text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="px-5 py-3.5 border-t flex items-center justify-end gap-2"
              style={{ borderColor: "var(--gc-border)" }}
            >
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
                style={{ borderColor: "var(--gc-border)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold"
                style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
              >
                Save Scheme &amp; Rules
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
