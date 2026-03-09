import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { lessons, exercises } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.lessons.list.path, async (req, res) => {
    try {
      const input = api.lessons.list.input?.parse(req.query) || {};
      const allLessons = await storage.getLessons(input.category, input.level);
      res.json(allLessons);
    } catch (err) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  app.get(api.lessons.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const lesson = await storage.getLesson(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  });

  // Seed data if empty
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingLessons = await storage.getLessons();
  if (existingLessons.length === 0) {
    // Basic Sarf Lesson
    const [lesson1] = await db.insert(lessons).values({
      title: "Past Tense (Madi)",
      content: "Arabic verbs usually have 3 root letters. The base is 3rd person masculine singular: **Fa'ala** (He did).",
      category: "sarf",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson1.id,
        question: "Base form of past tense?",
        options: ["He did", "I did", "You did"],
        correctAnswer: "He did",
        explanation: "3rd person masculine singular is the root."
      },
      {
        lessonId: lesson1.id,
        question: "Standard root letter count?",
        options: ["2", "3", "4"],
        correctAnswer: "3",
        explanation: "Most Arabic verbs are triliteral (3 letters)."
      }
    ]);

    // Added Sarf Lesson 2
    const [lesson1b] = await db.insert(lessons).values({
      title: "Present Tense (Mudari)",
      content: "Starts with prefixes: **Ya-** (He), **Ta-** (You/She), **A-** (I), **Na-** (We). Example: **Yaf'alu** (He does).",
      category: "sarf",
      level: "beginner",
      order: 2
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson1b.id,
        question: "Prefix for 'He' (3rd person)?",
        options: ["Ya", "Ta", "Na"],
        correctAnswer: "Ya",
        explanation: "Ya- indicates 3rd person masculine singular."
      }
    ]);

    // Basic Nahw Lesson
    const [lesson2] = await db.insert(lessons).values({
      title: "Nominal Sentence (Ismiyya)",
      content: "Starts with a noun. Two parts: **Mubtada** (Subject) and **Khabar** (Predicate). Both are **Marfu** (Nominative).",
      category: "nahw",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson2.id,
        question: "Sentence starting with a noun?",
        options: ["Ismiyya", "Fi'liyya"],
        correctAnswer: "Ismiyya",
        explanation: "Jumla Ismiyya starts with an Ism (noun)."
      }
    ]);

    // Added Nahw Lesson 2
    const [lesson2b] = await db.insert(lessons).values({
      title: "Verbal Sentence (Fi'liyya)",
      content: "Starts with a verb. Main parts: **Fi'l** (Verb) and **Fa'il** (Doer). Fa'il is always **Marfu**.",
      category: "nahw",
      level: "beginner",
      order: 2
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson2b.id,
        question: "Grammatical state of the Fa'il (Doer)?",
        options: ["Marfu", "Mansub", "Majrur"],
        correctAnswer: "Marfu",
        explanation: "The subject/doer of a verb is always nominative."
      }
    ]);
    
    console.log("Database seeded successfully.");
  }
}
