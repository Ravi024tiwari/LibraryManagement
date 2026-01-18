import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyIssueHistory } from "@/store/issueSlice";
import { motion } from "framer-motion";
import { Clock, BookOpen, Calendar, ChevronRight, History } from "lucide-react";

const StudentIssueHistory = () => {
  const dispatch = useDispatch();
  const { myIssueHistory } = useSelector((state) => state.issue.student);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/history`,
        { withCredentials: true }
      );
      dispatch(setMyIssueHistory(res.data.issues));
    };
    fetchHistory();
  }, [dispatch]);

  // Status Color Logic
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ISSUED": return "text-amber-600 bg-amber-50 border-amber-100";
      case "RETURNED": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "OVERDUE": return "text-rose-600 bg-rose-50 border-rose-100";
      default: return "text-zinc-500 bg-zinc-50 border-zinc-100";
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-8">
      {/* 🔹 Header Section */}
      <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            Issue History<span className="text-amber-500">.</span>
          </h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Chronological Archive of your borrowed volumes
          </p>
        </div>
      </div>

      {/* 🔹 List Container */}
      <div className="grid gap-4">
        {myIssueHistory && myIssueHistory.length > 0 ? (
          myIssueHistory.map((issue, index) => (
            <motion.div
              key={issue._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-100 rounded-[2rem] p-6 bg-white hover:border-amber-200 transition-all shadow-sm"
            >
              <div className="flex items-center gap-5">
                {/* Book Icon Wrapper */}
                <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500 shadow-inner">
                  <BookOpen size={24} />
                </div>

                <div>
                  <h3 className="font-black text-zinc-900 text-lg tracking-tight uppercase group-hover:text-amber-600 transition-colors">
                    {issue.book.title}
                  </h3>
                  
                  {/* Status Pill */}
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(issue.status)}`}>
                    <Clock size={10} />
                    {issue.status}
                  </div>
                </div>
              </div>

              {/* 📅 Date Section */}
              <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-50">
                <div className="flex flex-col sm:items-end">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={14} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Date Issued</span>
                  </div>
                  <p className="text-sm font-black text-zinc-600 mt-1">
                    {new Date(issue.issueDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Interactive Arrow */}
                <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 rounded-[3rem] text-zinc-300">
            <History size={48} strokeWidth={1} />
            <p className="mt-4 text-sm font-bold uppercase tracking-widest">Archive is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentIssueHistory;