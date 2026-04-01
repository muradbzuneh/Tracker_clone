import { useEffect, useMemo, useState } from "react";
import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry, FoodEntry } from "../types";
import Card from "../assets/ui/Card";
import ProgressBar from "../assets/ui/ProgressBar";
import {
  Activity,
  FlameIcon,
  HamburgerIcon,
  Ruler,
  ScaleIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import CaloriesChart from "../assets/CaloriesChart";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext();

  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [todayActivity, setTodayActivity] = useState<ActivityEntry[]>([]);

  // ✅ Filter today's data
  useEffect(() => {
    const today = new Date().toDateString();

    setTodayFood(
      allFoodLogs.filter(
        (f) => new Date(f.date).toDateString() === today
      )
    );

    setTodayActivity(
      allActivityLogs.filter(
        (a) => new Date(a.date).toDateString() === today
      )
    );
  }, [allFoodLogs, allActivityLogs]);

  // ✅ Calculations
  const totalCalories = useMemo(
    () => todayFood.reduce((sum, f) => sum + f.calories, 0),
    [todayFood]
  );

  const totalBurned = useMemo(
    () => todayActivity.reduce((sum, a) => sum + a.caloriesBurned, 0),
    [todayActivity]
  );

  const totalActiveMinutes = useMemo(
    () => todayActivity.reduce((sum, a) => sum + a.duration, 0),
    [todayActivity]
  );

  const DAILY_CALORIE_LIMIT = user?.dailyCalorieIntake || 2000;
  const remainingCalories = DAILY_CALORIE_LIMIT - totalCalories;

  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIE_LIMIT
  );

  // ✅ BMI
  const bmi =
    user?.weight && user?.height
      ? user.weight / ((user.height / 100) ** 2)
      : null;

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { text: "Normal", color: "text-green-400" };
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-400" };
    return { text: "Obese", color: "text-red-400" };
  };

  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  return (
    <div className="page-container bg-[#07121E] min-h-screen text-white p-4 md:p-6 space-y-6">
      
      {/* HEADER */}
      <div className=" dashboard-header flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">
          Hi, {user?.name || "User"} 👋
        </h1>

        <div className="bg-[#12263A] px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-300">
          <span>{motivation.emoji}</span>
          <span>{motivation.text}</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CALORIES CARD */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-gray-300">
              <HamburgerIcon size={18} />
              <p className="text-sm">Calories Consumed</p>
            </div>
            <p className="text-xl font-semibold">{totalCalories}</p>
          </div>

          <ProgressBar value={200} max={400} />

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>
              {remainingCalories >= 0
                ? `${remainingCalories} kcal remaining`
                : `${Math.abs(remainingCalories)} kcal over`}
            </span>
            <span>
              {Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%
            </span>
          </div>

          {/* Burned */}
          <div className="mt-6 pt-4 border-t border-[#1F2A3A]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-gray-300">
                <FlameIcon size={18} />
                <p className="text-sm">Calories Burned</p>
              </div>
              <p className="font-semibold">{totalBurned}</p>
            </div>

            <ProgressBar
              value={totalBurned}
              max={user?.dailyCalorieBurn || 400}
            />
          </div>
        </Card>

        {/* SUMMARY CARD */}
        <Card>
          <h3 className="mb-4 text-sm text-gray-400">Today's Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Meals</span>
              <span>{todayFood.length}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Calories</span>
              <span>{totalCalories} kcal</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Active</span>
              <span>{totalActiveMinutes} min</span>
            </div>
          </div>
        </Card>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex flex-col gap-2">
            <Activity size={18} className="text-green-400" />
            <p className="text-lg font-semibold">{totalActiveMinutes}</p>
            <p className="text-xs text-gray-400">Active Minutes</p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <ZapIcon size={18} className="text-green-400" />
            <p className="text-lg font-semibold">{todayActivity.length}</p>
            <p className="text-xs text-gray-400">Workouts</p>
          </div>
        </Card>

        {user && (
          <Card>
            <div className="flex flex-col gap-2">
              <TrendingUpIcon size={18} className="text-green-400" />
              <p className="text-xs text-gray-400">Goal</p>
              <p className="font-semibold">
                {user.goal === "lose" && "🔥 Lose Weight"}
                {user.goal === "maintain" && "⚖️ Maintain"}
                {user.goal === "gain" && "💪 Gain Muscle"}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* BODY METRICS */}
      {user && (
        <Card>
          <h3 className="text-sm text-gray-400 mb-4">Body Metrics</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <ScaleIcon size={16} />
              <span>{user.weight} kg</span>
            </div>

            {user.height && (
              <div className="flex flex-col gap-1">
                <Ruler size={16} />
                <span>{user.height} cm</span>
              </div>
            )}

            {bmi && bmiStatus && (
              <div className="flex flex-col gap-1">
                <span>BMI</span>
                <span className={bmiStatus.color}>
                  {bmi.toFixed(1)} ({bmiStatus.text})
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* CHART */}
      <Card>
        <h3 className="mb-4 text-sm text-gray-400">Weekly Progress</h3>
        <CaloriesChart />
      </Card>
    </div>
  );
};

export default Dashboard;