import { Link } from "wouter";
import { Trophy, BookOpen, ChevronRight, CheckCircle2, Circle, BarChart3 } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useLessons } from "@/hooks/use-lessons";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: "sarf", label: "Sarf", arabicLabel: "صرف", description: "Morphology · Word structure", color: "secondary" },
  { id: "nahw", label: "Nahw", arabicLabel: "نحو", description: "Grammar · Sentence structure", color: "primary" },
] as const;

const levels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
] as const;

const colorMap = {
  primary: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    text: "text-primary",
    bar: "bg-primary",
    badge: "bg-primary/15 text-primary",
    hover: "hover:border-primary/50",
  },
  secondary: {
    border: "border-secondary/30",
    bg: "bg-secondary/5",
    text: "text-secondary",
    bar: "bg-secondary",
    badge: "bg-secondary/15 text-secondary",
    hover: "hover:border-secondary/50",
  },
};

function ProgressBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Progress() {
  const { progress, isLessonComplete } = useProgress();
  const { data: allLessons, isLoading } = useLessons();

  const totalLessons = allLessons?.length ?? 0;
  const completedCount = progress.completedLessonIds.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="font-display text-4xl font-extrabold text-foreground" data-testid="text-progress-title">
              My Progress
            </h1>
          </div>
          <p className="text-muted-foreground">Track your learning journey across all lessons.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">

        {/* Summary stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-accent fill-accent/30" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total XP</p>
              <p className="text-2xl font-extrabold text-foreground" data-testid="stat-xp">{progress.xp}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Lessons Done</p>
              {isLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-extrabold text-foreground" data-testid="stat-completed">
                  {completedCount} <span className="text-muted-foreground text-base font-semibold">/ {totalLessons}</span>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Overall</p>
              {isLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-extrabold text-foreground" data-testid="stat-overall">
                  {totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)}
                  <span className="text-muted-foreground text-base font-semibold">%</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Overall bar */}
        {!isLoading && totalLessons > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Overall completion</span>
              <span className="text-sm text-muted-foreground">{completedCount} of {totalLessons} lessons</span>
            </div>
            <ProgressBar value={completedCount} max={totalLessons} colorClass="bg-primary" />
          </div>
        )}

        {/* Per-category breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(cat => {
            const colors = colorMap[cat.color];
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all p-6 space-y-5`}
              >
                {/* Category header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`font-display text-xl font-bold text-foreground`}>{cat.label}</h2>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  <span className="font-arabic text-3xl text-muted-foreground/30">{cat.arabicLabel}</span>
                </div>

                {/* Per-level rows */}
                <div className="space-y-4">
                  {levels.map(lvl => {
                    const levelLessons = allLessons?.filter(l => l.category === cat.id && l.level === lvl.id) ?? [];
                    const levelCompleted = levelLessons.filter(l => isLessonComplete(l.id)).length;
                    const levelTotal = levelLessons.length;

                    return (
                      <div key={lvl.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {isLoading ? (
                              <Circle className="w-4 h-4 text-muted-foreground/30" />
                            ) : levelTotal > 0 && levelCompleted === levelTotal ? (
                              <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground/30" />
                            )}
                            <span className="text-sm font-semibold text-foreground">{lvl.label}</span>
                          </div>
                          {isLoading ? (
                            <Skeleton className="h-4 w-12" />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {levelCompleted} / {levelTotal}
                            </span>
                          )}
                        </div>
                        {isLoading ? (
                          <Skeleton className="h-2 w-full rounded-full" />
                        ) : (
                          <ProgressBar value={levelCompleted} max={levelTotal} colorClass={colors.bar} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Continue learning link */}
                <Link
                  href={`/learn/${cat.id}/beginner`}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.hover} transition-all group`}
                >
                  <span className={`text-sm font-semibold ${colors.text}`}>Continue learning</span>
                  <ChevronRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-0.5 transition-transform`} />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
