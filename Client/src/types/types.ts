// types.ts

export type User = {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  weight?: number;
  goal?: string;
};

export type Credential = {
  email: string;
  password: string;
};

export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  date: string;
};

export type ActivityEntry = {
  id: string;
  activity: string;
  duration: number; // in minutes
  caloriesBurned: number;
  date: string;
};

// 👉 Context type (VERY IMPORTANT)
export type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;

  isUserFetched: boolean;

  signup: (credential: Credential) => Promise<void>;
  login: (credential: Credential) => Promise<void>;
  logout: () => void;

  onboardingCompleted: boolean;
  setOnboardingCompleted: (value: boolean) => void;

  allFoodLogs: FoodEntry[];
  setAllFoodLogs: (logs: FoodEntry[]) => void;

  allActivityLogs: ActivityEntry[];
};