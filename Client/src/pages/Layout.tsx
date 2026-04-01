import { Outlet } from "react-router-dom";
import BottomNav from "../assets/ui/ButtomNav";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#07121E] text-white">
      
      {/* Sidebar (desktop only) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </div>

      {/* Bottom Nav (mobile only) */}
      <BottomNav />
    </div>
  );
};

export default Layout;