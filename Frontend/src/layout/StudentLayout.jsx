import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StudentSidebar from "../components/StudentSidebar.jsx";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      
      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Main Layout */}
      <div className="flex">
        
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block">
          <StudentSidebar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
