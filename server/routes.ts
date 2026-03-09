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
      title: "الفعل الماضي (Past Tense)",
      content: "الأفعال العربية عادةً تتكون من ثلاثة أحرف أصلية. الأصل في الفعل الماضي هو صيغة الغائب المذكر المفرد: **فَعَلَ**.\n\nأمثلة:\n- **كَتَبَ** (هو كتب)\n- **ذَهَبَ** (هو ذهب)\n- **جَلَسَ** (هو جلس)",
      category: "sarf",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson1.id,
        question: "ما هو الأصل في صيغة الفعل الماضي؟",
        options: ["فَعَلَ (هو)", "فَعَلْتُ (أنا)", "فَعَلْتَ (أنت)"],
        correctAnswer: "فَعَلَ (هو)",
        explanation: "أصل الفعل الماضي هو صيغة الغائب المذكر المفرد (هو) وهو الأساس الذي تُبنى عليه بقية التصريفات."
      },
      {
        lessonId: lesson1.id,
        question: "كم عدد الحروف الأصلية في أكثر الأفعال العربية؟",
        options: ["٢", "٣", "٤"],
        correctAnswer: "٣",
        explanation: "أغلب الأفعال العربية ثلاثية الأصل، أي تتكون من ثلاثة أحرف أصلية (ف ع ل)."
      }
    ]);

    const [lesson1b] = await db.insert(lessons).values({
      title: "الفعل المضارع (Present Tense)",
      content: "يبدأ الفعل المضارع بأحد حروف المضارعة (أنيت): **يـ** (هو)، **تـ** (أنتَ/هي)، **أ** (أنا)، **نـ** (نحن).\n\nأمثلة:\n- **يَكْتُبُ** (هو يكتب)\n- **تَذْهَبُ** (أنتَ تذهب / هي تذهب)\n- **أَجْلِسُ** (أنا أجلس)\n- **نَفْعَلُ** (نحن نفعل)",
      category: "sarf",
      level: "beginner",
      order: 2
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson1b.id,
        question: "ما هو حرف المضارعة للغائب المذكر (هو)؟",
        options: ["يـ", "تـ", "نـ"],
        correctAnswer: "يـ",
        explanation: "حرف المضارعة (يـ) يدل على الغائب المذكر المفرد، مثل: يَفْعَلُ."
      }
    ]);

    const [lesson2] = await db.insert(lessons).values({
      title: "الجملة الاسمية (Nominal Sentence)",
      content: "الجملة الاسمية تبدأ باسم وتتكون من ركنين أساسيين:\n\n- **المبتدأ**: الاسم الذي نتحدث عنه (مرفوع)\n- **الخبر**: ما نُخبر به عن المبتدأ (مرفوع)\n\nمثال: **الكتابُ جديدٌ** (المبتدأ: الكتابُ، الخبر: جديدٌ)",
      category: "nahw",
      level: "beginner",
      order: 1
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson2.id,
        question: "ما هي الجملة التي تبدأ باسم؟",
        options: ["الجملة الاسمية", "الجملة الفعلية"],
        correctAnswer: "الجملة الاسمية",
        explanation: "الجملة الاسمية تبدأ باسم وتتكون من مبتدأ وخبر."
      }
    ]);

    const [lesson2b] = await db.insert(lessons).values({
      title: "الجملة الفعلية (Verbal Sentence)",
      content: "الجملة الفعلية تبدأ بفعل وتتكون من:\n\n- **الفعل**: الحدث الواقع\n- **الفاعل**: من قام بالفعل (دائماً مرفوع)\n- **المفعول به**: من وقع عليه الفعل (منصوب)\n\nمثال: **كَتَبَ الطالبُ الدرسَ** (الفعل: كتب، الفاعل: الطالبُ، المفعول به: الدرسَ)",
      category: "nahw",
      level: "beginner",
      order: 2
    }).returning();

    await db.insert(exercises).values([
      {
        lessonId: lesson2b.id,
        question: "ما هو الإعراب الصحيح للفاعل؟",
        options: ["مرفوع", "منصوب", "مجرور"],
        correctAnswer: "مرفوع",
        explanation: "الفاعل دائماً مرفوع، وعلامة رفعه الضمة الظاهرة أو المقدرة."
      }
    ]);
    
    console.log("Database seeded successfully.");
  }
}
