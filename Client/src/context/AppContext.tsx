import mockApi from '../assets/mockApi.ts'
import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";

import type {
  AppContextType,
  User,
  Credentials,
  FoodEntry,
  ActivityEntry,
} from "../types/index.ts";


// 👉 Create context
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setActivityLogs] = useState<ActivityEntry[]>([]);

  // ✅ SIGNUP
  const signup = async (Credentials: Credentials) => {
    const { data } = await mockApi.auth.register(Credentials);

    setUser(data.user);

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
  };

  // ✅ LOGIN
  const login = async (credential: Credentials) => {
    const { data } = await mockApi.auth.login(credential);

    setUser(data.user);

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
  };

  // ✅ FETCH USER
  const fetchUser = async (_token: string) => {
    const { data } = await mockApi.user.me();

    setUser(data);

    if (data?.age && data?.weight && data?.goal) {
      setOnboardingCompleted(true);
    }

    setIsUserFetched(true);
  };

  // ✅ FETCH FOOD LOGS
  const fetchFoodLogs = async (_token: string) => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  // ✅ FETCH ACTIVITY LOGS
  const fetchActivityLogs = async (_token: string) => {
    const { data } = await mockApi.activityLogs.list();
    setActivityLogs(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    navigate("/");
  };

  // ✅ INIT LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    } else {
      setIsUserFetched(true);
    }
  }, []);
 const today = new Date().toISOString().split('T')[0];
  const value: AppContextType = {
    today,
    user,
    setUser,
    isUserFetched,
    signup,
    login,
    logout,
    fetchUser,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
    setAllActivityLogs: setActivityLogs,
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ✅ Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};