"use client";

import { useState } from "react";
import { signIn, signUp } from "../lib/auth-actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayedForm, setDisplayedForm] = useState<"login" | "register">(
    "login",
  );
  const [rotationCount, setRotationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTabSwitch = (newIsLogin: boolean) => {
    if (newIsLogin === isLogin) return;

    setIsFlipping(true);
    setError("");
    setRotationCount((prev) => prev + 1);

    // After half rotation (350ms), swap the form content
    setTimeout(() => {
      setDisplayedForm(newIsLogin ? "login" : "register");
    }, 350);

    // Complete flip animation
    setTimeout(() => {
      setIsFlipping(false);
      setIsLogin(newIsLogin);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn({
          data: {
            email,
            password,
          },
        });
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasUppercase || !hasLowercase || !hasNumber) {
          throw new Error(
            "Password must include an uppercase letter, a lowercase letter, and a number",
          );
        }

        await signUp({
          data: {
            email,
            password,
            name,
          },
        });
      }

      // Force a reload to update session state
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative pt-8">
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-12 -z-10 pointer-events-none overflow-hidden select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="text-[20vw] leading-[0.8] font-black tracking-tighter text-foreground/[0.02] dark:text-foreground/[0.015] -rotate-12 blur-md whitespace-nowrap"
          >
            MealMap
          </div>
        ))}
      </div>

      <div className="relative z-20 mx-8 mb-[-28px]">
        <div className="relative grid grid-cols-2 p-1 bg-secondary/50 backdrop-blur-[40px] rounded-xl border border-transparent dark:border-white/10 shadow-lg">
          <div
            className={cn(
              "absolute inset-y-1 w-[calc(50%-4px)] bg-background shadow-sm rounded-lg transition-all duration-300 ease-out",
              isLogin ? "left-1" : "left-[calc(50%)]",
            )}
          />
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={cn(
              "relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 text-center rounded-lg",
              isLogin
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={cn(
              "relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 text-center rounded-lg",
              !isLogin
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Regester
          </button>
        </div>
      </div>

      <div className="perspective-1000 mt-8 min-h-[560px] flex items-center">
        <div
          className="relative w-full transition-transform duration-700 ease-in-out transform-style-3d"
          style={{
            transform: `rotateX(${rotationCount * 360}deg)`,
          }}
        >
          <Card className="glass-card shadow-2xl">
            <CardContent className="pt-0">
              {displayedForm === "login" ? (
                <>
                  <div className="text-center py-6 border-b border-border/20">
                    <h2 className="text-2xl font-bold tracking-tight">Login</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input
                        id="email-login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-login">Password</Label>
                      <Input
                        id="password-login"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive font-medium text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 text-base mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Please wait..." : "Login"}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center py-6 border-b border-border/20">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Regester
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input
                        id="email-signup"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive font-medium text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 text-base mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Please wait..." : "Regester"}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
