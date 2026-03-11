# Tests

## Commands

| Command | Description |
|---|---|
| `npm test` | Run all unit/integration tests (Vitest) |
| `npm run test:watch` | Re-run on file save (dev mode) |
| `npm run test:ui` | Open interactive Vitest UI |
| `npm run test:e2e` | Run browser tests (Playwright) — requires dev server + live DB |

---

## Unit & Integration Tests (Vitest)

Run with: `npm test`

Two categories:
- **Unit tests** — no database or browser needed, run in jsdom. Fast (~1–2s).
- **DB integration tests** — connect to your real `DATABASE_URL`. Skipped automatically if the DB is unreachable. Tests run in Node environment.

### `tests/shared/schema.test.ts` — Schema Validation (5 tests)
- `insertLessonSchema` accepts valid lesson data
- `insertLessonSchema` rejects missing required fields
- `insertLessonSchema` rejects missing title
- `insertExerciseSchema` accepts valid exercise data
- `insertExerciseSchema` rejects missing correctAnswer

### `tests/server/routes.test.ts` — API Endpoints, mocked DB (7 tests)
- `[Mock] GET /api/lessons` — returns 200 with all lessons, filters by category/level, empty array for unknown category
- `[Mock] GET /api/lessons/:id` — returns 200 with lesson+exercises, 404 for missing, 400 for non-numeric id

### `tests/server/storage.integration.test.ts` — Storage Layer, real DB (13 tests)
> Locally: **fail hard** if `DATABASE_URL` is missing. In CI without a DB: skipped.
- `[DB] storage.getLessons()` — returns array, required fields, sarf/nahw/combined/empty filters
- `[DB] storage.getLesson()` — returns lesson with exercises for valid id, undefined for missing
- `[DB] Data integrity` — valid categories/levels, positive order, correctAnswer in options, ≥2 options per exercise
### `tests/server/api.integration.test.ts` — API HTTP → real DB (11 tests)
> Locally: **fail hard** if `DATABASE_URL` is missing. In CI without a DB: skipped.
- `[API] GET /api/lessons` — returns 200 with array, required fields, sarf/nahw/combined/empty filters
- `[API] GET /api/lessons/:id` — returns 200 with lesson+exercises, 404 for missing, 400 for non-numeric
- `[API] Response contract` — passes frontend Zod validator; sarf and nahw are disjoint sets

### `tests/client/Home.test.tsx` — Home Page Render (3 tests)
- Renders the main heading
- Renders Sarf and Nahw sections
- Renders all three difficulty levels (Beginner, Intermediate, Advanced)

### `tests/client/CategoryView.test.tsx` — Category Page (8 tests)
- Renders the category and level heading
- Renders a Back to Categories link
- Shows skeleton placeholders while loading
- Shows error message when fetch fails
- Shows "Coming Soon" when lessons array is empty
- Renders lesson titles when data loads
- Shows lesson number badge for incomplete lessons
- Links each lesson to `/lesson/:id`
- Shows invalid URL message when params are missing

### `tests/client/LessonView.test.tsx` — Lesson Page (10 tests)
- Shows skeleton placeholders while loading
- Shows not found state when lesson is missing
- Shows not found state when an error occurs
- Renders lesson title in learn mode
- Renders lesson content in learn mode
- Shows Learn and Practice tab buttons
- Defaults to Learn mode (quiz not visible initially)
- Clicking Practice tab renders the quiz
- Clicking Start Practice Quiz button switches to practice mode
- Clicking Learn tab returns to content from practice mode
- Renders a Back to Path link pointing to the category/level page

### `tests/client/use-progress.test.ts` — useProgress Hook (10 tests)
- Starts with empty completedLessonIds and 0 XP
- `markLessonComplete` adds lessonId to completedLessonIds
- `markLessonComplete` awards 50 XP by default
- `markLessonComplete` accepts a custom XP amount
- Completing the same lesson twice does not duplicate the id
- Completing the same lesson twice does not add XP twice
- Can complete multiple different lessons (XP accumulates correctly)
- `isLessonComplete` returns false for an unknown lesson
- `isLessonComplete` returns true after completing a lesson
- `isLessonComplete` returns false for a different lesson

### `tests/client/Quiz.test.tsx` — Quiz Component Interactions (12 tests)
- Renders the first question
- Renders all answer options
- Selecting an option highlights it
- Check button is disabled until an option is selected
- Clicking correct answer then Check → reveals correct (green) state
- Clicking wrong answer then Check → reveals incorrect (red) state
- Answer buttons are disabled after Check is clicked
- Option text remains visible after clicking Check Answer (correct) ← regression
- Wrong answer text remains visible after clicking Check Answer ← regression
- Shows explanation after Check is clicked
- Clicking Next Question advances to the next exercise
- Shows completion screen after finishing all exercises

---

## End-to-End Tests (Playwright)

Run in real browsers against the live dev server + database.
Requires: `npm run dev` running with a connected PostgreSQL database.
Run with: `npm run test:e2e`

Tested on: Desktop Chrome, Mobile Safari (iPhone 13)

### `tests/e2e/home.spec.ts` — Home Page (9 tests per browser)

**Home page**
- Loads and displays main heading
- Displays Sarf and Nahw category cards
- Clicking Sarf Beginner navigates to `/learn/sarf/beginner`
- Clicking Nahw Beginner navigates to `/learn/nahw/beginner`

**Responsiveness**
- Home page renders correctly on mobile (375px)
- Home page renders correctly on tablet (768px)
- Home page renders correctly on desktop (1440px)

**Navigation**
- Navbar is visible on all pages
- 404 page shows for unknown routes

### `tests/e2e/journey.spec.ts` — Full User Journey (10 tests per browser)

**Category page**
- Navigating to `/learn/sarf/beginner` shows lesson list
- Back to Categories link returns to home
- Lessons are listed with clickable links
- Navigating to `/learn/nahw/beginner` shows the Nahw heading

**Lesson page**
- Clicking a lesson navigates to `/lesson/:id`
- Lesson page shows the lesson title
- Lesson page shows Learn and Practice tabs
- Clicking Practice tab shows the quiz
- Start Practice Quiz button switches to quiz view
- Back to Path link returns to the category page

**Full quiz journey**
- Can select an answer and click Check Answer
- After answering, Next Question button advances the quiz

---

## Git Hooks

| Hook | Trigger | Command |
|---|---|---|
| `pre-commit` | Every `git commit` | `npm test` |
| `pre-push` | Every `git push` | `npm test && npm run test:e2e` |

The push is **aborted** if any test fails.
