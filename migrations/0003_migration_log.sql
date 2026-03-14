CREATE TABLE IF NOT EXISTS "migration_log" (
  "id" serial PRIMARY KEY NOT NULL,
  "idx" integer NOT NULL,
  "tag" text NOT NULL,
  "hash" text NOT NULL,
  "applied_at" timestamp NOT NULL,
  CONSTRAINT "migration_log_idx_unique" UNIQUE("idx"),
  CONSTRAINT "migration_log_tag_unique" UNIQUE("tag"),
  CONSTRAINT "migration_log_hash_unique" UNIQUE("hash")
);

-- Backfill existing migrations from __drizzle_migrations joined with known journal data
INSERT INTO "migration_log" ("idx", "tag", "hash", "applied_at")
SELECT
  (m.id - 1) AS idx,
  j.tag,
  m.hash,
  to_timestamp(m.created_at / 1000.0)
FROM __drizzle_migrations m
JOIN (VALUES
  (0, '0000_oval_mystique'),
  (1, '0001_lesson_stats_view'),
  (2, '0002_testing_table'),
  (3, '0003_migration_log')
) AS j(idx, tag) ON (m.id - 1) = j.idx
ON CONFLICT DO NOTHING;
