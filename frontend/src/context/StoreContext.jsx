import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations";
import { seedSchemes } from "../data/seedSchemes";
import {
  seedCitizens,
  seedSavedSchemes,
  seedDocReadiness,
  seedAssessments,
  seedApplications,
  seedAssistanceLogs
} from "../data/seedCitizens";

const STORAGE_KEY = "gramconnect_ycce_v1";

const StoreContext = createContext(null);

async function apiRequest(url, options = {}) {
  const { headers = {}, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers: { "Content-Type": "application/json", ...headers }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 207) {
    throw new Error(data.message || data.error || `API ${res.status}`);
  }
  return data;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback to seed state if storage is unavailable
  }
  return {
    schemes: seedSchemes,
    citizens: seedCitizens,
    activeCitizenId: "cit-ramesh",
    cscCitizenId: "cit-ramesh",
    savedSchemes: seedSavedSchemes,
    docReadiness: seedDocReadiness,
    assessments: seedAssessments,
    applications: seedApplications,
    assistanceLogs: seedAssistanceLogs,
    lang: "en",
    theme: "light"
  };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadInitialState);
  const [panel, setPanel] = useState("citizen"); // citizen | csc | admin
  const [citizenView, setCitizenView] = useState("home"); // home | discover | profile | howItWorks
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);

  // Hydrate from SQLite backend on startup
  useEffect(() => {
    let active = true;
    apiRequest("/api/bootstrap")
      .then((data) => {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          schemes: data.schemes?.length ? data.schemes : prev.schemes,
          citizens: data.citizens?.length ? data.citizens : prev.citizens,
          savedSchemes: data.savedSchemes || prev.savedSchemes,
          docReadiness: data.docReadiness || prev.docReadiness,
          assessments: data.assessments || prev.assessments,
          applications: data.applications || prev.applications,
          assistanceLogs: data.assistanceLogs || prev.assistanceLogs
        }));
        setApiConnected(true);
      })
      .catch(() => {
        if (active) setApiConnected(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [state.theme]);

  const t = translations[state.lang] || translations.en;
  const activeCitizen =
    state.citizens.find((c) => c.id === state.activeCitizenId) || state.citizens[0] || null;
  const cscCitizen =
    state.citizens.find((c) => c.id === state.cscCitizenId) || state.citizens[0] || null;

  const setLang = (lang) => setState((prev) => ({ ...prev, lang }));
  const setTheme = (theme) => setState((prev) => ({ ...prev, theme }));
  const setActiveCitizenId = (id) => setState((prev) => ({ ...prev, activeCitizenId: id }));
  const setCscCitizenId = (id) => setState((prev) => ({ ...prev, cscCitizenId: id }));

  const upsertCitizen = (citizenData, { activateFor = "citizen" } = {}) => {
    const id = citizenData.id || `cit-${Date.now()}`;
    const record = {
      ...citizenData,
      id,
      age: Number(citizenData.age) || 0,
      income: Number(citizenData.income) || 0,
      createdAt: citizenData.createdAt || new Date().toISOString().slice(0, 10)
    };
    const isUpdate = state.citizens.some((c) => c.id === id);

    setState((prev) => {
      const exists = prev.citizens.some((c) => c.id === id);
      const citizens = exists
        ? prev.citizens.map((c) => (c.id === id ? record : c))
        : [record, ...prev.citizens];
      return {
        ...prev,
        citizens,
        activeCitizenId: activateFor === "citizen" ? id : prev.activeCitizenId,
        cscCitizenId: activateFor === "csc" ? id : prev.cscCitizenId
      };
    });

    apiRequest(isUpdate ? `/api/citizens/${id}` : "/api/citizens", {
      method: isUpdate ? "PUT" : "POST",
      body: JSON.stringify(record)
    })
      .then(() => setApiConnected(true))
      .catch(() => {});

    return record;
  };

  const toggleSaveScheme = (citizenId, schemeId) => {
    if (!citizenId) return;
    setState((prev) => {
      const current = prev.savedSchemes[citizenId] || [];
      const next = current.includes(schemeId)
        ? current.filter((id) => id !== schemeId)
        : [...current, schemeId];
      return {
        ...prev,
        savedSchemes: { ...prev.savedSchemes, [citizenId]: next }
      };
    });

    apiRequest(`/api/citizens/${citizenId}/saved-schemes/toggle`, {
      method: "POST",
      body: JSON.stringify({ schemeId })
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const recordAssessment = (citizenId, schemeId, outcome, answers, performedBy = "Self") => {
    const newEntry = {
      id: `asmt-${Date.now()}`,
      citizenId: citizenId || "guest",
      schemeId,
      outcome,
      answers,
      performedBy,
      date: new Date().toISOString().slice(0, 10)
    };
    setState((prev) => ({
      ...prev,
      assessments: [newEntry, ...prev.assessments]
    }));

    apiRequest("/api/assessments", {
      method: "POST",
      body: JSON.stringify(newEntry)
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const updateDocStatus = (citizenId, schemeId, docId, status) => {
    if (!citizenId) return;
    setState((prev) => {
      const citDocs = prev.docReadiness[citizenId] || {};
      const schemeDocs = citDocs[schemeId] || {};
      return {
        ...prev,
        docReadiness: {
          ...prev.docReadiness,
          [citizenId]: {
            ...citDocs,
            [schemeId]: {
              ...schemeDocs,
              [docId]: status
            }
          }
        }
      };
    });

    apiRequest(`/api/citizens/${citizenId}/documents`, {
      method: "PUT",
      body: JSON.stringify({ schemeId, docId, status })
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const upsertApplication = (record) => {
    const id = record.id || `app-${Date.now()}`;
    const entry = {
      ...record,
      id,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setState((prev) => {
      const exists = prev.applications.some((a) => a.id === id);
      const applications = exists
        ? prev.applications.map((a) => (a.id === id ? entry : a))
        : [entry, ...prev.applications];
      return { ...prev, applications };
    });

    apiRequest("/api/applications", {
      method: "POST",
      body: JSON.stringify(entry)
    })
      .then(() => setApiConnected(true))
      .catch(() => {});

    return entry;
  };

  const upsertScheme = (schemeData) => {
    const id = schemeData.id || `sch-${Date.now()}`;
    const entry = {
      ...schemeData,
      id,
      lastVerified: schemeData.lastVerified || new Date().toISOString().slice(0, 10)
    };
    const isUpdate = state.schemes.some((s) => s.id === id);

    setState((prev) => {
      const exists = prev.schemes.some((s) => s.id === id);
      const schemes = exists
        ? prev.schemes.map((s) => (s.id === id ? entry : s))
        : [entry, ...prev.schemes];
      return { ...prev, schemes };
    });

    apiRequest(isUpdate ? `/api/schemes/${id}` : "/api/schemes", {
      method: isUpdate ? "PUT" : "POST",
      body: JSON.stringify(entry)
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const updateSchemeVerification = (schemeId, verificationStatus) => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => ({
      ...prev,
      schemes: prev.schemes.map((s) =>
        s.id === schemeId
          ? {
              ...s,
              verificationStatus,
              lastVerified: verificationStatus === "Verified" ? today : s.lastVerified
            }
          : s
      )
    }));

    apiRequest(`/api/schemes/${schemeId}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ verificationStatus })
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const deleteScheme = (schemeId) => {
    setState((prev) => ({
      ...prev,
      schemes: prev.schemes.filter((s) => s.id !== schemeId)
    }));

    apiRequest(`/api/schemes/${schemeId}`, {
      method: "DELETE"
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const logAssistance = (citizenId, operatorName, action) => {
    const entry = {
      id: `csc-log-${Date.now()}`,
      citizenId,
      operatorName,
      action,
      date: new Date().toISOString().slice(0, 10)
    };
    setState((prev) => ({
      ...prev,
      assistanceLogs: [entry, ...prev.assistanceLogs]
    }));

    apiRequest("/api/assistance-logs", {
      method: "POST",
      body: JSON.stringify(entry)
    })
      .then(() => setApiConnected(true))
      .catch(() => {});
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      schemes: seedSchemes,
      citizens: seedCitizens,
      activeCitizenId: "cit-ramesh",
      cscCitizenId: "cit-ramesh",
      savedSchemes: seedSavedSchemes,
      docReadiness: seedDocReadiness,
      assessments: seedAssessments,
      applications: seedApplications,
      assistanceLogs: seedAssistanceLogs,
      lang: state.lang,
      theme: state.theme
    });

    apiRequest("/api/reset-demo", { method: "POST" })
      .then((data) => {
        setState((prev) => ({
          ...prev,
          schemes: data.schemes,
          citizens: data.citizens,
          savedSchemes: data.savedSchemes,
          docReadiness: data.docReadiness,
          assessments: data.assessments,
          applications: data.applications,
          assistanceLogs: data.assistanceLogs
        }));
        setApiConnected(true);
      })
      .catch(() => {});
  };

  const refreshFromBackend = async () => {
    const data = await apiRequest("/api/bootstrap");
    setState((prev) => ({
      ...prev,
      schemes: data.schemes?.length ? data.schemes : prev.schemes,
      citizens: data.citizens?.length ? data.citizens : prev.citizens,
      savedSchemes: data.savedSchemes || prev.savedSchemes,
      docReadiness: data.docReadiness || prev.docReadiness,
      assessments: data.assessments || prev.assessments,
      applications: data.applications || prev.applications,
      assistanceLogs: data.assistanceLogs || prev.assistanceLogs
    }));
    setApiConnected(true);
  };

  const triggerExternalSync = async (adminSecret = "") => {
    const headers = adminSecret ? { "x-admin-secret": adminSecret } : {};
    const res = await apiRequest("/api/schemes/admin/sync", {
      method: "POST",
      headers
    });
    await refreshFromBackend();
    return res;
  };

  const fetchSyncHistory = async (adminSecret = "") => {
    const headers = adminSecret ? { "x-admin-secret": adminSecret } : {};
    const res = await apiRequest("/api/schemes/admin/sync-history", { headers });
    return res.data || [];
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        t,
        apiConnected,
        panel,
        setPanel,
        citizenView,
        setCitizenView,
        selectedSchemeId,
        setSelectedSchemeId,
        activeCitizen,
        cscCitizen,
        setLang,
        setTheme,
        setActiveCitizenId,
        setCscCitizenId,
        upsertCitizen,
        toggleSaveScheme,
        recordAssessment,
        updateDocStatus,
        upsertApplication,
        upsertScheme,
        updateSchemeVerification,
        deleteScheme,
        logAssistance,
        resetDemoData,
        triggerExternalSync,
        fetchSyncHistory
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
