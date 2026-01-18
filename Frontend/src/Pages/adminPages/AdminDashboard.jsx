import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Users,
  BookOpen,
  AlertTriangle,
  Library,
  TrendingUp,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  fetchAdminSummaryStart,
  fetchAdminSummarySuccess,
  fetchAdminSummaryFailure,
  fetchAdminGrowthStart,
  fetchAdminGrowthSuccess,
  fetchAdminGrowthFailure
} from "@/store/adminSlice";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { summary, growth, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(fetchAdminSummaryStart());
        const summaryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/dashboard/summary`, { withCredentials: true });
        dispatch(fetchAdminSummarySuccess(summaryRes.data));

        dispatch(fetchAdminGrowthStart());
        const growthRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/dashboard/growth`, { withCredentials: true });
        dispatch(fetchAdminGrowthSuccess(growthRes.data));
      } catch (error) {
        dispatch(fetchAdminSummaryFailure(error.response?.data?.message || "Failed to load dashboard"));
        dispatch(fetchAdminGrowthFailure(error.response?.data?.message || "Failed to load growth data"));
      }
    };
    fetchDashboardData();
  }, [dispatch]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 sm:space-y-12 pb-10 px-4 sm:px-0">
      
      {/* 🔹 Header: Responsive Layout */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="border-l-4 border-amber-500 pl-4 sm:pl-6">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-1 sm:mb-2">
            Institutional Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 uppercase">
            Control Center<span className="text-amber-500">.</span>
          </h1>
        </div>
        <div className="inline-flex items-center self-start gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 shadow-xl shadow-zinc-200/50">
           <Activity size={12} className="text-amber-500 animate-pulse" />
           <span className="text-[9px] font-bold text-amber-100 uppercase tracking-widest">
             System Live • {new Date().toLocaleDateString()}
           </span>
        </div>
      </header>

      {/* 🔹 Golden Stat Cards: grid-cols-1 to 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Active Members" value={summary.totalStudents} icon={<Users size={22} />} trend="+12% Gain" color="gold" />
        <StatCard title="Total Volumes" value={summary.totalBooks} icon={<Library size={22} />} trend="Global Sync" color="gold" />
        <StatCard title="Circulation" value={summary.currentIssues} icon={<BookOpen size={22} />} trend="Active Now" color="gold" />
        <StatCard title="Overdue" value={summary.lateStudents} icon={<AlertTriangle size={22} />} danger trend="Action Req." color="rose" />
      </div>

      {/* 🔹 Analytical Charts: Full Width on Mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-10">
        
        <ChartWrapper title="Collection Growth" subtitle="Cumulative book archive analytics">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growth.booksGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="_id.month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#71717a'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#71717a'}} />
              <Tooltip content={<CustomTooltip />} cursor={{stroke: '#f59e0b', strokeWidth: 1}} />
              <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} fill="url(#colorGold)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Circulation Data" subtitle="Books issued per monthly cycle">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growth.issuesGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorZinc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="_id.month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#71717a'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#71717a'}} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#18181b" strokeWidth={3} fill="url(#colorZinc)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
};

/* 🔹 REUSABLE COMPONENTS */

const StatCard = ({ title, value, icon, danger, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className={`relative group overflow-hidden rounded-[2rem] border bg-white p-6 sm:p-7 shadow-xl shadow-zinc-200/50 transition-all ${
      danger ? "border-rose-100" : "border-zinc-100 hover:border-amber-200"
    }`}
  >
    <div className="flex justify-between items-start mb-6">
      {/* Golden Icon Container */}
      <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all ${
        danger 
          ? "bg-rose-50 text-rose-600" 
          : "bg-zinc-900 text-amber-500 group-hover:bg-amber-500 group-hover:text-white shadow-lg shadow-amber-200/20"
      }`}>
        {icon}
      </div>
      <ArrowUpRight size={18} className="text-zinc-300 group-hover:text-amber-500 transition-colors" />
    </div>
    
    <div>
      <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 mb-1">{value}</h2>
      <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
    </div>

    <div className={`mt-5 pt-4 border-t border-zinc-50 flex items-center gap-2`}>
       <TrendingUp size={12} className={danger ? "text-rose-500" : "text-amber-500"} />
       <span className="text-[10px] font-bold text-zinc-400">{trend}</span>
    </div>
  </motion.div>
);

const ChartWrapper = ({ title, subtitle, children }) => (
  <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-6 sm:p-8 shadow-sm">
    <div className="mb-6 sm:mb-8">
      <h3 className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-widest">{title}</h3>
      <p className="text-[10px] sm:text-xs text-zinc-400 mt-1">{subtitle}</p>
    </div>
    <div className="w-full">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10">
        <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">Period: {label}</p>
        <p className="text-sm font-black">Data: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const DashboardSkeleton = () => (
  <div className="space-y-10 animate-pulse px-4">
    <div className="h-16 w-1/2 bg-zinc-100 rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {[1,2,3,4].map(i => <div key={i} className="h-44 bg-zinc-50 rounded-[2rem]" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="h-72 bg-zinc-50 rounded-[2.5rem]" />
       <div className="h-72 bg-zinc-50 rounded-[2.5rem]" />
    </div>
  </div>
);

export default AdminDashboard;