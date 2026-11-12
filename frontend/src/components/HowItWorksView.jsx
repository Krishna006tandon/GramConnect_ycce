import { ShieldCheck, Lock, Scale, Globe2, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

export function HowItWorksView() {
  const { setCitizenView, setActiveCitizenId, setSelectedSchemeId } = useStore();

  const pillars = [
    {
      icon: Scale,
      title: "Rule-Based Eligibility (No Black-Box AI)",
      desc: "Every scheme uses transparent configurable AND / OR / NOT rules. Missing answers show 'Needs more information' and edge cases flag manual verification."
    },
    {
      icon: Lock,
      title: "Privacy-First Document Readiness",
      desc: "Citizens track document status (Not Prepared / Ready / Needs Verification) locally without uploading Aadhaar numbers, bank credentials, or sensitive scans."
    },
    {
      icon: ShieldCheck,
      title: "Admin Verification & Official Sources",
      desc: "Every scheme displays its official government portal link and last-verified date. Draft or unreviewed schemes remain hidden until an Admin verifies them."
    },
    {
      icon: Globe2,
      title: "Multilingual & CSC Assisted Delivery",
      desc: "Switch cleanly between English, हिंदी, and मराठी, or use the CSC Assistant Desk to guide citizens who prefer in-person assistance."
    }
  ];

  const faqs = [
    {
      q: "Does GramConnect submit government applications directly?",
      a: "No. GramConnect guides citizens through eligibility checks, document readiness, and step-by-step instructions, then links directly to the official government portal."
    },
    {
      q: "Is an indicative eligibility result a guarantee of approval?",
      a: "No. Eligibility assessments are indicative based on configured rules and citizen-entered inputs. Final eligibility is always determined by the competent government authority."
    },
    {
      q: "How are application statuses tracked?",
      a: "Citizens or CSC operators manually save external application reference IDs and update preparation statuses. Official live statuses are only checked on authorized government portals."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bento-card p-6 md:p-8 space-y-3">
        <h1 className="text-2xl font-extrabold">About GramConnect &amp; How It Works</h1>
        <p className="text-sm max-w-3xl leading-relaxed" style={{ color: "var(--gc-muted)" }}>
          GramConnect is not just a government scheme listing directory. It bridges the gap between knowing a scheme exists and being ready to apply — from discovery and rule-based eligibility to document readiness and application tracking.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => {
              setActiveCitizenId("cit-ramesh");
              setSelectedSchemeId("pm-kisan");
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "var(--gc-primary)", color: "var(--gc-primary-fg)" }}
          >
            <span>Try Ramesh Patil (PM-KISAN) Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCitizenView("discover")}
            className="px-4 py-2.5 rounded-xl border text-xs font-bold"
            style={{ borderColor: "var(--gc-border)", color: "var(--gc-text)" }}
          >
            Browse All Schemes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="bento-card p-5 space-y-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--gc-surface-soft)", color: "var(--gc-primary)" }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base">{p.title}</h2>
              <p className="text-xs leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bento-card p-6 space-y-4">
        <h2 className="text-base font-extrabold">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="p-4 rounded-2xl" style={{ backgroundColor: "var(--gc-bg)" }}>
              <h3 className="font-bold text-sm">{f.q}</h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--gc-muted)" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
