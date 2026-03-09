import { Link } from "wouter";
import { Layers, AlignRight, ArrowRight, ChevronRight } from "lucide-react";

export function Home() {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Start your journey' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Build your foundation' },
    { id: 'advanced', label: 'Advanced', desc: 'Master the rules' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="bg-foreground text-background py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6">
            Master Arabic <br className="md:hidden"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Grammar & Morphology
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted/80 max-w-2xl mx-auto mb-10 font-medium">
            Learn Sarf and Nahw through bite-sized, interactive lessons designed to make complex rules simple and memorable.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Sarf Category Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Layers className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold">Sarf <span className="text-muted-foreground text-lg font-arabic font-normal">(صرف)</span></h2>
                <p className="text-muted-foreground mt-1">Morphology: The structure of words</p>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              {levels.map(level => (
                <Link key={level.id} href={`/learn/sarf/${level.id}`} className="block">
                  <div className="group flex items-center justify-between p-4 rounded-2xl border-2 border-border/50 hover:border-secondary hover:bg-secondary/5 transition-all cursor-pointer">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">{level.label}</h3>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Nahw Category Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <AlignRight className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold">Nahw <span className="text-muted-foreground text-lg font-arabic font-normal">(نحو)</span></h2>
                <p className="text-muted-foreground mt-1">Grammar: The structure of sentences</p>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              {levels.map(level => (
                <Link key={level.id} href={`/learn/nahw/${level.id}`} className="block">
                  <div className="group flex items-center justify-between p-4 rounded-2xl border-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{level.label}</h3>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
