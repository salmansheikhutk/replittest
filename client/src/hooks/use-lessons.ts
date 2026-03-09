import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useLessons(category?: string, level?: string) {
  return useQuery({
    queryKey: [api.lessons.list.path, category, level],
    queryFn: async () => {
      // Construct URL with query params
      const url = new URL(api.lessons.list.path, window.location.origin);
      if (category) url.searchParams.append("category", category);
      if (level) url.searchParams.append("level", level);

      const res = await fetch(url.toString(), { credentials: "omit" });
      if (!res.ok) throw new Error('Failed to fetch lessons');
      
      const data = await res.json();
      return parseWithLogging(api.lessons.list.responses[200], data, "lessons.list");
    },
    // Only refetch when category/level change, data is relatively static
    staleTime: 1000 * 60 * 5, 
  });
}

export function useLesson(id: number) {
  return useQuery({
    queryKey: [api.lessons.get.path, id],
    queryFn: async () => {
      if (isNaN(id)) return null;
      
      const url = buildUrl(api.lessons.get.path, { id });
      const res = await fetch(url, { credentials: "omit" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch lesson');
      
      const data = await res.json();
      return parseWithLogging(api.lessons.get.responses[200], data, "lessons.get");
    },
    enabled: !!id && !isNaN(id),
  });
}
