import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import request from "supertest";
import { createServer } from "http";
import type { Express } from "express";

/**
 * Journey tests — API equivalent of Playwright e2e tests.
 *
 * Each test maps to a real user flow through the app:
 *   Home → Category → Lesson → Quiz
 *
 * If the API data is correct, the UI will render correctly.
 * These replace browser-click tests with data-contract tests.
 */

const inCI = !!process.env.CI;
const hasDb = !!process.env.DATABASE_URL;
const skipInCI = inCI && !hasDb;

let app: Express;
let pool: import("pg").Pool;

beforeAll(async () => {
  if (!inCI && !hasDb) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!hasDb) return;
  app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  const { registerRoutes } = await import("../../server/routes");
  const dbModule = await import("../../server/db");
  pool = dbModule.pool;
  await registerRoutes(httpServer, app);
});

afterAll(async () => {
  if (pool) await pool.end();
});

// ─── Replaces: "displays Sarf and Nahw category cards" ───────────────────────
describe("[Journey] Home page data", () => {
  it.skipIf(skipInCI)("both sarf and nahw categories have lessons", async () => {
    const sarf = await request(app).get("/api/lessons?category=sarf");
    const nahw = await request(app).get("/api/lessons?category=nahw");
    expect(sarf.body.length).toBeGreaterThan(0);
    expect(nahw.body.length).toBeGreaterThan(0);
  });

  it.skipIf(skipInCI)("beginner level exists for both categories", async () => {
    const sarf = await request(app).get("/api/lessons?category=sarf&level=beginner");
    const nahw = await request(app).get("/api/lessons?category=nahw&level=beginner");
    expect(sarf.body.length).toBeGreaterThan(0);
    expect(nahw.body.length).toBeGreaterThan(0);
  });
});

// ─── Replaces: "navigating to sarf/beginner shows lesson list" ───────────────
describe("[Journey] Category page data", () => {
  it.skipIf(skipInCI)("sarf/beginner returns lessons in order", async () => {
    const res = await request(app).get("/api/lessons?category=sarf&level=beginner");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    // Lessons should have all fields the category page renders
    for (const lesson of res.body) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.category).toBe("sarf");
      expect(lesson.level).toBe("beginner");
      expect(typeof lesson.order).toBe("number");
    }

    // Verify they come back in ascending order
    const orders = res.body.map((l: { order: number }) => l.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it.skipIf(skipInCI)("nahw/beginner returns lessons in order", async () => {
    const res = await request(app).get("/api/lessons?category=nahw&level=beginner");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    const orders = res.body.map((l: { order: number }) => l.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it.skipIf(skipInCI)("unknown category returns empty (no crash)", async () => {
    const res = await request(app).get("/api/lessons?category=unknown");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─── Replaces: "lesson page shows title" + "shows Learn and Practice tabs" ──
describe("[Journey] Lesson page data", () => {
  it.skipIf(skipInCI)("lesson has all fields the lesson view renders", async () => {
    const list = await request(app).get("/api/lessons?category=sarf&level=beginner");
    const firstId = list.body[0].id;

    const res = await request(app).get(`/api/lessons/${firstId}`);
    expect(res.status).toBe(200);

    // Fields used in the lesson header
    expect(res.body.title).toBeTruthy();
    expect(res.body.category).toBeTruthy();
    expect(res.body.level).toBeTruthy();

    // Content used in the Learn tab
    expect(res.body.content).toBeTruthy();

    // Exercises array used in the Practice tab — must exist and be non-empty
    expect(Array.isArray(res.body.exercises)).toBe(true);
    expect(res.body.exercises.length).toBeGreaterThan(0);
  });

  it.skipIf(skipInCI)("navigating to non-existent lesson returns 404", async () => {
    const res = await request(app).get("/api/lessons/999999");
    expect(res.status).toBe(404);
  });
});

// ─── Replaces: "can select an answer and click Check Answer" ─────────────────
describe("[Journey] Quiz data (Practice tab)", () => {
  it.skipIf(skipInCI)("every exercise has a question and at least 2 options", async () => {
    const list = await request(app).get("/api/lessons?category=sarf&level=beginner");
    const firstId = list.body[0].id;
    const res = await request(app).get(`/api/lessons/${firstId}`);

    for (const ex of res.body.exercises) {
      expect(ex.question).toBeTruthy();
      expect(Array.isArray(ex.options)).toBe(true);
      expect(ex.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it.skipIf(skipInCI)("every exercise's correctAnswer is one of its options", async () => {
    const list = await request(app).get("/api/lessons");
    for (const lesson of list.body) {
      const res = await request(app).get(`/api/lessons/${lesson.id}`);
      for (const ex of res.body.exercises) {
        expect(ex.options).toContain(ex.correctAnswer);
      }
    }
  });

  it.skipIf(skipInCI)("every exercise has a non-empty explanation", async () => {
    const list = await request(app).get("/api/lessons");
    const firstId = list.body[0].id;
    const res = await request(app).get(`/api/lessons/${firstId}`);
    for (const ex of res.body.exercises) {
      expect(ex.explanation).toBeTruthy();
    }
  });
});

// ─── Replaces: full quiz journey flow ────────────────────────────────────────
describe("[Journey] Full user flow: Home → Category → Lesson → Quiz", () => {
  it.skipIf(skipInCI)("complete sarf/beginner journey has valid data at every step", async () => {
    // Step 1: Home — get all lessons (what the home page would trigger)
    const allLessons = await request(app).get("/api/lessons");
    expect(allLessons.status).toBe(200);
    expect(allLessons.body.length).toBeGreaterThan(0);

    // Step 2: Category page — filter to sarf/beginner
    const categoryLessons = await request(app).get("/api/lessons?category=sarf&level=beginner");
    expect(categoryLessons.status).toBe(200);
    expect(categoryLessons.body.length).toBeGreaterThan(0);

    // Step 3: Lesson page — load the first lesson
    const firstLesson = categoryLessons.body[0];
    const lesson = await request(app).get(`/api/lessons/${firstLesson.id}`);
    expect(lesson.status).toBe(200);
    expect(lesson.body.title).toBeTruthy();
    expect(lesson.body.content).toBeTruthy();

    // Step 4: Quiz — exercises are answerable
    const exercises = lesson.body.exercises;
    expect(exercises.length).toBeGreaterThan(0);
    for (const ex of exercises) {
      expect(ex.question).toBeTruthy();
      expect(ex.options).toContain(ex.correctAnswer);
      expect(ex.explanation).toBeTruthy();
    }
  });

  it.skipIf(skipInCI)("complete nahw/beginner journey has valid data at every step", async () => {
    const categoryLessons = await request(app).get("/api/lessons?category=nahw&level=beginner");
    expect(categoryLessons.status).toBe(200);
    expect(categoryLessons.body.length).toBeGreaterThan(0);

    const firstLesson = categoryLessons.body[0];
    const lesson = await request(app).get(`/api/lessons/${firstLesson.id}`);
    expect(lesson.status).toBe(200);

    const exercises = lesson.body.exercises;
    expect(exercises.length).toBeGreaterThan(0);
    for (const ex of exercises) {
      expect(ex.options).toContain(ex.correctAnswer);
    }
  });
});
