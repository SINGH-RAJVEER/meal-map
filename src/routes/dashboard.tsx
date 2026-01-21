import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { getUser } from "../lib/session";
import {
  getDashboardMetrics,
  updateWaterIntake,
  addQuickMeal,
} from "../lib/dashboard-actions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Utensils, Droplets, Flame, Plus, Minus, X } from "lucide-react";
import { CircularProgress } from "../components/ui/circular-progress";
import { useState, useTransition } from "react";
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
    const metrics = await getDashboardMetrics();
    return { user, metrics };
  },
  component: DashboardPage,
});

function AddMealModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;

    await addQuickMeal({
      name,
      calories: parseInt(calories),
    });

    startTransition(() => {
      router.invalidate();
      onClose();
      setName("");
      setCalories("");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background glass-card w-full max-w-md rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Quick Meal</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Oatmeal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="e.g., 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user, metrics } = Route.useLoaderData();
  const router = useRouter();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);

  const handleWaterUpdate = async (action: "increment" | "decrement") => {
    await updateWaterIntake({ action });
    router.invalidate();
  };

  return (
    <div className="min-h-screen pt-16">
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
      />

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
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <Card className="hover:scale-105 transition-all duration-300 min-w-0">
              <CardHeader className="p-4 md:p-6">
                <CardDescription className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Nutrition
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold mt-1">
                  Calories
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-2 md:py-4 p-4 md:p-6 pt-0 md:pt-0">
                <CircularProgress
                  value={metrics.consumedCalories}
                  max={metrics.targetCalories}
                  size={120}
                  strokeWidth={10}
                  label={metrics.consumedCalories}
                  subLabel={`/ ${metrics.targetCalories}`}
                  className="text-primary w-28 h-28 md:w-36 md:h-36"
                  labelClassName="text-xl md:text-3xl"
                />
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 min-w-0">
              <CardHeader className="p-4 md:p-6 pb-0 md:pb-6">
                <CardDescription className="text-sm font-medium flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Hydration
                </CardDescription>
                <CardTitle className="text-lg md:text-xl font-bold mt-1">
                  Water
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-2 md:py-4 p-4 md:p-6 pt-0 md:pt-0">
                <CircularProgress
                  value={metrics.waterIntake}
                  max={metrics.waterTarget}
                  size={120}
                  strokeWidth={10}
                  label={metrics.waterIntake}
                  subLabel={`/ ${metrics.waterTarget} cups`}
                  className="text-primary w-28 h-28 md:w-36 md:h-36 mb-4"
                  labelClassName="text-xl md:text-3xl"
                />
                <div className="flex items-center gap-4 z-10">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full border-2"
                    onClick={() => handleWaterUpdate("decrement")}
                    disabled={metrics.waterIntake <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleWaterUpdate("increment")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardDescription className="text-sm font-medium">
                  Weekly Average
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-gradient mt-2">
                  {metrics.weeklyAvg}
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
                  {metrics.mealsLogged}
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
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Meals</CardTitle>
                <CardDescription className="text-base">
                  Your latest food entries
                </CardDescription>
              </div>
              {metrics.recentMeals.length > 0 && (
                <Button onClick={() => setIsAddMealOpen(true)}>Add Meal</Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {metrics.recentMeals.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Utensils className="h-16 w-16 mb-4 text-muted-foreground stroke-1" />
                  <p className="text-muted-foreground text-lg">
                    No meals logged yet. Start tracking your food!
                  </p>
                  <Button
                    className="mt-6"
                    size="lg"
                    onClick={() => setIsAddMealOpen(true)}
                  >
                    Add Your First Meal
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {metrics.recentMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Utensils className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(meal.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {meal.calories} kcal
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {meal.items} item{meal.items !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
