import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import request from "supertest";
import { createServer } from "http";
import type { Express } from "express";

// In CI (no DB provisioned), skip gracefully.
// Locally, DATABASE_URL must always be present — missing = hard failure.
const inCI = !!process.env.CI;
const hasDb = !!process.env.DATABASE_URL;
const skipInCI = inCI && !hasDb;

let app: Express;
let pool: import("pg").Pool;

beforeAll(async () => {
  if (!inCI && !hasDb) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env file before running tests locally.\n" +
      "Example: DATABASE_URL=postgresql://localhost:5432/replit_migration"
    );
  }
  if (!hasDb) return;
  app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  // Import real modules — no mocks
  const { registerRoutes } = await import("../../server/routes");
  const dbModule = await import("../../server/db");
  pool = dbModule.pool;
  // registerRoutes also calls seedDatabase, but seed is a no-op if data exists
  await registerRoutes(httpServer, app);
});

afterAll(async () => {
  if (pool) await pool.end();
});

describe("[API] GET /api/lessons", () => {
  it.skipIf(skipInCI)("returns 200 with an array of lessons", async () => {
    const res = await request(app).get("/api/lessons");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it.skipIf(skipInCI)("each lesson in response has required fields", async () => {
    const res = await request(app).get("/api/lessons");
    for (const lesson of res.body) {
      expect(lesson).toHaveProperty("id");
      expect(lesson).toHaveProperty("title");
      expect(lesson).toHaveProperty("category");
      expect(lesson).toHaveProperty("level");
      expect(lesson).toHaveProperty("order");
    }
  });

  it.skipIf(skipInCI)("filters by category=sarf", async () => {
    const res = await request(app).get("/api/lessons?category=sarf");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((l: { category: string }) => l.category === "sarf")).toBe(true);
  });

  it.skipIf(skipInCI)("filters by category=nahw", async () => {
    const res = await request(app).get("/api/lessons?category=nahw");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((l: { category: string }) => l.category === "nahw")).toBe(true);
  });

  it.skipIf(skipInCI)("combined filter category=sarf&level=beginner", async () => {
    const res = await request(app).get("/api/lessons?category=sarf&level=beginner");
    expect(res.status).toBe(200);
    expect(
      res.body.every((l: { category: string; level: string }) =>
        l.category === "sarf" && l.level === "beginner"
      )
    ).toBe(true);
  });

  it.skipIf(skipInCI)("returns empty array for unknown category", async () => {
    const res = await request(app).get("/api/lessons?category=unknown");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("[API] GET /api/lessons/:id", () => {
  it.skipIf(skipInCI)("returns 200 with lesson + exercises for a valid id", async () => {
    // First fetch the list to get a real id
    const list = await request(app).get("/api/lessons");
    const firstId = list.body[0].id;

    const res = await request(app).get(`/api/lessons/${firstId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(firstId);
    expect(res.body.title).toBeTruthy();
    expect(Array.isArray(res.body.exercises)).toBe(true);
  });

  it.skipIf(skipInCI)("exercises in response have required fields", async () => {
    const list = await request(app).get("/api/lessons");
    const firstId = list.body[0].id;
    const res = await request(app).get(`/api/lessons/${firstId}`);

    for (const ex of res.body.exercises) {
      expect(ex).toHaveProperty("id");
      expect(ex).toHaveProperty("question");
      expect(ex).toHaveProperty("options");
      expect(ex).toHaveProperty("correctAnswer");
      expect(ex).toHaveProperty("explanation");
    }
  });

  it.skipIf(skipInCI)("returns 404 for a non-existent id", async () => {
    const res = await request(app).get("/api/lessons/999999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it.skipIf(skipInCI)("returns 400 for a non-numeric id", async () => {
    const res = await request(app).get("/api/lessons/abc");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});

describe("[API] Response contract", () => {
  it.skipIf(skipInCI)("GET /api/lessons response passes frontend Zod validator", async () => {
    const { api } = await import("../../shared/routes");
    const res = await request(app).get("/api/lessons");
    // This is what the frontend parses — if this fails, the frontend will throw at runtime
    const parsed = api.lessons.list.responses[200].safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it.skipIf(skipInCI)("sarf lessons are not returned when filtering for nahw", async () => {
    const sarfRes = await request(app).get("/api/lessons?category=sarf");
    const nahwRes = await request(app).get("/api/lessons?category=nahw");

    const sarfIds = new Set(sarfRes.body.map((l: { id: number }) => l.id));
    const nahwIds = new Set(nahwRes.body.map((l: { id: number }) => l.id));

    // No lesson should appear in both — sets must be disjoint
    const overlap = [...sarfIds].filter((id) => nahwIds.has(id));
    expect(overlap).toHaveLength(0);
  });
});
