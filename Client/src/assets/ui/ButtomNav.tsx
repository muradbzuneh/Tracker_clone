import { NavLink } from "react-router-dom";
import {
  Home,
  Utensils,
  Activity,
  User,
} from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: Home },
    { path: "/food", icon: Utensils },
    { path: "/activity", icon: Activity },
    { path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0B1A2B] border-t border-[#1F2A3A] flex justify-around items-center py-2 md:hidden z-50">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition ${
                isActive ? "text-green-400" : "text-gray-400"
              }`
            }
          >
            <Icon size={22} />
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNav;