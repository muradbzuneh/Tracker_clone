import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UtensilsIcon,
  ActivityIcon,
  UserIcon,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/food", label: "Food", icon: UtensilsIcon },
    { path: "/activity", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];

  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="h-screen w-64 bg-[#0B1A2B] text-white flex flex-col justify-between p-4">
      
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-green-500 p-2 rounded-lg">
            <ActivityIcon size={18} />
          </div>
          <h1 className="text-lg font-semibold">FitTrack</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-[#12263A] text-green-400"
                      : "text-gray-400 hover:bg-[#12263A] hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-400 hover:bg-[#12263A] hover:text-white transition"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;