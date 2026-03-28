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
  const [isUserFetched, setIsUserFetched] = useState(true);
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
  const login = async (credential: Credential) => {
    const { data } = await mockApi.auth.login(credential);

    setUser(data.user);

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
  };

  // ✅ FETCH USER
  const fetchUser = async (token: string) => {
    const { data } = await mockApi.user.me();

    setUser(data.user);

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    setIsUserFetched(true);
  };

  // ✅ FETCH FOOD LOGS
  const fetchFoodLogs = async (token: string) => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  // ✅ FETCH ACTIVITY LOGS
  const fetchActivityLogs = async (token: string) => {
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

  const value: AppContextType = {
    user,
    setUser,
    isUserFetched,
    signup,
    login,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
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