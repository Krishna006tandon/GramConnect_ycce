import crypto from "node:crypto";

function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.map(clean).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n|;|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeUrl(value) {
  const url = clean(value);
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function toSlug(text) {
  return clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function normalizeScheme(record, config) {
  const fields = config.fields || {};
  const get = (key) => (fields[key] ? clean(record[fields[key]]) : "");

  const name = get("name");
  if (!name) return null;

  const department = get("department") || "Government Department";
  const externalId =
    clean(record.id) ||
    clean(record._id) ||
    crypto
      .createHash("sha256")
      .update(`${config.resourceId}:${name}:${department}`)
      .digest("hex");

  const slug = toSlug(name) || externalId.slice(0, 12);
  const schemeKey = `dg-${config.resourceId.slice(0, 8)}-${externalId.slice(0, 12)}`;

  const description = get("description") || "Imported from Open Government Data (data.gov.in).";
  const category = get("category") || "Other";
  const jurisdiction = config.jurisdiction || "Other";
  const state = config.state || get("state") || (jurisdiction === "Central" ? "All India" : "All India");

  const benefitsList = toArray(record[fields.benefits]);
  const eligibilityList = toArray(record[fields.eligibility]);
  const docsList = toArray(record[fields.documents]);

  const applicationUrl = normalizeUrl(get("applicationUrl"));
  const officialSource = normalizeUrl(get("officialSource")) || applicationUrl || "https://www.data.gov.in/";

  let portalName = "data.gov.in";
  try {
    portalName = new URL(officialSource).hostname.replace(/^www\./, "");
  } catch {
    portalName = "data.gov.in";
  }

  const benefitsSummary = benefitsList.length
    ? benefitsList.join(" • ")
    : "Refer to official scheme guidelines for complete benefit details.";
  const eligibilityText = eligibilityList.length
    ? eligibilityList.join(" • ")
    : "Eligibility details unavailable in source dataset — verify on official portal.";

  const today = new Date().toISOString().slice(0, 10);

  return {
    schemeKey,
    externalId,
    resourceId: config.resourceId,
    code: slug.toUpperCase().slice(0, 12),
    name,
    slug,
    description,
    category,
    jurisdiction,
    state,
    targetBeneficiaries: "Eligible Citizens",
    department,
    benefits: benefitsList,
    eligibility: eligibilityList,
    documents: docsList,
    applicationUrl,
    officialSource,
    title: { en: name, hi: name, mr: name },
    shortDesc: { en: description, hi: description, mr: description },
    benefitsLocalized: { en: benefitsSummary, hi: benefitsSummary, mr: benefitsSummary },
    eligibilitySummary: { en: eligibilityText, hi: eligibilityText, mr: eligibilityText },
    documentItems: (docsList.length ? docsList : ["Official Identity Proof (where required)"]).map((d, idx) => ({
      id: `${schemeKey}-doc-${idx + 1}`,
      name: d
    })),
    applicationGuide: {
      method: "Official Government Portal / Authorized CSC",
      portalName,
      helpline: "1800-11-0001",
      steps: [
        "Review eligibility criteria against official scheme guidelines.",
        "Prepare required documents in the checklist.",
        "Visit the official government portal or nearest CSC centre to apply."
      ]
    },
    verificationStatus: "Needs Review",
    lastSyncedAt: new Date(),
    lastVerified: today,
    isActive: true
  };
}
