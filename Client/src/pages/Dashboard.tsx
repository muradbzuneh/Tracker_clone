import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Card from "../assets/ui/Card";
import ProgressBar from "../assets/ui/ProgressBar";
import { Activity, FlameIcon, UtensilsIcon, Ruler, ScaleIcon, HeartPulseIcon, ZapIcon } from "lucide-react";
import CaloriesChart from "../assets/CaloriesChart";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs, today } = useAppContext();

  // derive today's data directly — no useState/useEffect needed
  const todayFood     = allFoodLogs.filter((f) => (f.createdAt?.split('T')[0] ?? f.date) === today);
  const todayActivity = allActivityLogs.filter((a) => (a.createdAt?.split('T')[0] ?? a.date) === today);

  const totalCalories     = todayFood.reduce((s, f) => s + f.calories, 0);
  const totalBurned       = todayActivity.reduce((s, a) => s + (a.calories || 0), 0);
  const totalActiveMinutes = todayActivity.reduce((s, a) => s + a.duration, 0);

  const DAILY_LIMIT  = user?.dailyCalorieIntake || 2000;
  const BURN_TARGET  = user?.dailyCalorieBurn   || 400;
  const netCalories  = totalCalories - totalBurned;
  const remaining    = DAILY_LIMIT - netCalories;

  const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_LIMIT);

  const bmi = user?.weight && user?.height
    ? user.weight / ((user.height / 100) ** 2)
    : null;

  const bmiStatus = bmi
    ? bmi < 18.5 ? { text: "Underweight", color: "text-blue-400"    }
    : bmi < 25   ? { text: "Normal",      color: "text-emerald-400" }
    : bmi < 30   ? { text: "Overweight",  color: "text-yellow-400"  }
    :              { text: "Obese",        color: "text-red-400"     }
    : null;

  const goalMap: Record<string, string> = {
    lose:     "🔥 Lose Weight",
    maintain: "⚖️ Maintain",
    gain:     "💪 Gain Muscle",
  };

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70 mb-1">Dashboard</p>
            <h1 className="text-2xl font-bold text-white">
              Hi, {user?.name || user?.username || "there"} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm self-start md:self-auto"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <span>{motivation.emoji}</span>
            <span className="text-emerald-300">{motivation.text}</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6">

        {/* ── Calorie Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Intake */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <UtensilsIcon size={15} className="text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Calories Consumed</span>
              </div>
              <span className="text-lg font-bold text-white">
                {totalCalories}
                <span className="text-xs text-slate-600 font-normal ml-1">/ {DAILY_LIMIT} kcal</span>
              </span>
            </div>
            <ProgressBar value={netCalories} max={DAILY_LIMIT} />
            <div className="flex justify-between mt-2.5 text-xs">
              <span className={remaining >= 0 ? "text-emerald-400" : "text-red-400"}>
                {remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over limit`}
              </span>
              <span className="text-slate-600">
                {Math.min(Math.round((netCalories / DAILY_LIMIT) * 100), 100)}%
              </span>
            </div>
          </Card>

          {/* Burned */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FlameIcon size={15} className="text-orange-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Calories Burned</span>
              </div>
              <span className="text-lg font-bold text-white">
                {totalBurned}
                <span className="text-xs text-slate-600 font-normal ml-1">/ {BURN_TARGET} kcal</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-[#1a2235]">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${Math.min((totalBurned / BURN_TARGET) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2.5 text-xs">
              <span className="text-slate-600">{totalActiveMinutes} active minutes</span>
              <span className="text-slate-600">
                {Math.min(Math.round((totalBurned / BURN_TARGET) * 100), 100)}%
              </span>
            </div>
          </Card>
        </div>

        {/* ── Stat Row ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Activity,     color: "text-emerald-400", bg: "bg-emerald-500/10", value: totalActiveMinutes, label: "Active min" },
            { icon: ZapIcon,      color: "text-yellow-400",  bg: "bg-yellow-500/10",  value: todayActivity.length, label: "Workouts" },
            { icon: UtensilsIcon, color: "text-blue-400",    bg: "bg-blue-500/10",    value: todayFood.length, label: "Meals" },
          ].map(({ icon: Icon, color, bg, value, label }) => (
            <Card key={label} className="text-center">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={15} className={color} />
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{label}</p>
            </Card>
          ))}
        </div>

        {/* ── Body Metrics + Summary ── */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <p className="section-label mb-4">Body Metrics</p>
              <div className="space-y-1">
                {[
                  { icon: ScaleIcon,      label: "Weight", value: `${user.weight ?? '—'} kg` },
                  { icon: Ruler,          label: "Height", value: `${user.height ?? '—'} cm` },
                  { icon: HeartPulseIcon, label: "BMI",    value: bmi ? bmi.toFixed(1) : '—', extra: bmiStatus?.text, extraColor: bmiStatus?.color },
                ].map(({ icon: Icon, label, value, extra, extraColor }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#1e2d42] last:border-0">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <Icon size={14} />
                      <span className="text-sm">{label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-200">{value}</span>
                      {extra && <span className={`ml-2 text-xs ${extraColor}`}>({extra})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className="section-label mb-4">Today's Summary</p>
              <div className="space-y-1">
                {[
                  { label: "Goal",         value: goalMap[user.goal ?? "maintain"] },
                  { label: "Net Calories", value: `${netCalories} kcal` },
                  { label: "Daily Limit",  value: `${DAILY_LIMIT} kcal` },
                  { label: "Burn Target",  value: `${BURN_TARGET} kcal` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#1e2d42] last:border-0">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Chart ── */}
        <Card>
          <p className="section-label mb-4">Weekly Progress</p>
          <CaloriesChart />
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
