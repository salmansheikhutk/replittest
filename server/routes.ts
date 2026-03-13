import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { lessons, exercises, glossary } from "@shared/schema";

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

  app.get(api.glossary.list.path, async (req, res) => {
    try {
      const input = api.glossary.list.input?.parse(req.query) || {};
      const terms = await storage.getGlossaryTerms(input.category);
      res.json(terms);
    } catch (err) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  app.get(api.testing.list.path, async (_req, res) => {
    const records = await storage.getTestingRecords();
    res.json(records);
  });

  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingLessons = await storage.getLessons();
  if (existingLessons.length === 0) {
    const [lesson1] = await db.insert(lessons).values({
      title: "Past Tense (Madi)",
      description: "Understand the structure of Arabic past tense verbs and the 3-letter root system.",
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

    const [lesson1b] = await db.insert(lessons).values({
      title: "Present Tense (Mudari)",
      description: "Learn how prefix letters indicate person and gender in present/future tense verbs.",
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

    const [lesson2] = await db.insert(lessons).values({
      title: "Nominal Sentence (Ismiyya)",
      description: "Explore sentences that begin with a noun, composed of a subject (Mubtada) and predicate (Khabar).",
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

    const [lesson2b] = await db.insert(lessons).values({
      title: "Verbal Sentence (Fi'liyya)",
      description: "Study sentences that begin with a verb, with the doer (Fa'il) always in the nominative case.",
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

  const existingTerms = await storage.getGlossaryTerms();
  if (existingTerms.length === 0) {
    await db.insert(glossary).values([
      { term: "Past Tense", arabicTerm: "فعل ماضي", transliteration: "Fi'l Madi", definition: "A verb form indicating an action that has already occurred. The base form uses 3rd person masculine singular.", category: "sarf" },
      { term: "Present Tense", arabicTerm: "فعل مضارع", transliteration: "Fi'l Mudari", definition: "A verb form indicating an ongoing or future action. Formed by adding prefix letters (Ya, Ta, A, Na) to the root.", category: "sarf" },
      { term: "Imperative", arabicTerm: "فعل أمر", transliteration: "Fi'l Amr", definition: "A verb form used to give commands or make requests. Derived from the present tense by removing the prefix.", category: "sarf" },
      { term: "Verb Pattern", arabicTerm: "وزن", transliteration: "Wazan", definition: "A morphological template that determines the structure and meaning pattern of Arabic words. The base pattern is Fa'ala.", category: "sarf" },
      { term: "Conjugation", arabicTerm: "تصريف", transliteration: "Tasrif", definition: "The process of changing a verb's form to reflect person, gender, number, tense, and mood.", category: "sarf" },
      { term: "Bare Verb", arabicTerm: "مجرد", transliteration: "Mujarrad", definition: "A verb consisting only of its root letters (typically 3) without any additional letters.", category: "sarf" },
      { term: "Augmented Verb", arabicTerm: "مزيد", transliteration: "Mazid", definition: "A verb that has extra letters added to its root to modify or extend its meaning.", category: "sarf" },
      { term: "Subject/Doer", arabicTerm: "فاعل", transliteration: "Fa'il", definition: "The one who performs the action of the verb. Always in the nominative case (Marfu) in Arabic grammar.", category: "nahw" },
      { term: "Object", arabicTerm: "مفعول به", transliteration: "Maf'ul bihi", definition: "The entity that receives the action of the verb. Always in the accusative case (Mansub).", category: "nahw" },
      { term: "Subject of Nominal Sentence", arabicTerm: "مبتدأ", transliteration: "Mubtada", definition: "The subject in a nominal sentence (Jumla Ismiyya). Always in the nominative case (Marfu).", category: "nahw" },
      { term: "Predicate", arabicTerm: "خبر", transliteration: "Khabar", definition: "The predicate in a nominal sentence that provides information about the subject (Mubtada). Always Marfu.", category: "nahw" },
      { term: "Adjective", arabicTerm: "نعت / صفة", transliteration: "Na'at / Sifah", definition: "A word that describes a noun. It follows the noun it modifies and agrees with it in case, gender, number, and definiteness.", category: "nahw" },
      { term: "Possession Construction", arabicTerm: "إضافة", transliteration: "Idafa", definition: "A construction where two nouns are linked to show possession or association. The second noun is always in the genitive case (Majrur).", category: "nahw" },
      { term: "Grammatical Analysis", arabicTerm: "إعراب", transliteration: "I'rab", definition: "The system of case endings in Arabic that indicate the grammatical function of words in a sentence.", category: "nahw" },
      { term: "Noun", arabicTerm: "اسم", transliteration: "Ism", definition: "A word that refers to a person, place, thing, or concept. One of the three main word categories in Arabic.", category: "general" },
      { term: "Verb", arabicTerm: "فعل", transliteration: "Fi'l", definition: "A word that indicates an action or state tied to a specific time. One of the three main word categories in Arabic.", category: "general" },
      { term: "Particle", arabicTerm: "حرف", transliteration: "Harf", definition: "A word that only has meaning when combined with other words (prepositions, conjunctions, etc.). The third main word category.", category: "general" },
      { term: "Nominative Case", arabicTerm: "مرفوع", transliteration: "Marfu", definition: "The grammatical case for subjects, predicates, and other elevated positions. Marked by damma (u) or its equivalents.", category: "general" },
      { term: "Accusative Case", arabicTerm: "منصوب", transliteration: "Mansub", definition: "The grammatical case for objects, adverbs, and certain complements. Marked by fatha (a) or its equivalents.", category: "general" },
      { term: "Genitive Case", arabicTerm: "مجرور", transliteration: "Majrur", definition: "The grammatical case for nouns after prepositions and in Idafa constructions. Marked by kasra (i) or its equivalents.", category: "general" },
    ]);
    console.log("Glossary seeded successfully.");
  }
}
