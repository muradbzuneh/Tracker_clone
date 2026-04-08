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
import api from '../config/api.ts';


// 👉 Create context
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token')? false:true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setActivityLogs] = useState<ActivityEntry[]>([]);

  // ✅ SIGNUP
  const signup = async (Credentials: Credentials) => {

    try {

      const { data } = await api.post('/auth/local/register', Credentials);

    setUser({ ...data.user, token:data.jwt} );

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
    api.defaults.headers.common['Authorization'] =`Bearer ${data.jwt}`
  };

      
    } catch (error) {
      console.log(error)
    }
    
  // ✅ LOGIN
  const login = async (credential: Credentials) => {
    const { data } = await api.post('/auth/local',
      {identifire: credential.email, password: credential.password} );

    setUser({ ...data.user, token:data.jwt} );

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
    api.defaults.headers.common['Authorization'] =`Bearer ${data.jwt}`
  };

  // ✅ FETCH USER
  const fetchUser = async (_token: string) => {
    const { data } = await api.get('food-logs', {headers:{Authorization:`Bearer${_token}`}});

    setUser(data);

    if (data?.age && data?.weight && data?.goal) {
      setOnboardingCompleted(true);
    }

   api.defaults.headers.common['Authorization'] =`Bearer ${data.jwt}`
  };

  // ✅ FETCH FOOD LOGS
  const fetchFoodLogs = async (_token: string) => {
    const { data } = await api.get('/food-logs');
    setAllFoodLogs(data);
  };

  // ✅ FETCH ACTIVITY LOGS
  const fetchActivityLogs = async (_token: string) => {
    const { data } = await api.get('/activity-logs');
    setActivityLogs(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    api.defaults.headers.common['Authorization'] = '',
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