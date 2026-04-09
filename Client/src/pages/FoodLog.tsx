import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { FoodEntry, FoodFormData } from "../types";
import Card from "../assets/ui/Card";
import {
  mealIcons,
  mealTypeOptions,
  quickActivitiesFoodLog,
  mealColors,
} from "../assets/assets";
import {
  Loader2Icon,
  PlusIcon,
  Sparkles,
  Trash2Icon,
  UtensilsCrossedIcon,
} from "lucide-react";
import Input from "../assets/ui/Input";
import toast from "react-hot-toast";
import api from "../config/api";
import type { AxiosError } from "axios";

const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs, today } = useAppContext();

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [formData, setFormData] = useState<FoodFormData>({
    name: "",
    calories: 0,
    mealType: "breakfast",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Load today's entries
  useEffect(() => {
    const todaysEntries = allFoodLogs.filter(
      (e) => (e.createdAt?.split("T")[0] ?? e.date) === today
    );
    setEntries(todaysEntries);
  }, [allFoodLogs, today]);

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);

  const groupedEntries = {
    breakfast: entries.filter((e) => e.mealType === "breakfast"),
    lunch: entries.filter((e) => e.mealType === "lunch"),
    dinner: entries.filter((e) => e.mealType === "dinner"),
    snack: entries.filter((e) => e.mealType === "snack"),
  };

  // ✅ Quick Add — pre-select meal type by time of day
  const handleQuick = (meal: string) => {
    setFormData({ ...formData, mealType: meal });
    setShowForm(true);
  };

  // ✅ Submit — POST /food-logs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.calories <= 0) {
      return toast.error("Please enter valid food data");
    }
    setLoading(true);
    try {
      const { data } = await api.post('/food-logs', { data: formData });
      setAllFoodLogs((prev) => [...prev, data]);
      setFormData({ name: "", calories: 0, mealType: "breakfast" });
      setShowForm(false);
      toast.success("Food entry added");
    } catch (error) {
      const msg = (error as AxiosError<{error:{message:string}}>)?.response?.data?.error?.message;
      toast.error(msg || "Failed to add food entry");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete — DELETE /food-logs/:documentId
  const handleDelete = async (documentId: string) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/food-logs/${documentId}`);
      setAllFoodLogs((prev) => prev.filter((e) => e.documentId !== documentId));
      toast.success("Entry deleted");
    } catch (error) {
      const msg = (error as AxiosError<{error:{message:string}}>)?.response?.data?.error?.message;
      toast.error(msg || "Failed to delete entry");
    }
  };

  // ✅ AI Image Analysis — POST /image-analysis
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const { data: result } = await api.post('/image-analysis', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const hour = new Date().getHours();
      let mealType: FoodFormData["mealType"] = "snack";
      if (hour >= 5 && hour < 12) mealType = "breakfast";
      else if (hour >= 12 && hour < 17) mealType = "lunch";
      else if (hour >= 17 && hour < 22) mealType = "dinner";

      const payload: FoodFormData = {
        name: result.name,
        calories: result.calories,
        mealType,
      };

      const { data: newEntry } = await api.post('/food-logs', { data: payload });
      setAllFoodLogs((prev) => [...prev, newEntry]);
      toast.success(`Added ${result.name} (${result.calories} kcal)`);
    } catch (error) {
      const msg = (error as AxiosError<{error:{message:string}}>)?.response?.data?.error?.message;
      toast.error(msg || "Image analysis failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="page-container bg-[#07121E] min-h-screen text-white p-4 space-y-6">

      {/* HEADER */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Food Log</h1>
          <p className="text-gray-400 text-sm">Track your daily intake</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Today's Total</p>
          <h3 className="text-green-400 text-lg font-semibold">{totalCalories} kcal</h3>
        </div>
      </div>

      <div className="page-content-grid grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-sm text-gray-400">Quick Add</h3>
              <div className="flex gap-2 flex-wrap">
                {quickActivitiesFoodLog.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => handleQuick(a.name.toLowerCase())}
                    className="px-3 py-1.5 bg-[#12263A] rounded-full text-sm hover:bg-green-500 hover:text-black transition"
                  >
                    {a.emoji} {a.name}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 bg-green-500 text-black py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <PlusIcon size={16} /> Add Food
              </button>

              <button
                onClick={() => inputRef.current?.click()}
                className="flex-1 bg-[#12263A] py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> AI Snap
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputRef}
              onChange={handleImageChange}
            />

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
            <h3 className="mb-4">New Food Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Food Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: String(v) })}
              />
              <Input
                label="Calories"
                type="number"
                value={formData.calories}
                onChange={(v) => setFormData({ ...formData, calories: Number(v) })}
              />
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                className="w-full bg-[#12263A] p-2 rounded-lg text-white"
              >
                {mealTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

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

        {/* RIGHT SIDE (LIST) */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <div className="text-center">
                <UtensilsCrossedIcon className="mx-auto mb-2" />
                <h3>No food logged</h3>
                <p className="text-gray-400 text-sm">Start tracking your meals</p>
              </div>
            </Card>
          ) : (
            Object.keys(groupedEntries).map((meal) => {
              const mealKey = meal as keyof typeof groupedEntries;
              const MealIcon = mealIcons[mealKey];
              const mealEntries = groupedEntries[mealKey];
              if (mealEntries.length === 0) return null;
              const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);

              return (
                <Card key={meal}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${mealColors[mealKey]}`}>
                        <MealIcon size={16} />
                      </div>
                      <div>
                        <h3 className="capitalize">{meal}</h3>
                        <p className="text-xs text-gray-400">{mealEntries.length} items</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{mealCalories} kcal</p>
                  </div>

                  <div className="space-y-2">
                    {mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-center bg-[#12263A] p-2 rounded-lg"
                      >
                        <div>
                          <p>{entry.name}</p>
                          <p className="text-xs text-gray-400">{entry.mealType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{entry.calories} kcal</span>
                          <button onClick={() => handleDelete(entry.documentId || "")}>
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
