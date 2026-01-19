"use client";

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { signIn, signUp } from "../lib/auth-actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

export function AuthForms() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(signIn.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Failed to sign in");
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const response = await fetch(signUp.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Failed to sign up");
        }
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
            className="text-[20vw] leading-[0.8] font-black tracking-tighter text-foreground/5 dark:text-foreground/10 -rotate-12 blur-sm whitespace-nowrap"
          >
            MealMap
          </div>
        ))}
      </div>

      <div className="relative z-20 mx-8 mb-[-28px]">
        <div className="relative grid grid-cols-2 p-1 bg-secondary/50 backdrop-blur-md rounded-xl border border-transparent dark:border-white/10 shadow-lg">
          <div
            className={cn(
              "absolute inset-y-1 w-[calc(50%-4px)] bg-background shadow-sm rounded-lg transition-all duration-300 ease-out",
              isLogin ? "left-1" : "left-[calc(50%)]",
            )}
          />
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={cn(
              "relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 text-center rounded-lg",
              isLogin
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={cn(
              "relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 text-center rounded-lg",
              !isLogin
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sign Up
          </button>
        </div>
      </div>

      <Card className="glass-card shadow-2xl pt-8">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Enter your details to create a new account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}

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
              {isLoading
                ? "Please wait..."
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
