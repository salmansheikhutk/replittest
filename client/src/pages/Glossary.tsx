import { useState, useMemo } from "react";
import { useGlossaryTerms } from "@/hooks/use-glossary";
import { Search, BookOpenText, Layers, AlignRight, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: undefined, label: "All", icon: BookOpenText },
  { id: "sarf", label: "Sarf", icon: Layers },
  { id: "nahw", label: "Nahw", icon: AlignRight },
  { id: "general", label: "General", icon: Globe },
] as const;

const categoryColors: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  sarf: { border: "border-secondary/30", bg: "bg-secondary/5", text: "text-secondary", badge: "bg-secondary/15 text-secondary" },
  nahw: { border: "border-primary/30", bg: "bg-primary/5", text: "text-primary", badge: "bg-primary/15 text-primary" },
  general: { border: "border-muted-foreground/20", bg: "bg-muted/30", text: "text-muted-foreground", badge: "bg-muted text-muted-foreground" },
};

export function Glossary() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data: terms, isLoading } = useGlossaryTerms();

  const filtered = useMemo(() => {
    if (!terms) return [];
    let result = terms;
    if (activeCategory) {
      result = result.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.transliteration.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.arabicTerm.includes(search)
      );
    }
    return result;
  }, [terms, activeCategory, search]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-muted/30 border-b border-border py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-2" data-testid="text-glossary-title">
            Glossary
          </h1>
          <p className="text-muted-foreground">Key Arabic grammar terms and their definitions.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              data-testid="input-glossary-search"
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl border border-border">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.label}
                  data-testid={`button-filter-${cat.label.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpenText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1" data-testid="text-glossary-empty">No terms found</h3>
            <p className="text-muted-foreground text-sm">Try a different search or filter.</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(term => {
              const colors = categoryColors[term.category] || categoryColors.general;
              return (
                <div
                  key={term.id}
                  data-testid={`card-glossary-${term.id}`}
                  className={`p-5 rounded-2xl border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-foreground text-base">{term.term}</h3>
                      <p className={`text-xs font-medium ${colors.text}`}>{term.transliteration}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.badge}`}>
                      {term.category}
                    </span>
                  </div>
                  <p className="font-arabic text-xl text-foreground/80 mb-3 text-right" dir="rtl">
                    {term.arabicTerm}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
