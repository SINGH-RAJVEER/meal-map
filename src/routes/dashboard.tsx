import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "../lib/session";
import { Button } from "../components/ui/button";
import { Utensils } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { user } = await getUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async () => {
    const { user } = await getUser();
    return { user };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useLoaderData();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="glass-card p-8 rounded-3xl">
            <h1 className="text-4xl font-bold">
              Welcome back, <span className="text-gradient">{user?.name}</span>!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Here's your MealMap overview
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Today's Calories
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-gradient mt-2">
                  0{" "}
                  <span className="text-2xl text-muted-foreground">/ 2000</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-0" />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  2000 calories remaining
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Weekly Average
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-gradient mt-2">
                  0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mt-2">
                  calories per day
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Meals Logged
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-gradient mt-2">
                  0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mt-2">
                  meals tracked
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  This week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Meals */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl">Recent Meals</CardTitle>
              <CardDescription className="text-base">
                Your latest food entries
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center flex flex-col items-center">
                <Utensils className="h-16 w-16 mb-4 text-muted-foreground stroke-1" />
                <p className="text-muted-foreground text-lg">
                  No meals logged yet. Start tracking your food!
                </p>
                <Button className="mt-6" size="lg">
                  Add Your First Meal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
