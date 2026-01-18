import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Bookmark,
  Star,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isAvailable = book.availableCopies > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white rounded-[24px] border border-zinc-100 p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2"
    >
      {/* 📕 Image Container when we click on the image container it redirect to that page */}
      <div 
        className="relative aspect-[3/4] rounded-[20px] overflow-hidden bg-zinc-50 cursor-pointer"
        onClick={() => navigate(`/books/${book._id}`)}
      >
        <img
          src={
            book.coverImage ||
            "https://images.unsplash.com/photo-1543004629-ff569f872783?q=80&w=800"
          }
          alt={book.title}
          className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition-all duration-500 flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-[2px]">
          <div className="flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/books/${book._id}`); }}
              className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-zinc-900 hover:bg-amber-500 hover:text-white transition-colors shadow-xl"
            >
              <Eye size={18} />
            </button>
            <button 
              className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors shadow-xl"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-zinc-900 shadow-sm border border-zinc-100">
            {book.category}
          </span>
        </div>

        {/* 🚦 Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
              <CheckCircle size={10} />
              {book.availableCopies} Available
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-sm animate-pulse">
              <AlertTriangle size={10} />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* 📘 Info */}
      <div className="mt-5 px-1 pb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-zinc-900 tracking-tight leading-tight uppercase truncate group-hover:text-amber-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-[11px] font-bold text-zinc-400 mt-1 italic">
              {book.author}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
            <Star size={10} className="fill-amber-500 text-amber-500" />
            <span className="text-[10px] font-black text-amber-700">
              4.9
            </span>
          </div>
        </div>

        {/* ⚠️ Attention Message when Out of Stock */}
        {!isAvailable && (
          <p className="mt-3 text-[10px] font-semibold text-rose-600 uppercase tracking-widest">
            Currently unavailable — check back soon
          </p>
        )}

        {/* 🔘 Admin Actions */}
        {user?.role === "ADMIN" && (
          <div className="mt-5 pt-4 border-t border-zinc-50 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(`/admin/books/edit/${book._id}`)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-all"
            >
              <Edit3 size={12} />
              Modify
            </button>

            <button
              onClick={() => console.log("delete", book._id)}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Background Detail */}
      <div className="absolute -bottom-2 -left-2 text-[50px] font-black text-zinc-50 opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 select-none">
        ARCHIVE
      </div>
    </motion.div>
  );
};

export default BookCard;
