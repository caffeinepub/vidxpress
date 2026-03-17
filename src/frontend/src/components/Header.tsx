import { Button } from "@/components/ui/button";
import { Film, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          data-ocid="header.link"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Film className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-700 text-xl tracking-tight">
            <span className="text-gradient">Vid</span>
            <span className="text-foreground">Xpress</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              data-ocid="header.logout_button"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              data-ocid="header.login_button"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
