import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { dailyStats, meals, foodItems } from "../db/schema";
import { and, eq, sql, gte } from "drizzle-orm";
import { getUser } from "./session";

// Helper to get today's date string YYYY-MM-DD
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export const getDashboardMetrics = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const today = getTodayString();

    // 1. Get Daily Stats (Water, etc.)
    let todayStats = await db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, user.id), eq(dailyStats.date, today)))
      .limit(1);

    if (todayStats.length === 0) {
      // Create if checks fail or just return default 0s, but creating ensures consistent record
      const [newStats] = await db
        .insert(dailyStats)
        .values({
          userId: user.id,
          date: today,
          waterIntake: 0,
          targetCalories: 2000,
        })
        .returning();
      todayStats = [newStats];
    }

    const stats = todayStats[0];

    // 2. Get Meals for Today to calc calories
    // Assuming 'meals.date' is stored as string 'YYYY-MM-DD' based on schema `date: date("date")`
    const todaysMeals = await db
      .select({
        id: meals.id,
        calories: sql<number>`sum(${foodItems.calories})`.mapWith(Number),
      })
      .from(meals)
      .leftJoin(foodItems, eq(meals.id, foodItems.mealId))
      .where(and(eq(meals.userId, user.id), eq(meals.date, today)))
      .groupBy(meals.id);

    const consumedCalories = todaysMeals.reduce(
      (acc, m) => acc + (m.calories || 0),
      0,
    );

    // 3. Get Weekly Average
    // Simple math: sum of last 7 days calories / 7
    // This requires a more complex query or multiple daily checks.
    // For now, let's keep it simple or mock it if queries get too complex for quick iteration.
    // Let's try to query meals from last 7 days.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split("T")[0];

    // We need sum of calories per day.
    const weeklyMeals = await db
      .select({
        date: meals.date,
        calories: sql<number>`sum(${foodItems.calories})`.mapWith(Number),
      })
      .from(meals)
      .leftJoin(foodItems, eq(meals.id, foodItems.mealId))
      .where(and(eq(meals.userId, user.id), gte(meals.date, sevenDaysStr)))
      .groupBy(meals.date);

    const weeklyTotal = weeklyMeals.reduce(
      (acc, m) => acc + (m.calories || 0),
      0,
    );
    const weeklyAvg = Math.round(weeklyTotal / 7);

    // 4. Meals Logged (This week)
    const mealsLoggedCount = weeklyMeals.length; // Actually this query groups by date.
    // We want total number of meal entries.
    const weeklyMealsCountRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(meals)
      .where(and(eq(meals.userId, user.id), gte(meals.date, sevenDaysStr)));
    const mealsLogged = Number(weeklyMealsCountRes[0]?.count || 0);

    // 5. Recent Meals list
    const recentMealsList = await db.query.meals.findMany({
      where: eq(meals.userId, user.id),
      orderBy: (meals, { desc }) => [desc(meals.createdAt)],
      limit: 5,
      with: {
        foodItems: true,
      },
    });
    // Transform for UI (calculate total calories per meal)
    const recentDisplay = recentMealsList.map((m) => ({
      id: m.id,
      name: m.name,
      date: m.date,
      calories: m.foodItems.reduce((sum, item) => sum + item.calories, 0),
      items: m.foodItems.length,
    }));

    return {
      waterIntake: stats.waterIntake,
      waterTarget: 8, // hardcoded target for now
      consumedCalories,
      targetCalories: stats.targetCalories,
      weeklyAvg,
      mealsLogged,
      recentMeals: recentDisplay,
    };
  },
);

export const updateWaterIntake = createServerFn({ method: "POST" })
  .inputValidator((data: { action: "increment" | "decrement" }) => data)
  .handler(async ({ data }) => {
    const { user } = await getUser();
    if (!user) throw new Error("Unauthorized");
    const today = getTodayString();

    // Optimistic update logic implies we trust the client to refetch or we return new value
    // We first need current value or atomic increment. Postgres supports atomic update.

    // Check if record exists
    const [existing] = await db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, user.id), eq(dailyStats.date, today)));

    if (!existing) {
      // Create it
      await db.insert(dailyStats).values({
        userId: user.id,
        date: today,
        waterIntake: data.action === "increment" ? 1 : 0,
      });
      return { success: true, newWater: data.action === "increment" ? 1 : 0 };
    }

    let newAmount =
      existing.waterIntake + (data.action === "increment" ? 1 : -1);
    if (newAmount < 0) newAmount = 0;

    await db
      .update(dailyStats)
      .set({ waterIntake: newAmount })
      .where(eq(dailyStats.id, existing.id));

    return { success: true, newWater: newAmount };
  });

export const addQuickMeal = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; calories: number }) => data)
  .handler(async ({ data }) => {
    const { user } = await getUser();
    if (!user) throw new Error("Unauthorized");
    const today = getTodayString();

    // Create Meal
    const [meal] = await db
      .insert(meals)
      .values({
        userId: user.id,
        name: data.name,
        date: today,
      })
      .returning();

    // Create Food Item
    await db.insert(foodItems).values({
      mealId: meal.id,
      name: data.name, // "Quick Add" usually means simple item
      calories: data.calories,
    });

    return { success: true };
  });
