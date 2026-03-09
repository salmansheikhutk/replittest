import { useParams, Link } from "wouter";
import { useLessons } from "@/hooks/use-lessons";
import { useProgress } from "@/hooks/use-progress";
import { ChevronLeft, Check, Lock, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryView() {
  const { category, level } = useParams<{ category: string; level: string }>();
  
  const { data: lessons, isLoading, error } = useLessons(category, level);
  const { isLessonComplete } = useProgress();

  if (!category || !level) return <div>Invalid URL</div>;

  const title = category.charAt(0).toUpperCase() + category.slice(1);
  const levelTitle = level.charAt(0).toUpperCase() + level.slice(1);
  const isSarf = category.toLowerCase() === 'sarf';
  const themeColor = isSarf ? 'secondary' : 'primary';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className={`bg-${themeColor}/10 border-b border-${themeColor}/20 py-8 px-4`}>
        <div className="max-w-3xl mx-auto">
          <Link href="/" className={`inline-flex items-center gap-2 text-sm font-semibold text-${themeColor} hover:underline mb-6`}>
            <ChevronLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">
            {title} <span className="text-muted-foreground font-normal text-2xl">({levelTitle})</span>
          </h1>
          <p className="text-muted-foreground">Follow the path below to master these concepts.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12 relative">
        {isLoading && (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6">
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                <div className="space-y-3 flex-1 pt-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center">
            Failed to load lessons. Please try again later.
          </div>
        )}

        {lessons && lessons.length === 0 && (
          <div className="text-center p-12 bg-muted/50 rounded-3xl border border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">We are working on adding content for this level.</p>
          </div>
        )}

        {lessons && lessons.length > 0 && (
          <div className="relative">
            {/* The Path Line */}
            <div className={`absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-${themeColor}/30 to-transparent z-0`} />

            <div className="space-y-8">
              {lessons.map((lesson, index) => {
                const isComplete = isLessonComplete(lesson.id);
                // For a real app we might lock future lessons, but per requirements it's free/accessible
                // We'll just style them differently if they aren't complete
                
                return (
                  <div key={lesson.id} className="flex gap-6 relative z-10 group">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-300
                        ${isComplete 
                          ? `bg-${themeColor} border-${themeColor} text-white shadow-${themeColor}/30` 
                          : `bg-card border-border text-muted-foreground group-hover:border-${themeColor}/50`
                        }
                      `}>
                        {isComplete ? <Check className="w-8 h-8" /> : <span className="font-bold text-xl">{index + 1}</span>}
                      </div>
                    </div>
                    
                    <Link href={`/lesson/${lesson.id}`} className="flex-1 block pt-2 outline-none">
                      <div className={`
                        p-6 rounded-2xl border-2 transition-all duration-300 
                        ${isComplete 
                          ? `bg-white border-${themeColor}/20 hover:border-${themeColor}/40 hover:shadow-md` 
                          : 'bg-white border-border hover:border-foreground/20 hover:shadow-md'
                        }
                      `}>
                        <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        {/* We don't have a short desc in schema, so we truncate content or just show a standard text */}
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          Learn about {lesson.title.toLowerCase()} and practice with interactive exercises.
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
