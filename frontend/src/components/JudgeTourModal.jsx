import { useState } from "react";
import {
  X,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Volume2,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass,
  FileCheck2,
  ExternalLink
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { speakText, stopSpeaking } from "../utils/voiceAssistant";

export function JudgeTourModal({ onClose, onOpenSms }) {
  const {
    state,
    setPanel,
    setCitizenView,
    setActiveCitizenId,
    setSelectedSchemeId,
    setLang,
    activeCitizen
  } = useStore();

  const [activeTab, setActiveTab] = useState("scenarios"); // scenarios | psChecklist | techSpecs
  const [speaking, setSpeaking] = useState(false);

  const personas = [
    {
      id: "cit-ramesh",
      name: "Ramesh Patil",
      badge: "Farmer (Wardha)",
      schemeId: "pm-kisan",
      schemeTitle: "PM-KISAN (₹6,000/yr)",
      tagline: "Tests Landholding Cultivator & 7/12 Rule Matching",
      icon: "🌾",
      color: "#059669"
    },
    {
      id: "cit-sunita",
      name: "Sunita Deshmukh",
      badge: "Woman (Amravati)",
      schemeId: "majhi-ladki-bahin-mh",
      schemeTitle: "Majhi Ladki Bahin (₹1,500/mo)",
      tagline: "Tests Maharashtra State Women Welfare Scheme",
      icon: "👩",
      color: "#db2777"
    },
    {
      id: "cit-bandu",
      name: "Bandu Shinde",
      badge: "Slum Worker (Nagpur)",
      schemeId: "mgnrega",
      schemeTitle: "MGNREGA / PMAY-G Housing",
      tagline: "Tests Urban Slum / Daily-Wage Labourer Eligibility",
      icon: "🔨",
      color: "#d97706"
    },
    {
      id: "cit-ajay",
      name: "Ajay Kamble",
      badge: "Student (Nagpur)",
      schemeId: "nsp-scholarship",
      schemeTitle: "NSP Post-Matric Scholarship",
      tagline: "Tests Youth / Student Academic Category Rule",
      icon: "🎓",
      color: "#4f46e5"
    }
  ];

  const handleRunPersona = (p) => {
    setActiveCitizenId(p.id);
    setPanel("citizen");
    setCitizenView("discover");
    setSelectedSchemeId(p.schemeId);
    onClose();
  };

  const handleTestVoice = (lang = "mr") => {
    setLang(lang);
    const sampleText =
      lang === "mr"
        ? "ग्रामकनेक्ट स्वागत आहे. पीएम-किसान योजनेसाठी पात्र शेतकरी कुटुंबांना दरवर्षी ६००० रुपयांची थेट आर्थिक मदत दिली जाते."
        : "ग्रामकनेक्ट में आपका स्वागत है। पीएम-किसान योजना के तहत पात्र किसान परिवारों को प्रति वर्ष ६००० रुपये की प्रत्यक्ष आर्थिक सहायता मिलती है।";

    setSpeaking(true);
    speakText(sampleText, lang, (isSpeaking) => {
      setSpeaking(isSpeaking);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className="w-full max-w-3xl rounded-3xl border shadow-2xl flex flex-col overflow-hidden my-auto"
        style={{ backgroundColor: "var(--gc-surface)", borderColor: "var(--gc-border)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-start justify-between gap-4"
          style={{ borderColor: "var(--gc-border)", backgroundColor: "var(--gc-surface-soft)" }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-sm"
                style={{ backgroundColor: "var(--gc-accent)", color: "var(--gc-accent-fg)" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>EVALUATOR &amp; JUDGE GUIDE</span>
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--gc-muted)" }}>
                HackKumbh 2026 (PS #5)
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Interactive Prototype Review Tour</h2>
            <p className="text-xs" style={{ color: "var(--gc-muted)" }}>
              Test all Problem Statement requirements in under 60 seconds using one-click automated scenarios.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border hover:opacity-80 shrink-0"
            style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div
          className="px-6 py-2.5 border-b flex flex-wrap gap-2"
          style={{ borderColor: "var(--gc-border)" }}
        >
          {[
            { id: "scenarios", label: "🎯 1-Click Persona Scenarios" },
            { id: "psChecklist", label: "📋 Problem Statement Checklist (100%)" },
            { id: "techSpecs", label: "⚙️ System Architecture & Sync" }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
              style={
                activeTab === tb.id
                  ? { backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }
                  : { backgroundColor: "var(--gc-bg)", color: "var(--gc-muted)" }
              }
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeTab === "scenarios" && (
            <div className="space-y-4">
              <div className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                Select any demographic persona below to test instant profile loading, rule engine evaluation, and document readiness in Vidarbha/Nagpur:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {personas.map((p) => (
                  <div
                    key={p.id}
                    className="bento-card p-4 flex flex-col justify-between gap-3 group transition border hover:shadow-md"
                    style={{ borderColor: "var(--gc-border)" }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${p.color}15`, color: p.color }}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm mt-2">{p.name}</h3>
                      <p className="text-xs font-bold mt-0.5" style={{ color: p.color }}>
                        {p.schemeTitle}
                      </p>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                        {p.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRunPersona(p)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition"
                      style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
                    >
                      <span>Test This Scenario</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Special PS Feature Testers */}
              <div className="bento-card p-4 space-y-3" style={{ backgroundColor: "var(--gc-surface-soft)" }}>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                  Test Special PS Accessibility &amp; Outreach Features
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Voice Assistant Test */}
                  <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 flex flex-col justify-between gap-2" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold">Voice Assistant</span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--gc-muted)" }}>
                      SpeechSynthesis in Marathi &amp; Hindi for low-literacy users.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => handleTestVoice("mr")}
                        className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border"
                        style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                      >
                        🔊 मराठी
                      </button>
                      <button
                        onClick={() => handleTestVoice("hi")}
                        className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border"
                        style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
                      >
                        🔊 हिंदी
                      </button>
                    </div>
                  </div>

                  {/* Real-Time SMS Test */}
                  <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 flex flex-col justify-between gap-2" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">Fast2SMS Dispatcher</span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--gc-muted)" }}>
                      Dispatches deadline alerts to mobile numbers &amp; phone preview.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSms();
                      }}
                      className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      📱 Open SMS Dispatcher
                    </button>
                  </div>

                  {/* CSC Operator Mode */}
                  <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 flex flex-col justify-between gap-2" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold">CSC Operator Desk</span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--gc-muted)" }}>
                      Assisted delivery mode for rural village kiosks.
                    </p>
                    <button
                      onClick={() => {
                        setPanel("csc");
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700"
                    >
                      🏢 Open CSC Desk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "psChecklist" && (
            <div className="space-y-3">
              <div className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>
                Verification scorecard against all 6 core features of Problem Statement #5:
              </div>

              {[
                {
                  req: "1. Simple eligibility questionnaire that recommends relevant central and state schemes.",
                  detail: "Built with deterministic AND/OR/NOT rule engine; pre-fills from profile; covers Central (PM-KISAN, PMAY-G, PM-JAY) & Maharashtra State (Namo Shetkari, Majhi Ladki Bahin).",
                  status: "100% Implemented"
                },
                {
                  req: "2. Support for Hindi and Marathi with voice-based and large-text options for low-literacy users.",
                  detail: "Full Trilingual dictionary (EN, HI, MR); Web Speech API voice synthesis for audio read-aloud; accessible Bento cards.",
                  status: "100% Implemented"
                },
                {
                  req: "3. Document checklist for each scheme with reminders for missing or expiring documents.",
                  detail: "Per-scheme document readiness ring (0-100%); states (Ready / Verification Required / Not Prepared); missing document alerts.",
                  status: "100% Implemented"
                },
                {
                  req: "4. Step-by-step application guide with links to official portals and nearby help centres.",
                  detail: "Clear numbered steps, direct official links with 1-click Copy Link, and nearby CSC/Seva Kendra locator for Vidarbha & Nagpur.",
                  status: "100% Implemented"
                },
                {
                  req: "5. Application status tracker with SMS reminders for deadlines and pending actions.",
                  detail: "Application status lifecycle tracking with reference numbers + Fast2SMS real-time cellular and smartphone notification preview.",
                  status: "100% Implemented"
                },
                {
                  req: "6. Admin dashboard for NGOs and local bodies to view scheme uptake and identify under-served areas.",
                  detail: "Admin management portal + live Open Government Data (data.gov.in) dataset synchronization pipeline with MongoDB storage.",
                  status: "100% Implemented"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bento-card p-3.5 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <div className="font-extrabold">{item.req}</div>
                    <div style={{ color: "var(--gc-muted)" }}>{item.detail}</div>
                    <span className="inline-block mt-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "techSpecs" && (
            <div className="space-y-4">
              <div className="bento-card p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-primary)" }}>
                  Production Architecture Stack
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="font-bold">Frontend</div>
                    <div className="text-[11px] text-slate-500">React 19 + Vite 6</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="font-bold">Styling</div>
                    <div className="text-[11px] text-slate-500">Tailwind CSS v4</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="font-bold">Backend</div>
                    <div className="text-[11px] text-slate-500">Node.js + Express 5</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--gc-border)" }}>
                    <div className="font-bold">Database</div>
                    <div className="text-[11px] text-slate-500">MongoDB + Mongoose 8</div>
                  </div>
                </div>
              </div>

              <div className="bento-card p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gc-accent)" }}>
                  Live data.gov.in Integration Pipeline
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                  Our Node.js integration service automatically queries Open Government Data (OGD) Platform India, extracts raw records, normalizes disparate central/state schemas into standard Mongoose models, and uses in-memory TTL caching to protect against rate limits.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setPanel("admin");
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: "var(--gc-primary)" }}
                  >
                    <span>Inspect Admin Sync Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
