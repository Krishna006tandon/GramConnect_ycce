export const seedCitizens = [
  {
    id: "cit-ramesh",
    name: "Ramesh Patil",
    mobile: "9823011223",
    email: "",
    state: "Maharashtra",
    district: "Wardha",
    village: "Seloo",
    age: 54,
    occupation: "Farmer",
    income: 95000,
    gender: "Male",
    category: "OBC",
    consentRecorded: true,
    registeredBy: "Self",
    createdAt: "2026-11-01"
  },
  {
    id: "cit-sunita",
    name: "Sunita Deshmukh",
    mobile: "9765422110",
    email: "",
    state: "Maharashtra",
    district: "Amravati",
    village: "Morshi",
    age: 34,
    occupation: "Self-Employed",
    income: 120000,
    gender: "Female",
    category: "General",
    consentRecorded: true,
    registeredBy: "CSC Operator (Seloo Kendra)",
    createdAt: "2026-11-03"
  },
  {
    id: "cit-bandu",
    name: "Bandu Shinde",
    mobile: "9822944551",
    email: "",
    state: "Maharashtra",
    district: "Nagpur",
    village: "Hasanbagh Urban Slum",
    age: 42,
    occupation: "Daily-Wage Worker",
    income: 80000,
    gender: "Male",
    category: "SC",
    consentRecorded: true,
    registeredBy: "Nagpur Slum NGO Camp",
    createdAt: "2026-11-04"
  },
  {
    id: "cit-parvati",
    name: "Parvatibai Gaikwad",
    mobile: "9970188992",
    email: "",
    state: "Maharashtra",
    district: "Nagpur",
    village: "Katol",
    age: 68,
    occupation: "Senior Citizen",
    income: 45000,
    gender: "Female",
    category: "OBC",
    consentRecorded: true,
    registeredBy: "Aaple Sarkar Seva Kendra (Katol)",
    createdAt: "2026-11-04"
  },
  {
    id: "cit-ajay",
    name: "Ajay Kamble",
    mobile: "9422188334",
    email: "ajay.k@example.in",
    state: "Maharashtra",
    district: "Nagpur",
    village: "Hingna",
    age: 20,
    occupation: "Student",
    income: 145000,
    gender: "Male",
    category: "SC",
    consentRecorded: true,
    registeredBy: "Self",
    createdAt: "2026-11-05"
  }
];

export const seedSavedSchemes = {
  "cit-ramesh": ["pm-kisan", "pmay-g", "namo-shetkari-mh"],
  "cit-sunita": ["majhi-ladki-bahin-mh", "pm-jay"],
  "cit-bandu": ["mgnrega", "pmay-g", "pm-jay"],
  "cit-parvati": ["nsap-pension", "pm-jay"]
};

export const seedDocReadiness = {
  "cit-ramesh": {
    "pm-kisan": {
      "doc-id": "ready",
      "doc-land": "needs_verification",
      "doc-bank": "ready",
      "doc-mobile": "ready",
      "doc-consent": "not_prepared"
    },
    "pmay-g": {
      "pmay-id": "ready",
      "pmay-bank": "ready",
      "pmay-household": "ready",
      "pmay-gram": "needs_verification",
      "pmay-land": "not_prepared"
    }
  },
  "cit-bandu": {
    "mgnrega": {
      "mgnrega-id": "ready",
      "mgnrega-bank": "ready",
      "mgnrega-photo": "ready"
    },
    "pmay-g": {
      "pmay-id": "ready",
      "pmay-bank": "ready",
      "pmay-household": "needs_verification",
      "pmay-land": "not_prepared"
    }
  },
  "cit-parvati": {
    "nsap-pension": {
      "nsap-id": "ready",
      "nsap-age": "ready",
      "nsap-bpl": "needs_verification",
      "nsap-bank": "ready"
    }
  }
};

export const seedAssessments = [
  {
    id: "asmt-1",
    citizenId: "cit-ramesh",
    schemeId: "pm-kisan",
    outcome: "needs_verification",
    performedBy: "Self",
    date: "2026-11-08",
    answers: {
      pk_occ: "Farmer",
      pk_land: "yes",
      pk_excl: "unsure",
      pk_ekyc: "yes"
    }
  },
  {
    id: "asmt-2",
    citizenId: "cit-bandu",
    schemeId: "mgnrega",
    outcome: "eligible",
    performedBy: "Nagpur Slum NGO Camp",
    date: "2026-11-09",
    answers: {
      mg_area: "Rural / Peri-Urban",
      mg_work: "yes",
      mg_age: "yes"
    }
  }
];

export const seedApplications = [
  {
    id: "app-1",
    citizenId: "cit-ramesh",
    schemeId: "pm-kisan",
    referenceNo: "PMK-MH-WRD-2026-4108",
    status: "Documents ready",
    notes: "7/12 extract verification pending at Talathi office",
    assistedBy: "Self",
    updatedAt: "2026-11-10"
  },
  {
    id: "app-2",
    citizenId: "cit-bandu",
    schemeId: "pmay-g",
    referenceNo: "PMAY-MH-NGP-2026-8821",
    status: "Application submitted",
    notes: "Waiting for Gram Sabha / Ward committee approval in Nagpur",
    assistedBy: "Nagpur Slum NGO Camp",
    updatedAt: "2026-11-12"
  }
];

export const seedAssistanceLogs = [
  {
    id: "csc-log-1",
    citizenId: "cit-sunita",
    operatorName: "Vikas Joshi (CSC Seloo)",
    action: "Profile registered with citizen consent & PM-JAY eligibility checked",
    date: "2026-11-03"
  },
  {
    id: "csc-log-2",
    citizenId: "cit-bandu",
    operatorName: "Nagpur Slum Sahayata Samiti",
    action: "Assisted Bandu Shinde with MGNREGA Job Card & PMAY-G document checklist",
    date: "2026-11-04"
  }
];
