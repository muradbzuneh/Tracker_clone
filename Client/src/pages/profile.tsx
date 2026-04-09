import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { ProfileFormData } from "../types";
import Card from "../assets/ui/Card";
import { goalLabels, goalOptions } from "../assets/assets";
import { Calendar, Scale, Target, User2, LogOutIcon } from "lucide-react";
import Input from "../assets/ui/Input";
import Button from "../assets/ui/Button";
import toast from "react-hot-toast";
import api from "../config/api";
import type { AxiosError } from "axios";

const ProfilePage = () => {
  const { allActivityLogs, allFoodLogs, user, logout, fetchUser } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: user?.age || 0,
    weight: user?.weight || 0,
    height: user?.height || 0,
    goal: user?.goal || "maintain",
    dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
    dailyCalorieBurn: user?.dailyCalorieBurn || 400,
  });

  // ✅ Save — PUT /users/:id
  const handleSave = async () => {
    try {
      await api.put(`/users/${user?.id}`, formData);
      await fetchUser(user?.token || localStorage.getItem("token") || "");
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const msg = (error as AxiosError<{error:{message:string}}>)?.response?.data?.error?.message;
      toast.error(msg || "Failed to update profile");
    }
  };

  const totalFoodEntries = allFoodLogs?.length || 0;
  const totalActivities = allActivityLogs?.length || 0;

  if (!user) return null;

  return (
    <div className="page-container bg-[#07121E] min-h-screen text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-400 text-sm">Manage your settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Profile Info */}
        <Card className="space-y-4">
          <div className="flex items-center gap-4">
            <User2 className="w-10 h-10 text-emerald-500 bg-emerald-900 rounded-xl p-2" />
            <div>
              <h3 className="text-sm text-gray-400">{user.name || user.username}</h3>
              <p className="text-xs text-gray-500">
                Member since{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(v) => setFormData({ ...formData, age: Number(v) })}
                min={14}
                max={87}
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(v) => setFormData({ ...formData, weight: Number(v) })}
                min={45}
                max={150}
              />
              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(v) => setFormData({ ...formData, height: Number(v) })}
              />
              <Input
                label="Daily Calorie Intake (kcal)"
                type="number"
                value={formData.dailyCalorieIntake}
                onChange={(v) => setFormData({ ...formData, dailyCalorieIntake: Number(v) })}
              />
              <Input
                label="Daily Calorie Burn Target (kcal)"
                type="number"
                value={formData.dailyCalorieBurn}
                onChange={(v) => setFormData({ ...formData, dailyCalorieBurn: Number(v) })}
              />
              <select
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value as "lose" | "maintain" | "gain" })
                }
                className="w-full bg-[#12263A] p-2 rounded-lg text-white"
              >
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1 bg-emerald-500 text-black" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Age</p>
                  <p className="font-medium">{user.age ?? "—"} years</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Weight</p>
                  <p className="font-medium">{user.weight ?? "—"} kg</p>
                </div>
              </div>

              {(user.height ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <User2 className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Height</p>
                    <p className="font-medium">{user.height} cm</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Goal</p>
                  <p className="font-medium">{goalLabels[user.goal ?? "maintain"]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Daily Calorie Limit</p>
                  <p className="font-medium">{user.dailyCalorieIntake ?? 2000} kcal</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Daily Burn Target</p>
                  <p className="font-medium">{user.dailyCalorieBurn ?? 400} kcal</p>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full bg-emerald-500 text-black mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        {/* RIGHT: Stats */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0D1B2A] p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-500">{totalFoodEntries}</p>
              <p className="text-sm text-gray-400">Food Entries</p>
            </div>
            <div className="bg-[#0D1B2A] p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-500">{totalActivities}</p>
              <p className="text-sm text-gray-400">Activities</p>
            </div>
          </div>

          <Button
            variant="danger"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={logout}
          >
            <LogOutIcon />
            Logout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
