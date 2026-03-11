# Tests

## Commands

| Command | Description |
|---|---|
| `npm test` | Run all unit/integration tests (Vitest) |
| `npm test -- --reporter=verbose` | Run with full test name output |
| `npm run test:watch` | Re-run on file save (dev mode) |
| `npm run test:e2e` | Run browser tests (Playwright) — requires dev server running |

---

## Unit & Integration Tests (Vitest)

Run without a database or browser. Fast (~1s).

### `tests/shared/schema.test.ts` — Schema Validation
- `insertLessonSchema` accepts valid lesson data
- `insertLessonSchema` rejects missing required fields
- `insertLessonSchema` rejects missing title
- `insertExerciseSchema` accepts valid exercise data
- `insertExerciseSchema` rejects missing correctAnswer

### `tests/server/routes.test.ts` — API Endpoints
- `GET /api/lessons` returns 200 with all lessons
- `GET /api/lessons` filters by category
- `GET /api/lessons` filters by level
- `GET /api/lessons` returns empty array for unknown category
- `GET /api/lessons/:id` returns 200 with lesson and exercises for valid id
- `GET /api/lessons/:id` returns 404 for non-existent lesson
- `GET /api/lessons/:id` returns 400 for non-numeric id

### `tests/client/Home.test.tsx` — Home Page Render
- Renders the main heading
- Renders Sarf and Nahw sections
- Renders all three difficulty levels (Beginner, Intermediate, Advanced)

### `tests/client/Quiz.test.tsx` — Quiz Component Interactions
- Renders the first question
- Renders all answer options
- Selecting an option highlights it
- Check button is disabled until an option is selected
- Clicking correct answer then Check → reveals correct (green) state
- Clicking wrong answer then Check → reveals incorrect (red) state
- Answer buttons are disabled after Check is clicked
- Clicking Next Question advances to the next exercise
- Shows empty state when no exercises provided
- Shows completion screen after finishing all exercises

---

## End-to-End Tests (Playwright)

Run in a real Chromium browser. Requires `npm run dev` running (or starts automatically).
Run with: `npm run test:e2e`

Tested on: Desktop Chrome, Mobile Safari (iPhone 13)

### `tests/e2e/home.spec.ts`

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
