import { Outlet } from "react-router-dom";
import BottomNav from "../assets/ui/ButtomNav";
import Sidebar from "./Sidebar";

const Layout = () => (
  <div className="layout-container">
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
    <BottomNav />
  </div>
);

export default Layout;
