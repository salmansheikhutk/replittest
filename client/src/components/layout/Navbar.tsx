import { Link } from "wouter";
import { BookOpen, Trophy, LogOut, User } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { progress } = useProgress();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    await apiRequest("POST", "/auth/logout");
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Fasaha<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
            <Trophy className="w-4 h-4 text-accent fill-accent" />
            <span className="font-bold text-accent-foreground text-sm" data-testid="text-xp">
              {progress.xp} XP
            </span>
          </div>

          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 transition-colors" data-testid="button-user-menu">
                      <Avatar className="w-7 h-7">
                        {user.profileImage ? (
                          <AvatarImage src={user.profileImage} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground font-medium hidden sm:inline" data-testid="text-username">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a
                  href="/auth/google"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 hover:bg-white/10 transition-colors text-sm text-foreground font-medium"
                  data-testid="button-sign-in"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
