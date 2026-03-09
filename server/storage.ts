import { db } from "./db";
import { lessons, exercises, type Lesson, type Exercise, type LessonWithExercises } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLessons(category?: string, level?: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<LessonWithExercises | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getLessons(category?: string, level?: string): Promise<Lesson[]> {
    let query = db.select().from(lessons);
    
    // We could add conditionals here if we want to filter in the DB, 
    // but for simple cases, returning all or filtering manually is fine.
    // However, Drizzle allows conditional where clauses but we'll fetch all and filter or use basic where.
    const allLessons = await query;
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
}

export const storage = new DatabaseStorage();
