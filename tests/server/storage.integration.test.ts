import "dotenv/config";
import { describe, it, expect, afterAll, beforeAll } from "vitest";

// In CI (no DB provisioned), skip gracefully.
// Locally, DATABASE_URL must always be present — missing = hard failure.
const inCI = !!process.env.CI;
const hasDb = !!process.env.DATABASE_URL;
const skipInCI = inCI && !hasDb;

beforeAll(() => {
  if (!inCI && !hasDb) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env file before running tests locally.\n" +
      "Example: DATABASE_URL=postgresql://localhost:5432/replit_migration"
    );
  }
});

// Lazily import so the DB connection is only attempted when tests actually run
const { storage } = await import("../../server/storage");
const { pool } = await import("../../server/db");

afterAll(async () => {
  await pool.end();
});

describe("[DB] storage.getLessons()", () => {
  it.skipIf(skipInCI)("returns an array of lessons", async () => {
    const result = await storage.getLessons();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it.skipIf(skipInCI)("each lesson has required fields", async () => {
    const result = await storage.getLessons();
    for (const lesson of result) {
      expect(lesson).toHaveProperty("id");
      expect(lesson).toHaveProperty("title");
      expect(lesson).toHaveProperty("content");
      expect(lesson).toHaveProperty("category");
      expect(lesson).toHaveProperty("level");
      expect(lesson).toHaveProperty("order");
    }
  });

  it.skipIf(skipInCI)("filters by category=sarf", async () => {
    const result = await storage.getLessons("sarf");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.category === "sarf")).toBe(true);
  });

  it.skipIf(skipInCI)("filters by category=nahw", async () => {
    const result = await storage.getLessons("nahw");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.category === "nahw")).toBe(true);
  });

  it.skipIf(skipInCI)("combined filter category=sarf level=beginner", async () => {
    const result = await storage.getLessons("sarf", "beginner");
    expect(result.every((l) => l.category === "sarf" && l.level === "beginner")).toBe(true);
  });

  it.skipIf(skipInCI)("returns empty array for unknown category", async () => {
    const result = await storage.getLessons("nonexistent");
    expect(result).toHaveLength(0);
  });
});

describe("[DB] storage.getLesson()", () => {
  it.skipIf(skipInCI)("returns lesson with exercises for a valid id", async () => {
    // Get first available lesson id dynamically
    const all = await storage.getLessons();
    const firstId = all[0].id;

    const result = await storage.getLesson(firstId);
    expect(result).toBeDefined();
    expect(result!.id).toBe(firstId);
    expect(result!.title).toBeTruthy();
    expect(Array.isArray(result!.exercises)).toBe(true);
  });

  it.skipIf(skipInCI)("exercises contain required fields", async () => {
    const all = await storage.getLessons();
    const firstId = all[0].id;
    const result = await storage.getLesson(firstId);

    for (const ex of result!.exercises) {
      expect(ex).toHaveProperty("id");
      expect(ex).toHaveProperty("question");
      expect(ex).toHaveProperty("options");
      expect(ex).toHaveProperty("correctAnswer");
      expect(ex).toHaveProperty("explanation");
      expect(Array.isArray(ex.options)).toBe(true);
    }
  });

  it.skipIf(skipInCI)("returns undefined for a non-existent id", async () => {
    const result = await storage.getLesson(999999);
    expect(result).toBeUndefined();
  });
});

describe("[DB] Data integrity", () => {
  it.skipIf(skipInCI)("all lessons have a valid category (sarf or nahw)", async () => {
    const result = await storage.getLessons();
    const validCategories = ["sarf", "nahw"];
    for (const lesson of result) {
      expect(validCategories).toContain(lesson.category);
    }
  });

  it.skipIf(skipInCI)("all lessons have a valid level", async () => {
    const result = await storage.getLessons();
    const validLevels = ["beginner", "intermediate", "advanced"];
    for (const lesson of result) {
      expect(validLevels).toContain(lesson.level);
    }
  });

  it.skipIf(skipInCI)("all lessons have a positive order value", async () => {
    const result = await storage.getLessons();
    for (const lesson of result) {
      expect(lesson.order).toBeGreaterThan(0);
    }
  });

  it.skipIf(skipInCI)("every exercise's correctAnswer is present in its options array", async () => {
    const allLessons = await storage.getLessons();
    for (const lesson of allLessons) {
      const full = await storage.getLesson(lesson.id);
      for (const ex of full!.exercises) {
        expect(ex.options).toContain(ex.correctAnswer);
      }
    }
  });

  it.skipIf(skipInCI)("every exercise has at least 2 options", async () => {
    const allLessons = await storage.getLessons();
    for (const lesson of allLessons) {
      const full = await storage.getLesson(lesson.id);
      for (const ex of full!.exercises) {
        expect(ex.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
