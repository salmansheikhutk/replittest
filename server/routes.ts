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
      title: "Introduction to Past Tense (Fi'l Madi)",
      content: "In Arabic morphology (Sarf), the past tense verb is built upon a root of typically three letters. The base form is the 3rd person masculine singular. For example, 'Fa'ala' (He did).",
      category: "sarf",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson1.id,
        question: "What is the base form of the past tense verb in Arabic?",
        options: ["1st person singular", "3rd person masculine singular", "2nd person plural", "3rd person feminine plural"],
        correctAnswer: "3rd person masculine singular",
        explanation: "The dictionary or base form of an Arabic verb is the 3rd person masculine singular (e.g., 'he wrote')."
      },
      {
        lessonId: lesson1.id,
        question: "How many root letters does a typical Arabic verb have?",
        options: ["Two", "Three", "Four", "Five"],
        correctAnswer: "Three",
        explanation: "Most Arabic verbs are triliteral, meaning they have a 3-letter root."
      }
    ]);

    // Basic Nahw Lesson
    const [lesson2] = await db.insert(lessons).values({
      title: "Nominal Sentence (Jumla Ismiyya)",
      content: "An Arabic nominal sentence starts with a noun and typically consists of two parts: the subject (Mubtada') and the predicate (Khabar). Both are in the nominative case (Marfu').",
      category: "nahw",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson2.id,
        question: "What are the two main parts of a Nominal Sentence?",
        options: ["Verb and Subject", "Subject and Object", "Mubtada' and Khabar", "Adjective and Noun"],
        correctAnswer: "Mubtada' and Khabar",
        explanation: "The nominal sentence consists of the Mubtada' (Subject) and Khabar (Predicate)."
      },
      {
        lessonId: lesson2.id,
        question: "What is the grammatical case of the Mubtada'?",
        options: ["Accusative (Mansub)", "Genitive (Majrur)", "Nominative (Marfu')", "Jussive (Majzum)"],
        correctAnswer: "Nominative (Marfu')",
        explanation: "Both the Mubtada' and Khabar are typically in the nominative case (Marfu')."
      }
    ]);
    
    console.log("Database seeded successfully.");
  }
}
