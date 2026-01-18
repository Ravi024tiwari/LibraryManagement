import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { persistor } from "@/store/store";

import {
  LayoutDashboard,
  BookOpen,
  History,
  AlertTriangle,
  LogOut
} from "lucide-react";

const StudentSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
      isActive
        ? "bg-amber-500 text-white shadow-sm"
        : "text-zinc-600 hover:bg-zinc-100"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-zinc-100 px-4 py-6 flex flex-col">
      
      {/* 🔹 Title */}
      <div className="mb-8 px-2">
        <h2 className="text-lg font-black text-zinc-900">
          Student Panel
        </h2>
        <p className="text-xs text-zinc-400">
          Library access dashboard
        </p>
      </div>

      {/* 🔹 Navigation */}
      <nav className="flex-1 space-y-1">
        <NavLink
          to="/student"
          end
          className={linkClass}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/student/current-issues"
          className={linkClass}
        >
          <BookOpen size={18} />
          Current Issues
        </NavLink>

        <NavLink
          to="/student/history"
          className={linkClass}
        >
          <History size={18} />
          Issue History
        </NavLink>

        <NavLink
          to="/student/fines"
          className={linkClass}
        >
          <AlertTriangle size={18} />
          Late Books & Fine
        </NavLink>
      </nav>

      {/* 🔹 Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default StudentSidebar;
