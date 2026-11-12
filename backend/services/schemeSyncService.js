import Scheme from "../models/Scheme.js";
import SyncLog from "../models/SyncLog.js";
import { getActiveResourceConfigs } from "../config/dataGovConfig.js";
import { fetchDataset } from "./dataGovService.js";
import { normalizeScheme } from "./schemeNormalizer.js";

const PAGE_SIZE = 100;
const MAX_PAGES = 100;

let isSyncRunning = false;

export async function syncSchemes() {
  if (isSyncRunning) {
    throw new Error("A synchronization job is already in progress. Please wait.");
  }

  const configs = getActiveResourceConfigs();
  if (!configs.length) {
    const errMsg =
      "No verified data.gov.in Resource IDs configured. Set DATA_GOV_API_KEY and DATA_GOV_RESOURCE_IDS in backend/.env.";
    await SyncLog.create({
      resourceId: "unconfigured",
      sourceName: "Configuration Check",
      status: "failed",
      processed: 0,
      failed: 0,
      error: errMsg,
      startedAt: new Date(),
      completedAt: new Date()
    });
    return [
      {
        resourceId: "unconfigured",
        sourceName: "Configuration Check",
        status: "failed",
        processed: 0,
        failed: 0,
        error: errMsg
      }
    ];
  }

  isSyncRunning = true;
  const results = [];

  try {
    for (const config of configs) {
      const startedAt = new Date();
      let processed = 0;
      let failed = 0;
      let offset = 0;

      try {
        for (let page = 0; page < MAX_PAGES; page++) {
          const result = await fetchDataset(config.resourceId, offset, PAGE_SIZE);
          if (!result.records.length) break;

          const operations = [];
          for (const record of result.records) {
            try {
              const scheme = normalizeScheme(record, config);
              if (!scheme) {
                failed++;
                continue;
              }

              operations.push({
                updateOne: {
                  filter: { resourceId: scheme.resourceId, externalId: scheme.externalId },
                  update: {
                    $set: scheme,
                    $setOnInsert: { lastVerifiedAt: null }
                  },
                  upsert: true
                }
              });
              processed++;
            } catch {
              failed++;
            }
          }

          if (operations.length) {
            await Scheme.bulkWrite(operations, { ordered: false });
          }

          offset += result.records.length;
          if (result.records.length < PAGE_SIZE || offset >= result.total) {
            break;
          }
        }

        const log = await SyncLog.create({
          resourceId: config.resourceId,
          sourceName: config.sourceName || config.resourceId,
          status: "success",
          processed,
          failed,
          startedAt,
          completedAt: new Date()
        });
        results.push(log);
      } catch (error) {
        const log = await SyncLog.create({
          resourceId: config.resourceId,
          sourceName: config.sourceName || config.resourceId,
          status: "failed",
          processed,
          failed,
          error: error.message,
          startedAt,
          completedAt: new Date()
        });
        results.push(log);
      }
    }
  } finally {
    isSyncRunning = false;
  }

  return results;
}
