import { pool } from "./db";
import { log } from "./logger";

async function refreshLessonStats() {
  const client = await pool.connect();
  try {
    await client.query("REFRESH MATERIALIZED VIEW CONCURRENTLY lesson_stats");
    log("lesson_stats refreshed", "scheduler");
  } catch (err) {
    log(`lesson_stats refresh failed: ${(err as Error).message}`, "scheduler");
  } finally {
    client.release();
  }
}

export async function startScheduler() {
  await refreshLessonStats();

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(refreshLessonStats, TWENTY_FOUR_HOURS);

  log("scheduler started — lesson_stats refreshes every 24 hours", "scheduler");
}
