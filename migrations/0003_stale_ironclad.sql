CREATE TABLE "glossary" (
	"id" serial PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"arabic_term" text NOT NULL,
	"transliteration" text NOT NULL,
	"definition" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."lesson_stats" AS (
  SELECT
    l.category,
    l.level,
    COUNT(DISTINCT l.id)::int AS lesson_count,
    COUNT(e.id)::int          AS exercise_count,
    NOW()                     AS last_refreshed
  FROM lessons l
  LEFT JOIN exercises e ON e.lesson_id = l.id
  GROUP BY l.category, l.level
);