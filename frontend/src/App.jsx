import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { HomeBento } from "./components/HomeBento";
import { SchemeDirectory } from "./components/SchemeDirectory";
import { CitizenProfileView } from "./components/CitizenProfileView";
import { HowItWorksView } from "./components/HowItWorksView";
import { AdminPanel } from "./components/AdminPanel";
import { CscPanel } from "./components/CscPanel";
import { SchemeDetailModal } from "./components/SchemeDetailModal";
import { JudgeTourModal } from "./components/JudgeTourModal";
import { SmsAlertModal } from "./components/SmsAlertModal";

function GramConnectShell() {
  const {
    t,
    apiConnected,
    panel,
    citizenView,
    selectedSchemeId,
    setSelectedSchemeId
  } = useStore();

  const [directoryCategory, setDirectoryCategory] = useState("All");
  const [showJudgeTour, setShowJudgeTour] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
  }, [largeText]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onOpenJudgeTour={() => setShowJudgeTour(true)}
        onOpenSms={() => setShowSmsModal(true)}
        largeText={largeText}
        onToggleLargeText={() => setLargeText((prev) => !prev)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {panel === "citizen" && (
          <>
            {citizenView === "home" && (
              <HomeBento onSelectCategory={(cat) => setDirectoryCategory(cat)} />
            )}
            {citizenView === "discover" && (
              <SchemeDirectory
                initialCategory={directoryCategory}
                onCategoryChange={setDirectoryCategory}
              />
            )}
            {citizenView === "profile" && <CitizenProfileView />}
            {citizenView === "howItWorks" && <HowItWorksView />}
          </>
        )}

        {panel === "csc" && <CscPanel />}
        {panel === "admin" && <AdminPanel />}
      </main>

      <footer
        className="border-t py-5 px-4 text-xs"
        style={{ borderColor: "var(--gc-border)", color: "var(--gc-muted)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <strong style={{ color: "var(--gc-text)" }}>{t.brand}</strong> — {t.tagline}
            <span
              className="px-2 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: "var(--gc-surface-soft)",
                color: apiConnected ? "var(--gc-primary)" : "var(--gc-accent)"
              }}
            >
              {apiConnected ? "● MongoDB Backend Connected" : "○ Local Cache Mode"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJudgeTour(true)}
              className="font-bold underline text-xs"
              style={{ color: "var(--gc-accent)" }}
            >
              🎯 Open Judge Guide
            </button>
            <span>• HackKumbh 2026 Prototype</span>
          </div>
        </div>
      </footer>

      {selectedSchemeId && (
        <SchemeDetailModal
          schemeId={selectedSchemeId}
          onClose={() => setSelectedSchemeId(null)}
        />
      )}

      {showJudgeTour && (
        <JudgeTourModal
          onClose={() => setShowJudgeTour(false)}
          onOpenSms={() => {
            setShowJudgeTour(false);
            setShowSmsModal(true);
          }}
        />
      )}

      {showSmsModal && (
        <SmsAlertModal
          onClose={() => setShowSmsModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <GramConnectShell />
    </StoreProvider>
  );
}
