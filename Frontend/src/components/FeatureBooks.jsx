import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Star, BookOpen } from "lucide-react";

const FeaturedBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/popular`,{withCredentials:true}
        );
        setBooks(res.data.books || []);
      } catch (err) {
        console.error("Failed to load featured books");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  if (loading) return null; // homepage skeleton optional later

  return (
    <section className="mx-auto max-w-[1300px] px-8 sm:px-12 py-20">

      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 border-l-4 border-amber-600 pl-6 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600 mb-2">
            Curated Selection
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-none">
            MOST BORROWED VOLUMES<span className="text-amber-500">.</span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/all-book")}
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-amber-600 transition-all"
        >
          Explore All
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🔹 Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
        {books.slice(0, 8).map((book, index) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            onClick={() => navigate(`/books/${book._id}`)}
            className="group cursor-pointer"
          >
            {/* Cover */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-50 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-3">
              <img
                src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"}
                alt={book.title}
                className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-xl">
                  <BookOpen size={20} />
                </div>
              </div>

              {/* Category */}
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-zinc-900 rounded-full">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-zinc-900 tracking-tight group-hover:text-amber-600 transition-colors uppercase line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-[11px] font-bold text-zinc-400 italic">
                  by {book.author}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span className="text-[10px] font-bold text-zinc-900">
                  {book.borrowCount || 0}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;
