import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User, Weight } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/AppContext"
import type { ProfileFormData, UserData } from "../types"
import Input from "../assets/ui/Input"
import Button from "../assets/ui/Button"
import mockApi from "../assets/mockApi"


const Onboarding = () => {
  const [step, setStep] = useState(1)
  const {user,fetchUser, setOnboardingCompleted, onboardingCompleted, isUserFetched} = useAppContext()
  const [formData, setFormData] = useState<ProfileFormData>({
    age:0,
    weight:0,
    height:0,
    goal:'maintain',
    dailyCalorieIntake:2000,
    dailyCalorieBurn:400
  })
  const totalsteps =3

  const updateField = (field: keyof ProfileFormData, value: string | number) =>{
  setFormData({...formData, [field]: value})
  }
const handlenext = async ()=>{
  if(step === 1){
    if(!formData.age || Number(formData.age) < 13 || Number(formData) > 150){
      return toast("The age must be between 13-150")
    }
  }
 if (step < totalsteps){
  setStep(step+1)
 }
 else{
  const userData = {
    ...formData, age: formData.age,
    Weight: formData.weight,
    height:formData.height,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('fitnessUser', JSON.stringify(userData))
  await mockApi.user.update(user?.id|| "", userData as unknown as Partial <UserData>)
  toast.success('profile updated successfully')
  setOnboardingCompleted(true)
  fetchUser(user?.token || "")
 }
}
  return (
    <>
    <Toaster />
    <div className="onboarding-container">
      <div className="p-6 pt-12 onboarding-wrapper">
        <div className="flex items-center gap-3 mb-2 ">
          <div className="w-10 h-10 rounded-xl bg-emerald-600
           flex items-center justify=center">
            <PersonStanding className="w-6 h-6 text-white"/>
          </div>
          <h1 className="text=2xl font-bold text-slate-800
          dark:text-white">FitTrack</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-4">
        Let's personalize Your expriance</p>
      </div> 

      <div className="px-6 mb-8 onboarding-wrapper">
        <div className="flex gap-2 max-w-2xl">
          {[1,2,3].map((s)=>
          <div key={s} className={`h-1.5 flex-1 rounded-full
           transition-all duration-300 ${s <= step? "bg-emerald-500":"bg-slate-200 dark:bg-slate-800"}`} >
           </div>)}
        </div>
        <p className="text-sm text-slate-300 mt-3"> 
          step {step} of {totalsteps}</p>
      </div>
      
      <div className="flex-1 px-6 onboarding-wrapper">
        {step === 1 &&(
          <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="size-12 rounded-xl bg-emerald-500 
            dark:bg-emerald-800 border border-emerald-100 flex items-center justify-center">
              <User className="size-6 text-emerald-500
             dark:text-emerald-300"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800
              dark:text-white">How old are you?</h2>
            <p className="text-slate-500 dark:text-slate-400
            text-sm">This helps us calculate Your needs</p> 
            </div>     
          </div>
          <Input label="Age" type="number" className="max-w-2xl" value={formData.age}
          onChange={()=>updateField('age', v)} placeholder="Enter your age"
          min={13} max={120} required />
          </div>
        )}

      {step === 2 &&(
          <div className="space-y-6 onboarding-wrapper">
          <div className="flex items-center gap-4 mb-8">

            <div className="size-12 rounded-xl bg-emerald-500 
            dark:bg-emerald-800 border border-emerald-100 flex items-center justify-center">
              <ScaleIcon className="size-6 text-emerald-500
             dark:text-emerald-300"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800
              dark:text-white">Your meansurments</h2>
            <p className="text-slate-500 dark:text-slate-400
            text-sm">helps us to track Your progress</p> 
            </div>     
          </div>
          <div className="flex flex-col gap-4 max-w-2xl">
         <Input label="weight (kg)" type="number" className="max-w-2xl" value={formData.weight}
          onChange={()=>updateField('weight', v)} placeholder="Enter your weight"
          min={35} max={120} required />

          <Input label="height (cm)" type="number" className="max-w-2xl" value={formData.height}
          onChange={()=>updateField('height', v)} placeholder="Enter your height"
          min={80} max={250}  />
          </div>
          </div>
      )}

      {step === 3 &&(
          <div className="space-y-6 onboarding-wrapper">
          <div className="flex items-center gap-4 mb-8">

            <div className="size-12 rounded-xl bg-emerald-500 
            dark:bg-emerald-800 border border-emerald-100 flex items-center justify-center">
              <Target className="size-6 text-emerald-500
             dark:text-emerald-300"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800
              dark:text-white">What is your goal</h2>
            <p className="text-slate-500 dark:text-slate-400
            text-sm">we'll teilor your expriance</p> 
            </div>     
          </div>
        </div>
      )} 
      </div>
      <div className="p-6 pb-10 onboarding-wrapper">
        <div className="flex gap-3 lg:justify-end">
         {step > 1 && (
            <Button variant ="secondary" onClick = {()=>setStep(step > 1 ? step - 1:1)}
             className="max-lg:flex-1 lg-px-10">
              <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              </span>
            </Button>
          )}

           {step > 1 && (
            <Button variant ="secondary" onClick = {handlenext}
             className="max-lg:flex-1 lg-px-10">
              <span className="flex items-center justify-center gap-2">
                {step === totalsteps ? 'Get Started':'continue'}
              <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          )}
        </div>
      </div>
  
    </div>
    </>
  )
}

export default Onboarding