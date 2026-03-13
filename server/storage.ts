import { db } from "./db";
import { lessons, exercises, glossary, testing, type Lesson, type Exercise, type LessonWithExercises, type GlossaryTerm, type TestingRecord } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLessons(category?: string, level?: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<LessonWithExercises | undefined>;
  getGlossaryTerms(category?: string): Promise<GlossaryTerm[]>;
  getTestingRecords(): Promise<TestingRecord[]>;
}

export class DatabaseStorage implements IStorage {
  async getLessons(category?: string, level?: string): Promise<Lesson[]> {
    const allLessons = await db.select().from(lessons);
    return allLessons.filter(lesson => {
      let matches = true;
      if (category && lesson.category !== category) matches = false;
      if (level && lesson.level !== level) matches = false;
      return matches;
    });
  }

  async getLesson(id: number): Promise<LessonWithExercises | undefined> {
    const lesson = await db.select().from(lessons).where(eq(lessons.id, id));
    if (!lesson.length) return undefined;

    const lessonExercises = await db.select().from(exercises).where(eq(exercises.lessonId, id));

    return {
      ...lesson[0],
      exercises: lessonExercises
    };
  }

  async getGlossaryTerms(category?: string): Promise<GlossaryTerm[]> {
    const allTerms = await db.select().from(glossary);
    if (!category) return allTerms;
    return allTerms.filter(term => term.category === category);
  }

  async getTestingRecords(): Promise<TestingRecord[]> {
    return db.select().from(testing);
  }
}

export const storage = new DatabaseStorage();
