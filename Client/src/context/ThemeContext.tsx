import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  secondary: string;
  border: string;
  danger: string;
  success: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors: ThemeColors = {
  background: "#F4F6F8",
  card: "#FFFFFF",
  text: "#1F2937",
  subtext: "#6B7280",
  primary: "#10B981", // green
  secondary: "#E5E7EB",
  border: "#D1D5DB",
  danger: "#EF4444",
  success: "#10B981",
};

const darkColors: ThemeColors = {
  background: "#020617", // deep navy
  card: "#0F172A",
  text: "#E2E8F0",
  subtext: "#94A3B8",
  primary: "#10B981",
  secondary: "#1E293B",
  border: "#334155",
  danger: "#EF4444",
  success: "#10B981",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      <div
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};