import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry } from "../types";
import Card from "../assets/ui/Card";
import { quickActivities } from "../assets/assets";
import {
  ActivityIcon,
  DumbbellIcon,
  Loader2Icon,
  PlusIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import Input from "../assets/ui/Input";
import toast from "react-hot-toast";
import api from "../config/api";

const Activity = () => {
  const { allActivityLogs, setAllActivityLogs, today } = useAppContext();

  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load today's activities
  useEffect(() => {
    const todaysActivities = allActivityLogs.filter(
      (a) => (a.createdAt?.split("T")[0] ?? a.date) === today
    );
    setEntries(todaysActivities);
  }, [allActivityLogs, today]);

  const totalActiveMinutes = entries.reduce((sum, a) => sum + a.duration, 0);

  // ✅ Quick Add
  const handleQuick = (activity: { name: string; rate: number }) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate,
    });
    setShowForm(true);
  };

  // ✅ Duration change (auto calc calories)
  const handleDurationChange = (val: string | number) => {
    const duration = Number(val);
    const activity = quickActivities.find((a) => a.name === formData.name);
    const calories = activity ? duration * activity.rate : formData.calories;
    setFormData({ ...formData, duration, calories });
  };

  // ✅ Submit — POST /activity-logs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.duration <= 0) {
      return toast.error("Please enter valid data");
    }
    setLoading(true);
    try {
      const { data } = await api.post('/activity-logs', { data: formData });
      setAllActivityLogs((prev) => [...prev, data]);
      setFormData({ name: "", duration: 0, calories: 0 });
      setShowForm(false);
      toast.success("Activity added");
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete — DELETE /activity-logs/:documentId
  const handleDelete = async (documentId: string) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/activity-logs/${documentId}`);
      setAllActivityLogs((prev) => prev.filter((e) => e.documentId !== documentId));
      toast.success("Activity deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete activity");
    }
  };

  return (
    <div className="page-container bg-[#07121E] min-h-screen text-white p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Activity Log</h1>
          <p className="text-gray-400 text-sm">Track your workouts</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Active Today</p>
          <h3 className="text-green-400 text-lg font-semibold">{totalActiveMinutes} min</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-sm text-gray-400">Quick Add</h3>
              <div className="flex gap-2 flex-wrap">
                {quickActivities.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => handleQuick(a)}
                    className="px-3 py-1.5 bg-[#12263A] rounded-full text-sm hover:bg-green-500 hover:text-black transition"
                  >
                    {a.emoji} {a.name}
                  </button>
                ))}
              </div>
            </Card>

            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-500 text-black py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <PlusIcon size={16} /> Add Activity
            </button>

            {loading && (
              <div className="flex justify-center">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <Card>
            <h3 className="mb-4">New Activity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Activity Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: String(v) })}
              />
              <Input
                label="Duration (min)"
                type="number"
                value={formData.duration}
                onChange={handleDurationChange}
              />
              <Input
                label="Calories Burned"
                type="number"
                value={formData.calories}
                onChange={(v) => setFormData({ ...formData, calories: Number(v) })}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-600 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-black py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* RIGHT (LIST) */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <div className="text-center">
                <DumbbellIcon className="mx-auto mb-2" />
                <h3>No activity logged</h3>
                <p className="text-gray-400 text-sm">Start moving 💪</p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ActivityIcon />
                <h3>Today's Activity</h3>
              </div>
              <div className="space-y-2">
                {entries.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center bg-[#12263A] p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <TimerIcon size={16} />
                      <div>
                        <p>{a.name}</p>
                        <p className="text-xs text-gray-400">
                          {a.createdAt
                            ? new Date(a.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : a.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p>{a.duration} min</p>
                        <p className="text-xs text-gray-400">{a.calories} kcal</p>
                      </div>
                      <button onClick={() => handleDelete(a.documentId || "")}>
                        <Trash2Icon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-400 border-t border-[#1F2A3A] pt-3">
                <span>Total Active Time</span>
                <span>{totalActiveMinutes} min</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
