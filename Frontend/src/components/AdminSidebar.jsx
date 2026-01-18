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

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
     ${
       isActive
         ? "bg-amber-100 text-amber-700"
         : "text-zinc-600 hover:bg-zinc-100"
     }`;

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white px-4 py-6 flex flex-col">
      
      {/* Brand */}
      <div className="mb-8 px-2">
        <h2 className="text-xl font-black text-zinc-900">
          Library Admin
        </h2>
        <p className="text-xs text-zinc-400">
          Management Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/current/issues" className={linkClass}>
          <BookOpen size={18} />
          Current Issues
        </NavLink>

        <NavLink to="/admin/issue/history" className={linkClass}>
          <History size={18} />
          Issue History
        </NavLink>

        <NavLink to="/admin/issue/late/student" className={linkClass}>
          <AlertTriangle size={18} />
          Late Students
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
