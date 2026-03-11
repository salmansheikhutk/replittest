import { describe, it, expect } from "vitest";
import { insertLessonSchema, insertExerciseSchema } from "@shared/schema";

describe("insertLessonSchema", () => {
  it("accepts valid lesson data", () => {
    const result = insertLessonSchema.safeParse({
      title: "Past Tense (Madi)",
      content: "Arabic verbs have 3 root letters.",
      category: "sarf",
      level: "beginner",
      order: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = insertLessonSchema.safeParse({
      title: "Past Tense",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = insertLessonSchema.safeParse({
      content: "Some content",
      category: "sarf",
      level: "beginner",
      order: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("insertExerciseSchema", () => {
  it("accepts valid exercise data", () => {
    const result = insertExerciseSchema.safeParse({
      lessonId: 1,
      question: "What is the base form?",
      options: ["He did", "I did", "You did"],
      correctAnswer: "He did",
      explanation: "3rd person masculine singular.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing correctAnswer", () => {
    const result = insertExerciseSchema.safeParse({
      lessonId: 1,
      question: "What is the base form?",
      options: ["He did", "I did"],
      explanation: "Some explanation",
    });
    expect(result.success).toBe(false);
  });
});
