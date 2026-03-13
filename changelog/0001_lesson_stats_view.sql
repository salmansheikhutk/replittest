--liquibase formatted sql

-- Migration: 0001_lesson_stats_view
-- Creates: lesson_stats materialized view with unique index

--changeset system:0001_lesson_stats_view
CREATE MATERIALIZED VIEW IF NOT EXISTS lesson_stats AS
SELECT
  l.category,
  l.level,
  COUNT(DISTINCT l.id)  AS lesson_count,
  COUNT(e.id)           AS exercise_count,
  NOW()                 AS last_refreshed
FROM lessons l
LEFT JOIN exercises e ON e.lesson_id = l.id
GROUP BY l.category, l.level;

CREATE UNIQUE INDEX IF NOT EXISTS lesson_stats_category_level_idx
  ON lesson_stats (category, level);
