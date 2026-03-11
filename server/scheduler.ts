import cron from "node-cron";
import { pool } from "./db";
import { log } from "./logger";

async function ensureLessonStatsView() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS lesson_stats AS
      SELECT
        l.category,
        l.level,
        COUNT(DISTINCT l.id)  AS lesson_count,
        COUNT(e.id)           AS exercise_count,
        NOW()                 AS last_refreshed
      FROM lessons l
      LEFT JOIN exercises e ON e.lesson_id = l.id
      GROUP BY l.category, l.level
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS lesson_stats_category_level_idx
        ON lesson_stats (category, level)
    `);
    log("lesson_stats view ready", "scheduler");
  } catch (err) {
    log(`lesson_stats setup failed: ${(err as Error).message}`, "scheduler");
  } finally {
    client.release();
  }
}

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
  await ensureLessonStatsView();

  // Refresh immediately on startup so data is never stale after a deploy
  await refreshLessonStats();

  // Then refresh every day at midnight UTC
  cron.schedule("0 0 * * *", refreshLessonStats, { timezone: "UTC" });

  log("scheduler started — lesson_stats refreshes daily at 00:00 UTC", "scheduler");
}
