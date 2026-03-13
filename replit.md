# Arabic Language Learning Platform

## Overview--
A full-stack Arabic language learning app with lessons and quizzes covering Sarf (morphology) and Nahw (grammar).

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **Routing**: wouter (frontend), Express (backend)

## Project Structure
- `client/` - React frontend
- `server/` - Express backend (routes.ts, storage.ts, db.ts)
- `shared/` - Shared types and schema (schema.ts)
- `db/migrations/` - SQL migration files (version-controlled database changes)

## Database Rules (CRITICAL)
1. **All database data changes must be recorded in a SQL migration file** in `db/migrations/` before being executed.
2. **Never insert, update, or delete data without explicit user approval.**
3. **Migration naming convention**: `NNN_description.sql` (e.g., `001_add_new_lesson.sql`)
4. **Baseline file**: `db/migrations/000_baseline.sql` contains the full current state of all data. Can be used to rebuild the database from scratch.
5. **After any data change**, update or create the corresponding migration file so the change is version-controlled and recoverable.

## Schema
- `lessons` - id, title, description, content, category (sarf/nahw), level (beginner/intermediate/advanced), order
- `exercises` - id, lessonId, question, options (text[]), correctAnswer, explanation
- `glossary` - id, term, arabicTerm, transliteration, definition, category (sarf/nahw/general)
- `lesson_stats` - materialized view (category, level, lessonCount, exerciseCount, lastRefreshed)

## Pages
- `/` - Home (category selection with Sarf/Nahw cards and level links)
- `/learn/:category/:level` - Category view (lesson list with descriptions)
- `/lesson/:id` - Lesson view (learn mode + practice quiz)
- `/glossary` - Glossary (searchable/filterable Arabic grammar term reference)
