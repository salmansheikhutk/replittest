import { Link } from "wouter";
import { Layers, AlignRight, ChevronRight, BookOpen, Zap, Trophy } from "lucide-react";

export function Home() {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Start your journey', badge: '01' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Build your foundation', badge: '02' },
    { id: 'advanced', label: 'Advanced', desc: 'Master the rules', badge: '03' }
  ];

  const features = [
    { icon: BookOpen, label: 'Structured Lessons', desc: 'Step-by-step curriculum' },
    { icon: Zap, label: 'Interactive Quizzes', desc: 'Learn by doing' },
    { icon: Trophy, label: 'Track Progress', desc: 'Earn XP as you go' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1929 0%, #1a5f72 50%, #0a1929 100%)' }}>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glow spots */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        {/* Arabic watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden opacity-5">
          <span className="font-arabic-serif text-[28rem] font-bold text-white leading-none">بسم</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-8 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Classical Arabic · Made Simple
          </div>
          <h1 className="font-display text-5xl md:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Learn Arabic<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Grammar
            </span>
            <span className="text-white"> & </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Morphology
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mb-12 leading-relaxed">
            Master Sarf and Nahw through bite-sized interactive lessons — from complete beginner to advanced.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-6">Choose your path</p>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Sarf */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-secondary/40 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Sarf</h2>
                    <p className="text-white/40 text-xs">Morphology · Word structure</p>
                  </div>
                </div>
                <span className="font-arabic text-2xl text-white/20">صرف</span>
              </div>
              <div className="flex-1 space-y-2">
                {levels.map(level => (
                  <Link key={level.id} href={`/learn/sarf/${level.id}`} className="block">
                    <div className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-secondary/40 hover:bg-secondary/10 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-secondary/40 text-xs font-mono font-bold">{level.badge}</span>
                        <div>
                          <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{level.label}</p>
                          <p className="text-xs text-white/30">{level.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Nahw */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <AlignRight className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Nahw</h2>
                    <p className="text-white/40 text-xs">Grammar · Sentence structure</p>
                  </div>
                </div>
                <span className="font-arabic text-2xl text-white/20">نحو</span>
              </div>
              <div className="flex-1 space-y-2">
                {levels.map(level => (
                  <Link key={level.id} href={`/learn/nahw/${level.id}`} className="block">
                    <div className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-primary/40 text-xs font-mono font-bold">{level.badge}</span>
                        <div>
                          <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{level.label}</p>
                          <p className="text-xs text-white/30">{level.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
