import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "../lib/session";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { AuthForms } from "../components/AuthForms";
import { FoodGridBackground } from "../components/FoodGridBackground";
import { Droplets } from "lucide-react";
import { CircularProgress } from "../components/ui/circular-progress";
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
      <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-8">
        {/* Summary Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Daily Summary</h2>
          <Card className="glass-card overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_80px_-50px_rgba(255,255,255,0.35)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">Today</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <CircularProgress
                    value={currentCalories}
                    max={dailyTarget}
                    size={180}
                    strokeWidth={12}
                    label={currentCalories}
                    subLabel={`/ ${dailyTarget}`}
                    className="text-foreground w-44 h-44 rounded-full ring-1 ring-black/20 dark:ring-white/20"
                    trackClassName="text-black/20 stroke-black/25 dark:text-white/15 dark:stroke-white/20"
                    circleClassName="text-black stroke-black dark:text-white dark:stroke-white drop-shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
                    labelClassName="text-3xl"
                  />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Calories Consumed
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  {Object.entries(macros).map(([key, macro]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                      <CircularProgress
                        value={macro.current}
                        max={macro.target}
                        size={110}
                        strokeWidth={10}
                        label={`${macro.current}g`}
                        subLabel={`/ ${macro.target}g`}
                        className="text-foreground w-28 h-28 rounded-full ring-1 ring-black/20 dark:ring-white/20"
                        trackClassName="text-black/20 stroke-black/25 dark:text-white/15 dark:stroke-white/20"
                        circleClassName="text-black stroke-black dark:text-white dark:stroke-white drop-shadow-[0_0_6px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"
                        labelClassName="text-lg"
                      />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {macro.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="h-px w-full bg-white/10" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Water Intake Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Water Intake</h2>
            <Card className="glass-card border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_-45px_rgba(255,255,255,0.3)]">
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
                <Card
                  key={section.title}
                  className="glass-card border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_-45px_rgba(255,255,255,0.3)]"
                >
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
    </div>
  );
}
