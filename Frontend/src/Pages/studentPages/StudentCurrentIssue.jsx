import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyCurrentIssues } from "@/store/issueSlice";
import { motion } from "framer-motion";
import { Book, Clock, Calendar, AlertCircle, ArrowUpRight, Library } from "lucide-react";

const StudentCurrentIssue = () => {
  const dispatch = useDispatch();
  const { myCurrentIssues } = useSelector(
    (state) => state.issue.student
  );

  useEffect(() => {
    const fetchCurrentIssues = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/issues`,
        { withCredentials: true }
      );
      dispatch(setMyCurrentIssues(res.data));
    };
    fetchCurrentIssues();
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-8">
      
      {/* 🔹 Interactive Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-l-4 border-amber-500 pl-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            Active Holdings<span className="text-amber-500">.</span>
          </h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Currently borrowed volumes from the archive
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
          <Library size={12} className="text-amber-500" />
          Total: {myCurrentIssues.length}
        </div>
      </div>

      {/* 🔹 Main Content Area */}
      {myCurrentIssues.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/30"
        >
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-zinc-300 shadow-sm mb-4">
            <Book size={32} strokeWidth={1} />
          </div>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Your archive shelf is empty
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {myCurrentIssues.map((issue, index) => (
            <motion.div
              key={issue._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white border border-zinc-100 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:border-amber-200 transition-all duration-500"
            >
              {/* Left Side: Book Info */}
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-amber-500 transition-all duration-500">
                  <Book size={30} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">
                    Issued Volume
                  </p>
                  <h3 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tighter uppercase leading-tight">
                    {issue.book.title}
                  </h3>
                </div>
              </div>

              {/* Right Side: Return Info */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:pl-8 sm:border-l border-zinc-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Return Deadline</span>
                  </div>
                  <p className="text-sm sm:text-lg font-black text-zinc-700">
                    {new Date(issue.expectedReturnDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Status Indicator Badge */}
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                   <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Deadline Alert (Only if close to today) */}
              <div className="absolute -top-2 -right-2">
                 <div className="bg-white border border-zinc-100 p-2 rounded-full shadow-lg">
                    <AlertCircle size={14} className="text-amber-500 animate-pulse" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔹 Quick Tips Footer */}
      <div className="pt-6 border-t border-zinc-100">
        <p className="text-[10px] text-center font-bold text-zinc-400 uppercase tracking-[0.3em]">
          Please return volumes on time to avoid archive penalties
        </p>
      </div>
    </div>
  );
};

export default StudentCurrentIssue;