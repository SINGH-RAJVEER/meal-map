"use client";

import { Link } from "@tanstack/react-router";
import { signOut, useSession } from "../lib/auth-client";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderClientProps {
  user?: never;
}

export function HeaderClient(_props: HeaderClientProps) {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-foreground/10">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl tracking-tight">
            MealMap
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user && (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                {user.name}
              </span>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await signOut();
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
