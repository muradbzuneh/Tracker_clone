import api from '../config/api';
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

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setActivityLogs] = useState<ActivityEntry[]>([]);

  // ✅ SIGNUP — POST /auth/local/register
  const signup = async (credentials: Credentials) => {
    try {
      const { data } = await api.post('/auth/local/register', {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });
      localStorage.setItem("token", data.jwt);
      setUser({ ...data.user, token: data.jwt });
      // new user never has profile data yet
      setOnboardingCompleted(false);
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error?.message || "Signup failed"
      );
    }
  };

  // ✅ LOGIN — POST /auth/local
  const login = async (credential: Credentials) => {
    try {
      const { data } = await api.post('/auth/local', {
        identifier: credential.email,
        password: credential.password,
      });
      localStorage.setItem("token", data.jwt);
      setUser({ ...data.user, token: data.jwt });
      if (data.user?.age && data.user?.weight && data.user?.goal) {
        setOnboardingCompleted(true);
      }
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error?.message || "Login failed"
      );
    }
  };

  // ✅ FETCH USER — GET /users/me
  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...data, token });
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
    } catch {
      // token invalid or expired — clear it
      localStorage.removeItem("token");
    } finally {
      setIsUserFetched(true);
    }
  };

  // ✅ FETCH FOOD LOGS — GET /food-logs (filtered by user in controller)
  const fetchFoodLogs = async () => {
    try {
      const { data } = await api.get('/food-logs');
      // controller returns array directly
      setAllFoodLogs(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setAllFoodLogs([]);
    }
  };

  // ✅ FETCH ACTIVITY LOGS — GET /activity-logs
  const fetchActivityLogs = async () => {
    try {
      const { data } = await api.get('/activity-logs');
      setActivityLogs(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setActivityLogs([]);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setActivityLogs([]);
    navigate("/");
  };

  // ✅ INIT — on mount, restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs();
        await fetchActivityLogs();
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};
