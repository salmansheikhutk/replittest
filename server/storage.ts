import { db } from "./db";
import { lessons, exercises, users, type Lesson, type Exercise, type LessonWithExercises, type User } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLessons(category?: string, level?: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<LessonWithExercises | undefined>;
  upsertUser(googleId: string, name: string, email: string | null, profileImage: string | null): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getLessons(category?: string, level?: string): Promise<Lesson[]> {
    let query = db.select().from(lessons);
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

  async upsertUser(googleId: string, name: string, email: string | null, profileImage: string | null): Promise<User> {
    const existing = await db.select().from(users).where(eq(users.googleId, googleId));
    if (existing.length > 0) {
      const [updated] = await db.update(users)
        .set({ name, email, profileImage })
        .where(eq(users.googleId, googleId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(users).values({ googleId, name, email, profileImage }).returning();
    return created;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
}

export const storage = new DatabaseStorage();
