/**
 * Marks migrations as already applied in the __drizzle_migrations table
 * without running them. Use this when the DB already has the schema but
 * drizzle's tracking table is empty (e.g. local dev setup).
 *
 * Usage: npm run db:mark-migrations -- --until <tag>
 * Example: npm run db:mark-migrations -- --until 0001_lesson_stats_view
 */
import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function markMigrations() {
  const untilIndex = process.argv.indexOf("--until");
  const untilTag = untilIndex !== -1 ? process.argv[untilIndex + 1] : null;

  const migrationsDir = path.resolve("migrations");
  const journal = JSON.parse(
    fs.readFileSync(path.join(migrationsDir, "meta", "_journal.json"), "utf8")
  );

  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at BIGINT
      )
    `);

    const { rows: applied } = await client.query(
      `SELECT hash FROM "drizzle"."__drizzle_migrations"`
    );
    const appliedHashes = new Set(applied.map((r: { hash: string }) => r.hash));

    for (const entry of journal.entries) {
      if (untilTag && entry.tag === untilTag) {
        // Mark this one then stop
        await markEntry(client, migrationsDir, entry, appliedHashes);
        break;
      }
      await markEntry(client, migrationsDir, entry, appliedHashes);
      if (!untilTag && entry.tag === journal.entries[journal.entries.length - 1].tag) {
        break;
      }
    }

    console.log("Done. You can now run: npx drizzle-kit migrate");
  } finally {
    client.release();
    await pool.end();
  }
}

async function markEntry(
  client: pg.PoolClient,
  migrationsDir: string,
  entry: { tag: string; when: number },
  appliedHashes: Set<string>
) {
  const filePath = path.join(migrationsDir, `${entry.tag}.sql`);
  const sql = fs.readFileSync(filePath, "utf8");
  const hash = crypto.createHash("sha256").update(sql).digest("hex");

  if (appliedHashes.has(hash)) {
    console.log(`Already marked: ${entry.tag}`);
    return;
  }

  await client.query(
    `INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
    [hash, entry.when]
  );
  console.log(`Marked as applied: ${entry.tag}`);
}

markMigrations().catch(console.error);
