import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { createServer } from "http";

// Mock the db module so no real Postgres connection is needed
vi.mock("../../server/db", () => ({
  db: {},
  pool: { end: vi.fn() },
}));

// Mock storage so routes use our fake data instead of the database
vi.mock("../../server/storage", () => {
  const mockLessons = [
    { id: 1, title: "Past Tense (Madi)", content: "...", category: "sarf", level: "beginner", order: 1 },
    { id: 2, title: "Present Tense (Mudari)", content: "...", category: "sarf", level: "beginner", order: 2 },
    { id: 3, title: "Nouns (Ism)", content: "...", category: "nahw", level: "beginner", order: 1 },
  ];

  const mockExercises = [
    { id: 1, lessonId: 1, question: "Base form?", options: ["He did", "I did"], correctAnswer: "He did", explanation: "3rd person." },
  ];

  return {
    storage: {
      getLessons: vi.fn(async (category?: string, level?: string) => {
        return mockLessons.filter(l => {
          if (category && l.category !== category) return false;
          if (level && l.level !== level) return false;
          return true;
        });
      }),
      getLesson: vi.fn(async (id: number) => {
        const lesson = mockLessons.find(l => l.id === id);
        if (!lesson) return undefined;
        return { ...lesson, exercises: mockExercises.filter(e => e.lessonId === id) };
      }),
    },
  };
});

// Build a fresh app for testing (no vite, no port binding)
async function buildTestApp() {
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  const { registerRoutes } = await import("../../server/routes");
  await registerRoutes(httpServer, app);
  return app;
}

describe("GET /api/lessons", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await buildTestApp();
  });

  it("returns 200 with all lessons", async () => {
    const res = await request(app).get("/api/lessons");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/lessons?category=sarf");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((l: { category: string }) => l.category === "sarf")).toBe(true);
  });

  it("filters by level", async () => {
    const res = await request(app).get("/api/lessons?level=beginner");
    expect(res.status).toBe(200);
    expect(res.body.every((l: { level: string }) => l.level === "beginner")).toBe(true);
  });

  it("returns empty array for unknown category", async () => {
    const res = await request(app).get("/api/lessons?category=unknown");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("GET /api/lessons/:id", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await buildTestApp();
  });

  it("returns 200 with lesson and exercises for valid id", async () => {
    const res = await request(app).get("/api/lessons/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe("Past Tense (Madi)");
    expect(Array.isArray(res.body.exercises)).toBe(true);
    expect(res.body.exercises).toHaveLength(1);
  });

  it("returns 404 for non-existent lesson", async () => {
    const res = await request(app).get("/api/lessons/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Lesson not found");
  });

  it("returns 400 for non-numeric id", async () => {
    const res = await request(app).get("/api/lessons/abc");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });
});
