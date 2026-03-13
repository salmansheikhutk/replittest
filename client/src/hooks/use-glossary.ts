import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGlossaryTerms(category?: string) {
  return useQuery({
    queryKey: [api.glossary.list.path, category],
    queryFn: async () => {
      const url = new URL(api.glossary.list.path, window.location.origin);
      if (category) url.searchParams.append("category", category);

      const res = await fetch(url.toString(), { credentials: "omit" });
      if (!res.ok) throw new Error("Failed to fetch glossary terms");

      const data = await res.json();
      return data as Awaited<ReturnType<typeof api.glossary.list.responses[200]["parse"]>>;
    },
    staleTime: 1000 * 60 * 10,
  });
}
