import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "../lib/session";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { AuthForms } from "../components/AuthForms";
import { FoodGridBackground } from "../components/FoodGridBackground";
import { Droplets } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const { user } = await getUser();
    return { user };
  },
});

function App() {
  const { user } = Route.useLoaderData();

  // Mock data for display
  const dailyTarget = 2400;
  const currentCalories = 1250;
  const macros = {
    protein: { current: 95, target: 180, label: "Protein" },
    carbs: { current: 140, target: 250, label: "Carbs" },
    fat: { current: 45, target: 80, label: "Fat" },
  };

  const mealSections = [
    {
      title: "Breakfast",
      calories: 450,
      items: ["Oatmeal & Berries", "Black Coffee"],
    },
    {
      title: "Lunch",
      calories: 650,
      items: ["Grilled Chicken Salad", "Apple"],
    },
    { title: "Dinner", calories: 0, items: [] },
    { title: "Snacks", calories: 150, items: ["Almonds"] },
  ];

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative isolate">
      <FoodGridBackground />
      <div className="container mx-auto px-4 max-w-2xl space-y-8">
        {/* Summary Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Daily Summary</h2>
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-end">
                <div>
                  <CardTitle className="text-4xl font-bold">
                    {currentCalories}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">
                    Calories Consumed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-muted-foreground">
                    / {dailyTarget}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dailyTarget - currentCalories} remaining
                  </p>
                </div>
              </div>
              {/* Main Progress Bar */}
              <div className="h-4 w-full bg-secondary mt-4 rounded-full overflow-hidden border border-border/10">
                <div
                  className="h-full bg-foreground rounded-full"
                  style={{
                    width: `${Math.min(
                      (currentCalories / dailyTarget) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-3 gap-8">
              {Object.entries(macros).map(([key, macro]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>{macro.label}</span>
                    <span>
                      {macro.current}/{macro.target}g
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/10">
                    <div
                      className="h-full bg-foreground/80 rounded-full"
                      style={{
                        width: `${Math.min(
                          (macro.current / macro.target) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Water Intake Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Water Intake</h2>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Hydration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  2000ml / 3000ml goal
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-1 h-12">
                {/* Create visual "glasses" or "blocks" for water */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm border ${
                      i < 5
                        ? "bg-foreground/80 border-foreground/80"
                        : "bg-transparent border-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                5 of 8 glasses consumed
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Nutrition / Meal Sections */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Nutrition</h2>
          </div>

          <div className="space-y-4">
            {mealSections.map((section) => (
              <Card key={section.title} className="glass-card">
                <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {section.title}
                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {section.calories} kcal
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-secondary rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                {section.items.length > 0 && (
                  <CardContent className="pb-4 pt-0">
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group cursor-default"
                        >
                          <span>{item}</span>
                          <span className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
