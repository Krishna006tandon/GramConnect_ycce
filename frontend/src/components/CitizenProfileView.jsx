import { useEffect, useState } from "react";
import { UserPlus, CheckCircle2, Bookmark, ClipboardList, FileCheck2, ShieldAlert } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ReadinessRing } from "./ReadinessRing";

const emptyForm = {
  id: "",
  name: "",
  mobile: "",
  email: "",
  state: "Maharashtra",
  district: "",
  village: "",
  age: "",
  occupation: "Farmer",
  income: "",
  gender: "Male",
  category: "General"
};

export function CitizenProfileView() {
  const {
    state,
    t,
    activeCitizen,
    setActiveCitizenId,
    upsertCitizen,
    setSelectedSchemeId,
    upsertApplication
  } = useStore();

  const [mode, setMode] = useState("edit"); // edit | new
  const [form, setForm] = useState(emptyForm);
  const [savedBanner, setSavedBanner] = useState("");

  useEffect(() => {
    if (mode === "edit" && activeCitizen) {
      setForm({ ...emptyForm, ...activeCitizen });
    }
  }, [activeCitizen?.id, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;
    const saved = upsertCitizen(
      {
        ...form,
        id: mode === "new" ? "" : form.id,
        consentRecorded: true,
        registeredBy: "Self"
      },
      { activateFor: "citizen" }
    );
    setMode("edit");
    setSavedBanner(`Profile saved for ${saved.name}`);
    setTimeout(() => setSavedBanner(""), 3000);
  };

  const savedIds = activeCitizen ? state.savedSchemes[activeCitizen.id] || [] : [];
  const myAssessments = activeCitizen
    ? state.assessments.filter((a) => a.citizenId === activeCitizen.id)
    : [];
  const myApps = activeCitizen
    ? state.applications.filter((a) => a.citizenId === activeCitizen.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Citizen Switcher + New Registration Header */}
      <div className="bento-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold">{t.profile.title}</h1>
          <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
            Switch citizen account or register a new profile (no Aadhaar or bank credentials collected).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeCitizen?.id || ""}
            onChange={(e) => {
              setMode("edit");
              setActiveCitizenId(e.target.value);
            }}
            className="px-3.5 py-2 rounded-xl border text-xs font-bold"
            style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
          >
            {state.citizens.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.district}, {c.state})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setMode("new");
              setForm(emptyForm);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Citizen</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Profile Registration / Edit Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bento-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">
              {mode === "new" ? "New Citizen Registration" : t.profile.registerTitle}
            </h2>
            {mode === "new" && (
              <button
                type="button"
                onClick={() => setMode("edit")}
                className="text-xs font-bold underline"
                style={{ color: "var(--gc-muted)" }}
              >
                Cancel
              </button>
            )}
          </div>

          <div
            className="p-2.5 rounded-xl border flex items-start gap-2 text-xs"
            style={{ backgroundColor: "var(--gc-surface-soft)", borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--gc-primary)" }} />
            <span>Do not enter Aadhaar numbers or bank passwords. Basic details are enough for rule-based matching.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">{t.profile.fields.name} *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ramesh Patil"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.mobile} *</label>
              <input
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.state}</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.district}</label>
              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="e.g. Wardha"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.village}</label>
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="e.g. Seloo"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.age}</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 54"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.occupation}</label>
              <select
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              >
                <option value="Farmer">Farmer</option>
                <option value="Agricultural Labourer">Agricultural Labourer</option>
                <option value="Student">Student</option>
                <option value="Artisan">Artisan</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Senior Citizen">Senior Citizen</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.income}</label>
              <input
                type="number"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
                placeholder="e.g. 95000"
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.gender}</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">{t.profile.fields.category}</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="VJNT">VJNT / NT</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold"
              style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
            >
              {t.profile.saveProfile}
            </button>
            {savedBanner && (
              <span className="text-xs font-bold" style={{ color: "var(--gc-primary)" }}>
                ✓ {savedBanner}
              </span>
            )}
          </div>
        </form>

        {/* Right: Saved Schemes, Readiness, Eligibility & Applications */}
        <div className="lg:col-span-7 space-y-5">
          {/* Saved Schemes + Document Progress */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" style={{ color: "var(--gc-primary)" }} />
              <h2 className="text-base font-extrabold">{t.profile.savedSchemes} &amp; Readiness</h2>
            </div>

            {savedIds.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                No saved schemes yet. Bookmark any scheme in Discover Schemes to track document readiness.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedIds.map((id) => {
                  const sch = state.schemes.find((s) => s.id === id);
                  if (!sch) return null;
                  const docs = (state.docReadiness[activeCitizen.id] && state.docReadiness[activeCitizen.id][id]) || {};
                  const ready = sch.documents.filter((d) => docs[d.id] === "ready").length;
                  const pct = sch.documents.length ? Math.round((ready / sch.documents.length) * 100) : 0;

                  return (
                    <div
                      key={id}
                      className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                      style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
                    >
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm">{sch.title[state.lang] || sch.title.en}</div>
                        <div className="text-xs" style={{ color: "var(--gc-muted)" }}>
                          {ready}/{sch.documents.length} docs ready
                        </div>
                        <button
                          onClick={() => setSelectedSchemeId(sch.id)}
                          className="text-xs font-bold underline"
                          style={{ color: "var(--gc-primary)" }}
                        >
                          Open Checklist →
                        </button>
                      </div>
                      <ReadinessRing percentage={pct} size={58} stroke={6} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Eligibility Assessments History */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: "var(--gc-accent)" }} />
              <h2 className="text-base font-extrabold">{t.profile.assessments}</h2>
            </div>

            {myAssessments.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                No eligibility checks recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {myAssessments.slice(0, 5).map((asmt) => {
                  const sch = state.schemes.find((s) => s.id === asmt.schemeId);
                  return (
                    <div
                      key={asmt.id}
                      className="p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ backgroundColor: "var(--gc-bg)" }}
                    >
                      <div>
                        <span className="font-bold">{sch ? sch.title[state.lang] || sch.title.en : asmt.schemeId}</span>
                        <span className="ml-2" style={{ color: "var(--gc-muted)" }}>
                          • {asmt.date} ({asmt.performedBy})
                        </span>
                      </div>
                      <button
                        onClick={() => sch && setSelectedSchemeId(sch.id)}
                        className="font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                      >
                        {t.eligibility.outcomes[asmt.outcome] || asmt.outcome}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Application Preparation Records */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" style={{ color: "var(--gc-primary)" }} />
              <h2 className="text-base font-extrabold">{t.profile.myApps}</h2>
            </div>

            {myApps.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                No tracked applications yet. Open any scheme&apos;s Apply &amp; Track tab to save a reference ID.
              </p>
            ) : (
              <div className="space-y-2.5">
                {myApps.map((app) => {
                  const sch = state.schemes.find((s) => s.id === app.schemeId);
                  return (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
                    >
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm">
                          {sch ? sch.title[state.lang] || sch.title.en : app.schemeId}
                        </div>
                        <div className="text-xs font-mono" style={{ color: "var(--gc-muted)" }}>
                          Ref: <strong style={{ color: "var(--gc-text)" }}>{app.referenceNo || "Not assigned yet"}</strong> • Updated {app.updatedAt}
                        </div>
                        {app.notes && (
                          <div className="text-xs" style={{ color: "var(--gc-muted)" }}>
                            {app.notes}
                          </div>
                        )}
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => upsertApplication({ ...app, status: e.target.value })}
                        className="px-3 py-1.5 rounded-xl border text-xs font-bold"
                        style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)", color: "var(--gc-primary)" }}
                      >
                        {t.apply.statuses.map((st, idx) => (
                          <option key={idx} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
