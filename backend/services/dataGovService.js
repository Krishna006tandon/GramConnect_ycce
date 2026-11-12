import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDataset(resourceId, offset = 0, limit = 100, retries = 2) {
  const BASE_URL = process.env.DATA_GOV_BASE_URL || "https://api.data.gov.in/resource";
  const API_KEY = process.env.DATA_GOV_API_KEY;

  if (!API_KEY || API_KEY === "YOUR_DATA_GOV_API_KEY") {
    throw new Error("DATA_GOV_API_KEY is missing or still set to placeholder in .env");
  }
  if (!resourceId || resourceId.startsWith("RESOURCE_ID_")) {
    throw new Error("Valid data.gov.in Resource ID is required");
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(`${BASE_URL}/${encodeURIComponent(resourceId)}`, {
        params: {
          "api-key": API_KEY,
          format: "json",
          offset,
          limit
        },
        timeout: 15000
      });

      const data = response.data;
      if (!data || !Array.isArray(data.records)) {
        throw new Error("Unexpected API response. Check the resource ID and response format.");
      }

      return {
        records: data.records,
        total: Number(data.total) || data.records.length,
        count: Number(data.count) || data.records.length,
        offset: Number(data.offset) || offset
      };
    } catch (error) {
      const status = error.response?.status;
      if (status === 429 && attempt < retries) {
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      if (status === 403 || status === 401) {
        throw new Error("Government API key invalid, unauthorized or missing.");
      }
      if (status === 404) {
        throw new Error(`Government dataset resource "${resourceId}" not found.`);
      }
      if (status === 429) {
        throw new Error("Government API rate limit exceeded. Retry later.");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Government API request timed out.");
      }
      throw new Error(error.message || "Government API unavailable");
    }
  }
}
