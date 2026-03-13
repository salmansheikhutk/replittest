import { Link } from "wouter";
import { BookOpen, Trophy, Library, FlaskConical } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

export function Navbar() {
  const { progress } = useProgress();

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Fasaha<span className="text-primary">.</span>
            </span>
          </Link>

          <Link href="/glossary" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" data-testid="link-glossary">
            <Library className="w-4 h-4" />
            Glossary
          </Link>

          <Link href="/testing" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <FlaskConical className="w-4 h-4" />
            Testing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
            <Trophy className="w-4 h-4 text-accent fill-accent" />
            <span className="font-bold text-accent-foreground text-sm">
              {progress.xp} XP
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
