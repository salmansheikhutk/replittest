import { Link } from "wouter";
import { Layers, AlignRight, ChevronRight, BookOpen, Zap, Trophy } from "lucide-react";

export function Home() {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Start your journey', badge: '1' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Build your foundation', badge: '2' },
    { id: 'advanced', label: 'Advanced', desc: 'Master the rules', badge: '3' }
  ];

  const features = [
    { icon: BookOpen, label: 'Structured Lessons', desc: 'Step-by-step curriculum' },
    { icon: Zap, label: 'Interactive Quizzes', desc: 'Learn by doing' },
    { icon: Trophy, label: 'Track Progress', desc: 'Earn XP as you go' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />
        {/* Subtle Arabic calligraphy watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-arabic-serif text-[20rem] font-bold text-white/[0.04] leading-none">ع</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Classical Arabic · Made Simple
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Master Arabic<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-accent">
              Grammar & Morphology
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn Sarf and Nahw through bite-sized, interactive lessons designed to make complex rules simple and memorable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/50">
            <span>Sarf · Morphology</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Nahw · Grammar</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Beginner to Advanced</span>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-3 divide-x divide-border">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 px-4 first:pl-0 last:pr-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="font-display text-2xl font-bold text-center mb-2">Choose your path</h2>
        <p className="text-muted-foreground text-center mb-10">Pick a subject and a level to begin</p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Sarf */}
          <div className="group/card bg-card rounded-3xl border border-border shadow-sm hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-2 bg-gradient-to-r from-secondary to-blue-400" />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Layers className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Sarf <span className="text-muted-foreground text-base font-arabic font-normal ml-1">صرف</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">Morphology · The structure of words</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {levels.map(level => (
                  <Link key={level.id} href={`/learn/sarf/${level.id}`} className="block">
                    <div className="group flex items-center justify-between p-4 rounded-2xl border border-border hover:border-secondary/60 hover:bg-secondary/5 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">{level.badge}</span>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-secondary transition-colors">{level.label}</p>
                          <p className="text-xs text-muted-foreground">{level.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Nahw */}
          <div className="group/card bg-card rounded-3xl border border-border shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-2 bg-gradient-to-r from-primary to-emerald-400" />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <AlignRight className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Nahw <span className="text-muted-foreground text-base font-arabic font-normal ml-1">نحو</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">Grammar · The structure of sentences</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {levels.map(level => (
                  <Link key={level.id} href={`/learn/nahw/${level.id}`} className="block">
                    <div className="group flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/60 hover:bg-primary/5 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{level.badge}</span>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{level.label}</p>
                          <p className="text-xs text-muted-foreground">{level.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
