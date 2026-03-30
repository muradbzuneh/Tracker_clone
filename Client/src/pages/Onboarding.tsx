import {
  ArrowLeft,
  ArrowRight,
  PersonStanding,
  ScaleIcon,
  Target,
  User,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import type { ProfileFormData, UserData } from "../types";
import Input from "../assets/ui/Input";
import Button from "../assets/ui/Button";
import mockApi from "../assets/mockApi";
import { ageRanges, goalOptions } from "../assets/assets";
import Slider from "../assets/ui/Slider";

const Onboarding = () => {
  const [step, setStep] = useState(1);

  const { user, fetchUser, setOnboardingCompleted } = useAppContext();

  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  const totalSteps = 3;

  // ✅ Update field
  const updateField = (field: keyof ProfileFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // ✅ Next handler
  const handleNext = async () => {
    // Step 1 validation
    if (step === 1) {
      if (!formData.age || formData.age < 13 || formData.age > 150) {
        return toast.error("Age must be between 13–150");
      }
      setStep(step + 1);
      return;
    }

    // Step 2 validation
    if (step === 2) {
      if (!formData.weight || formData.weight < 35 || formData.weight > 150) {
        return toast.error("Weight must be between 35–150");
      }
      setStep(step + 1);
      return;
    }

    // Step 3 (submit)
    try {
      const userData: Partial<UserData> = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("fitnessUser", JSON.stringify(userData));

      await mockApi.user.update(user?.id || "", userData);

      toast.success("Profile updated successfully");

      setOnboardingCompleted(true);

      await fetchUser(localStorage.getItem("token") || "");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Toaster />

      <div className="onboarding-container">
        {/* Header */}
        <div className="p-6 pt-12 onboarding-wrapper">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <PersonStanding className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              FitTrack
            </h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 mt-4">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 mb-8 onboarding-wrapper">
          <div className="flex gap-2 max-w-2xl">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-slate-400 mt-3">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 onboarding-wrapper">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold">How old are you?</h2>

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(v) => updateField("age", v)}
                placeholder="Enter your age"
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your measurements</h2>

              <Input
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(v) => updateField("weight", v)}
              />

              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(v) => updateField("height", v)}
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your goal</h2>

              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>{
                    const age = Number(formData.age);
                    const range = ageRanges.find((r)=>age <= r.max) || ageRanges [ageRanges.length -1 ]

                    let intake = range.maintain;
                    let burn = range.burn;

                    if(option.value == 'lose'){
                      intake -=400;
                      burn += 100;
                    }else if (option.value == 'gain'){
                      intake +=500;
                      burn -=100;
                    }
                    setFormData({
                      ...formData,
                      goal:option.value as 'lose' | 'maintain' | 'gain',
                      dailyCalorieBurn:burn,
                      dailyCalorieIntake:intake
                    })
                  }}
                  className={`onboarding-option-btn ${
                    formData.goal === option.value
                   && "ring-2 ring-emerald-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>  
          )}
          
        </div>
          <div className="border-slate-200 dark:border-slate-700 my-6 max-w-lg">
            <div>
              <h3>Daily target</h3>
              <div>
                <div>
              <Slider label="Daily Calorie Intake" 
                min={120} max={4000} step={50} value={formData.dailyCalorieIntake} 
                onChange={(v) =>updateField ('dailyCalorieIntake', v)} unit="kcal" infoText="the total calories you plan to consume 
                each" />
                </div> 
            </div>
          </div>
              
        {/* Footer */}
        <div className="p-6 pb-10 onboarding-wrapper">
          <div className="flex gap-3 lg:justify-end">
            {step > 1 && (
              <Button
                variant="secondary"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft />
              </Button>
            )}

            <Button onClick={handleNext}>
              {step === totalSteps ? "Get Started" : "Continue"}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;