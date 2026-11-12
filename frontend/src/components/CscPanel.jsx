import { useMemo, useState } from "react";
import { Search, UserPlus, UserCheck, ShieldCheck, History, Compass } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { SchemeDetailModal } from "./SchemeDetailModal";

export function CscPanel() {
  const {
    state,
    t,
    cscCitizen,
    setCscCitizenId,
    upsertCitizen,
    logAssistance
  } = useStore();

  const [operatorName, setOperatorName] = useState("Vikas Joshi (CSC Seloo)");
  const [citizenQuery, setCitizenQuery] = useState("");
  const [schemeQuery, setSchemeQuery] = useState("");
  const [showNewCitizen, setShowNewCitizen] = useState(false);
  const [assistedSchemeId, setAssistedSchemeId] = useState(null);

  const [newForm, setNewForm] = useState({
    name: "",
    mobile: "",
    state: "Maharashtra",
    district: "Wardha",
    village: "",
    age: "",
    occupation: "Farmer",
    income: "",
    gender: "Male",
    category: "OBC",
    consent: false
  });

  const filteredCitizens = useMemo(() => {
    const q = citizenQuery.trim().toLowerCase();
    if (!q) return state.citizens;
    return state.citizens.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q)
    );
  }, [state.citizens, citizenQuery]);

  const verifiedSchemes = useMemo(() => {
    const q = schemeQuery.trim().toLowerCase();
    return state.schemes
      .filter((s) => s.verificationStatus === "Verified")
      .filter((s) => {
        if (!q) return true;
        return (
          s.title.en.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
        );
      });
  }, [state.schemes, schemeQuery]);

  const handleRegisterCitizen = (e) => {
    e.preventDefault();
    if (!newForm.consent || !newForm.name.trim() || !newForm.mobile.trim()) return;
    const created = upsertCitizen(
      {
        ...newForm,
        consentRecorded: true,
        registeredBy: operatorName
      },
      { activateFor: "csc" }
    );
    logAssistance(created.id, operatorName, "Registered new citizen profile with informed consent");
    setShowNewCitizen(false);
    setNewForm({
      name: "",
      mobile: "",
      state: "Maharashtra",
      district: "Wardha",
      village: "",
      age: "",
      occupation: "Farmer",
      income: "",
      gender: "Male",
      category: "OBC",
      consent: false
    });
  };

  const activeLogs = cscCitizen
    ? state.assistanceLogs.filter((l) => l.citizenId === cscCitizen.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bento-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-accent)" }}
          >
            Assisted Service Mode
          </span>
          <h1 className="text-xl font-extrabold mt-2">{t.csc.title}</h1>
          <p className="text-xs mt-1" style={{ color: "var(--gc-muted)" }}>
            {t.csc.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs">
            <span className="font-bold mr-1.5" style={{ color: "var(--gc-muted)" }}>Operator:</span>
            <input
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
            />
          </div>
          <button
            onClick={() => setShowNewCitizen(!showNewCitizen)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showNewCitizen ? "Close Form" : "Register Citizen (With Consent)"}</span>
          </button>
        </div>
      </div>

      {/* Register Citizen with Consent Drawer */}
      {showNewCitizen && (
        <form onSubmit={handleRegisterCitizen} className="bento-card p-5 space-y-4">
          <h2 className="text-base font-extrabold">Assisted Citizen Registration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <input
              required
              placeholder="Citizen Full Name *"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <input
              required
              placeholder="Mobile Number *"
              value={newForm.mobile}
              onChange={(e) => setNewForm({ ...newForm, mobile: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <input
              placeholder="Village"
              value={newForm.village}
              onChange={(e) => setNewForm({ ...newForm, village: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <input
              placeholder="District"
              value={newForm.district}
              onChange={(e) => setNewForm({ ...newForm, district: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <input
              type="number"
              placeholder="Age"
              value={newForm.age}
              onChange={(e) => setNewForm({ ...newForm, age: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <select
              value={newForm.occupation}
              onChange={(e) => setNewForm({ ...newForm, occupation: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            >
              <option value="Farmer">Farmer</option>
              <option value="Agricultural Labourer">Agricultural Labourer</option>
              <option value="Student">Student</option>
              <option value="Artisan">Artisan</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Senior Citizen">Senior Citizen</option>
            </select>
            <input
              type="number"
              placeholder="Annual Family Income (₹)"
              value={newForm.income}
              onChange={(e) => setNewForm({ ...newForm, income: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
            <select
              value={newForm.gender}
              onChange={(e) => setNewForm({ ...newForm, gender: e.target.value })}
              className="px-3 py-2 rounded-xl border font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <label className="flex items-start gap-2.5 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              required
              checked={newForm.consent}
              onChange={(e) => setNewForm({ ...newForm, consent: e.target.checked })}
              className="mt-0.5"
            />
            <span>{t.csc.consentLabel}</span>
          </label>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
          >
            Register &amp; Start Assisted Session
          </button>
        </form>
      )}

      {/* Dual-Pane CSC Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Citizen Search & Active Assisted Citizen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bento-card p-4 space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
              1. Select Citizen Profile
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--gc-muted)" }} />
              <input
                value={citizenQuery}
                onChange={(e) => setCitizenQuery(e.target.value)}
                placeholder="Search by name, mobile, village..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredCitizens.map((c) => {
                const selected = cscCitizen?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCscCitizenId(c.id)}
                    className="w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2 transition"
                    style={
                      selected
                        ? {
                            backgroundColor: "var(--gc-surface-soft)",
                            borderColor: "var(--gc-primary)"
                          }
                        : {
                            backgroundColor: "var(--gc-bg)",
                            borderColor: "var(--gc-border)"
                          }
                    }
                  >
                    <div>
                      <div className="font-extrabold text-sm">{c.name}</div>
                      <div className="text-xs" style={{ color: "var(--gc-muted)" }}>
                        {c.occupation} • {c.village}, {c.district} • {c.mobile}
                      </div>
                    </div>
                    {selected && <UserCheck className="w-4 h-4 shrink-0" style={{ color: "var(--gc-primary)" }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {cscCitizen && (
            <div className="bento-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase" style={{ color: "var(--gc-primary)" }}>
                  {t.csc.activeCitizen}
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  Consent Verified
                </span>
              </div>
              <div className="text-sm font-extrabold">{cscCitizen.name}</div>
              <div className="text-xs" style={{ color: "var(--gc-muted)" }}>
                Age {cscCitizen.age} • {cscCitizen.gender} • {cscCitizen.occupation} • ₹
                {Number(cscCitizen.income).toLocaleString("en-IN")}/yr
              </div>

              <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--gc-border)" }}>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--gc-muted)" }}>
                  <History className="w-3.5 h-3.5" />
                  <span>Assisted Service History</span>
                </div>
                {activeLogs.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
                    No assisted actions logged yet for this citizen.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {activeLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2 rounded-lg text-xs" style={{ backgroundColor: "var(--gc-bg)" }}>
                        <div className="font-semibold">{log.action}</div>
                        <div style={{ color: "var(--gc-muted)" }}>
                          {log.date} • {log.operatorName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Assisted Scheme Discovery & Preparation */}
        <div className="lg:col-span-7 bento-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: "var(--gc-muted)" }}>
                2. Assist Citizen With Verified Schemes
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--gc-muted)" }}>
                Run rule eligibility checks, prepare documents, and log reference numbers on behalf of{" "}
                <strong>{cscCitizen?.name}</strong>.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--gc-muted)" }} />
            <input
              value={schemeQuery}
              onChange={(e) => setSchemeQuery(e.target.value)}
              placeholder="Search verified schemes for citizen..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedSchemes.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl border flex flex-col justify-between gap-3"
                style={{ backgroundColor: "var(--gc-bg)", borderColor: "var(--gc-border)" }}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold" style={{ color: "var(--gc-primary)" }}>
                      {sch.category}
                    </span>
                    <span style={{ color: "var(--gc-muted)" }}>{sch.code}</span>
                  </div>
                  <h3 className="font-extrabold text-sm">{sch.title[state.lang] || sch.title.en}</h3>
                  <p className="text-xs line-clamp-2" style={{ color: "var(--gc-muted)" }}>
                    {sch.benefits[state.lang] || sch.benefits.en}
                  </p>
                </div>

                <button
                  onClick={() => setAssistedSchemeId(sch.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: "var(--gc-accent)", color: "var(--gc-accent-fg)" }}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Assist: Check &amp; Prepare Docs</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {assistedSchemeId && (
        <SchemeDetailModal
          schemeId={assistedSchemeId}
          citizenOverride={cscCitizen}
          performedBy={operatorName}
          onClose={() => setAssistedSchemeId(null)}
        />
      )}
    </div>
  );
}
