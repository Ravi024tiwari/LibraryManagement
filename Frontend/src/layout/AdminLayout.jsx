import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      
      {/* 🔝 Top Navbar */}
      <Navbar />

      {/* 🔽 Body */}
      <div className="flex flex-1">
        
        {/* ⬅️ Sidebar */}
        <AdminSidebar />

        {/* ➡️ Main Content */}
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
