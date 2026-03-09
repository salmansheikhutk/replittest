# Arabic Grammar Learning Platform

An interactive Arabic learning platform focused on Sarf (Morphology) and Nahw (Grammar), with structured lessons and quizzes.

## Architecture

- **Frontend**: React + Vite with TypeScript, Wouter routing, TanStack Query, Framer Motion
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components, Arabic font support (Noto Sans Arabic, Amiri)

## Key Files

- `shared/schema.ts` - Data models for lessons and exercises
- `server/routes.ts` - API routes and database seeding (Arabic content)
- `server/storage.ts` - Storage interface for CRUD operations
- `client/src/components/quiz/Quiz.tsx` - Interactive quiz component (Arabic UI)
- `client/src/pages/Home.tsx` - Home page with Sarf/Nahw category cards
- `client/src/pages/LessonView.tsx` - Lesson content and quiz view (Arabic labels)
- `client/src/pages/CategoryView.tsx` - Learning path view

## Language

- Quiz UI labels, feedback messages, and buttons are in Arabic
- Quiz content (questions, options, explanations) uses proper Arabic script with tashkeel
- Lesson titles include both Arabic and English in parentheses for reference
- Home page and category navigation remain bilingual (Arabic terms with English descriptions)

## Database

- `lessons` table: id, title, content (markdown), category (sarf/nahw), level, order
- `exercises` table: id, lesson_id, question, options (text[]), correct_answer, explanation
- Seed data runs only when database is empty
