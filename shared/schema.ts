import { pgTable, pgMaterializedView, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  content: text("content").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  order: integer("order").notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
});

export const lessonsRelations = relations(lessons, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
}));

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type LessonWithExercises = Lesson & { exercises: Exercise[] };

export const glossary = pgTable("glossary", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  arabicTerm: text("arabic_term").notNull(),
  transliteration: text("transliteration").notNull(),
  definition: text("definition").notNull(),
  category: text("category").notNull(),
});

export const insertGlossarySchema = createInsertSchema(glossary).omit({ id: true });

export type GlossaryTerm = typeof glossary.$inferSelect;
export type InsertGlossaryTerm = z.infer<typeof insertGlossarySchema>;

export const lessonStats = pgMaterializedView("lesson_stats", {
  category: text("category"),
  level: text("level"),
  lessonCount: integer("lesson_count"),
  exerciseCount: integer("exercise_count"),
  lastRefreshed: timestamp("last_refreshed"),
}).as(sql`
  SELECT
    l.category,
    l.level,
    COUNT(DISTINCT l.id)::int AS lesson_count,
    COUNT(e.id)::int          AS exercise_count,
    NOW()                     AS last_refreshed
  FROM lessons l
  LEFT JOIN exercises e ON e.lesson_id = l.id
  GROUP BY l.category, l.level
`);

export type LessonStats = typeof lessonStats.$inferSelect;
