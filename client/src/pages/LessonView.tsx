import { useState } from "react";
import { useParams, Link } from "wouter";
import { useLesson } from "@/hooks/use-lessons";
import { ChevronLeft, BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Quiz } from "@/components/quiz/Quiz";
import { Skeleton } from "@/components/ui/skeleton";

export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const [mode, setMode] = useState<'learn' | 'practice'>('learn');
  
  const { data: lesson, isLoading, error } = useLesson(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="space-y-4 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4 opacity-20" />
        <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
        <p className="text-muted-foreground mb-6">This lesson might have been moved or doesn't exist.</p>
        <Link href="/" className="text-primary font-semibold hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Navigation Bar */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link 
            href={`/learn/${lesson.category}/${lesson.level}`}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            العودة إلى المسار
          </Link>
          
          <div className="flex bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setMode('learn')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === 'learn' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BookOpen className="w-4 h-4" />
              تعلّم
            </button>
            <button 
              onClick={() => setMode('practice')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === 'practice' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <GraduationCap className="w-4 h-4" />
              تمرين
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        {mode === 'learn' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {lesson.category} • {lesson.level}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                {lesson.title}
              </h1>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10 lg:p-12 prose prose-lg prose-slate max-w-none">
              {/* Using prose for automatic beautiful typography formatting of markdown/text */}
              {/* Adding specific arabic classes to paragraphs that might contain arabic text */}
              <div className="font-sans leading-relaxed text-foreground/90 [&_p[dir='rtl']]:font-arabic-serif [&_p[dir='rtl']]:text-2xl [&_p[dir='rtl']]:leading-loose">
                <ReactMarkdown>
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMode('practice');
                }}
                className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-6 h-6" />
                ابدأ التمرين
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 pt-8">
            <Quiz 
              lessonId={lesson.id} 
              exercises={lesson.exercises || []} 
              onComplete={() => {
                // Could automatically redirect or show extra UI
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
