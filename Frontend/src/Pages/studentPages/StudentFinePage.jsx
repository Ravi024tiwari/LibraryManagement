import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyFine } from "@/store/issueSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IndianRupee, 
  AlertCircle, 
  BookText, 
  History, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

const StudentFinePage = () => {
  const dispatch = useDispatch();
  const { myFineSummary } = useSelector(
    (state) => state.issue.student
  );

  useEffect(() => {
    const fetchFines = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/fines`,
        { withCredentials: true }
      );
      dispatch(setMyFine(res.data));
    };
    fetchFines();
  }, [dispatch]);

  // Helper function for dynamic status coloring
  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "paid") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
      
      {/* 🔹 Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-l-4 border-rose-500 pl-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            Financial Archive<span className="text-rose-500">.</span>
          </h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Settlement and dues for borrowed volumes
          </p>
        </div>
        
        {/* Total Fine Stat Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-yellow-600 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 min-w-[240px] cursor-pointer"
        >
          <div className="h-12 w-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Total Dues</p>
            <h3 className="text-2xl font-black tracking-tighter">
              ₹{myFineSummary.totalFine || 0}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* 🔹 Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-zinc-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">
            Transaction History
          </h3>
        </div>

        <AnimatePresence>
          {myFineSummary.fines?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/30"
            >
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm mb-4">
                <CheckCircle2 size={32} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                No outstanding penalties
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {myFineSummary.fines?.map((f, index) => (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group relative bg-white border border-zinc-100 rounded-[2rem] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-rose-200 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Icon based on fine presence */}
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                      <BookText size={20} />
                    </div>
                    
                    <div>
                      <h4 className="font-black text-zinc-900 text-base tracking-tight uppercase group-hover:text-rose-600 transition-colors">
                        {f.book.title}
                      </h4>
                      <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(f.fineStatus)}`}>
                        <ShieldAlert size={10} />
                        {f.fineStatus}
                      </div>
                    </div>
                  </div>

                  {/* Fine Amount Section */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-10 sm:pl-8 sm:border-l border-zinc-50">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Penalty Amount</p>
                      <p className="text-xl font-black text-rose-500">
                        ₹{f.fineAmount}
                      </p>
                    </div>
                    
                    <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔹 Footer Note */}
      <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-start gap-4">
        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-zinc-500 font-medium">
          <span className="font-black text-zinc-700 uppercase">Settlement Notice:</span> Please visit the library curator's office to settle your dues. Unpaid fines may restrict your ability to borrow further volumes from the archive.
        </p>
      </div>
    </div>
  );
};

export default StudentFinePage;