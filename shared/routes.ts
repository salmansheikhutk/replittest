import { z } from 'zod';
import { insertLessonSchema, insertExerciseSchema, lessons, exercises } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  lessons: {
    list: {
      method: 'GET' as const,
      path: '/api/lessons' as const,
      input: z.object({
        category: z.string().optional(), // 'sarf' or 'nahw'
        level: z.string().optional(), // 'beginner', 'intermediate', 'advanced'
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof lessons.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/lessons/:id' as const,
      responses: {
        200: z.custom<typeof lessons.$inferSelect & { exercises: typeof exercises.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LessonResponse = z.infer<typeof api.lessons.get.responses[200]>;
export type LessonsListResponse = z.infer<typeof api.lessons.list.responses[200]>;
