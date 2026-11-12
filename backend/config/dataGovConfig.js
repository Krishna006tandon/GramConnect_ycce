export const resourceConfigs = [
  {
    resourceId: process.env.DATA_GOV_RESOURCE_ID_1 || "RESOURCE_ID_1",
    sourceName: "Central Government Dataset",
    jurisdiction: "Central",
    state: null,
    fields: {
      name: "scheme_name",
      description: "description",
      category: "category",
      department: "ministry",
      state: "state",
      benefits: "benefits",
      eligibility: "eligibility",
      documents: "documents",
      applicationUrl: "application_url",
      officialSource: "official_source"
    }
  },
  {
    resourceId: process.env.DATA_GOV_RESOURCE_ID_2 || "RESOURCE_ID_2",
    sourceName: "Maharashtra Government Dataset",
    jurisdiction: "State",
    state: "Maharashtra",
    fields: {
      name: "scheme_title",
      description: "scheme_description",
      category: "scheme_category",
      department: "department_name",
      state: "state_name",
      benefits: "scheme_benefits",
      eligibility: "eligibility_criteria",
      documents: "required_documents",
      applicationUrl: "application_link",
      officialSource: "source_url"
    }
  }
];

export function getActiveResourceConfigs() {
  const envIds = (process.env.DATA_GOV_RESOURCE_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("RESOURCE_ID_"));

  if (!envIds.length) {
    return resourceConfigs.filter((c) => c.resourceId && !c.resourceId.startsWith("RESOURCE_ID_"));
  }

  // Merge configured field maps with any resource IDs listed in DATA_GOV_RESOURCE_IDS
  return envIds.map((rid, idx) => {
    const match = resourceConfigs.find((c) => c.resourceId === rid);
    if (match) return match;
    const fallbackTemplate = resourceConfigs[idx] || resourceConfigs[0];
    return {
      ...fallbackTemplate,
      resourceId: rid,
      sourceName: `data.gov.in Resource (${rid})`
    };
  });
}
