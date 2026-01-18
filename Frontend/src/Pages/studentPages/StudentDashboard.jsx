import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setMyCurrentIssues,
  setMyIssueHistory,
  setMyFine,
  setIssueLoading
} from "@/store/issueSlice";
import { motion } from "framer-motion";

import {
  BookOpen,
  History,
  IndianRupee,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const { myCurrentIssues, myIssueHistory, myFineSummary } =
    useSelector((state) => state.issue.student);

  useEffect(() => {
    const fetchDashboard = async () => {
      dispatch(setIssueLoading(true));
      try {
        const [current, history, fine] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/issues`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/history`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/fines`, { withCredentials: true })
        ]);

        dispatch(setMyCurrentIssues(current.data));
        dispatch(setMyIssueHistory(history.data.issues));
        dispatch(setMyFine(fine.data));
      } finally {
        dispatch(setIssueLoading(false));
      }
    };

    fetchDashboard();
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-10 py-8 lg:py-12 space-y-8 sm:space-y-10">
      
      {/* 🔹 Compact Institutional Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-amber-500 pl-4 sm:pl-5">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-600 mb-1">Archive Member</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            Dashboard<span className="text-amber-500">.</span>
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
           <Activity size={10} className="text-amber-500 animate-pulse" />
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
             Syncing Live
           </span>
        </div>
      </header>

      {/* 🔹 Smaller Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard
          title="Active Volumes"
          value={myCurrentIssues.length}
          icon={<BookOpen size={18} />}
          accent="amber"
          subtitle="Currently held"
        />

        <DashboardCard
          title="Total Borrows"
          value={myIssueHistory.length}
          icon={<History size={18} />}
          accent="zinc"
          subtitle="Lifetime chronicle"
        />

        <DashboardCard
          title="Archive Dues"
          value={`₹${myFineSummary.totalFine || 0}`}
          icon={<IndianRupee size={18} />}
          accent="rose"
          subtitle="Pending settlement"
        />
      </div>

      {/* 🔹 Slim Notification Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-zinc-900 p-4 sm:p-6 flex items-center gap-4 relative overflow-hidden group shadow-xl"
      >
        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-amber-500">
           <ShieldCheck size={20} />
        </div>
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Note to Member</h3>
          <p className="text-xs text-zinc-400">Ensure volumes are returned by the dusk of the due date.</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] text-6xl font-black text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           AETHEL
        </div>
      </motion.div>
    </div>
  );
};

/* ======================
   Compact Reusable Card
====================== */
const DashboardCard = ({ title, value, icon, accent, subtitle }) => {
  const accentConfigs = {
    amber: "hover:border-amber-200 shadow-amber-500/5",
    zinc: "hover:border-zinc-300 shadow-zinc-500/5",
    rose: "hover:border-rose-200 shadow-rose-500/5"
  };

  const iconColors = {
    amber: "bg-zinc-900 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
    zinc: "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 sm:p-6 shadow-lg transition-all duration-500 ${accentConfigs[accent]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md ${iconColors[accent]}`}>
          {icon}
        </div>
        <ArrowUpRight size={14} className="text-zinc-200 group-hover:text-zinc-900 transition-colors" />
      </div>

      <div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 mb-1">{value}</h2>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
        
        <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center gap-1.5">
           <TrendingUp size={10} className={accent === 'rose' ? 'text-rose-400' : 'text-amber-500'} />
           <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>

      {/* Subtle indicator bar */}
      <div className={`absolute top-0 right-0 h-0.5 w-0 transition-all duration-700 group-hover:w-full ${accent === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`} />
    </motion.div>
  );
};

export default StudentDashboard;