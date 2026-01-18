import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar always on top */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
