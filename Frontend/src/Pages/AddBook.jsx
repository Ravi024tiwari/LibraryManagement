import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, ArrowLeft, X, BookOpen, User, 
  Tag, Hash, AlignLeft, CheckCircle2, Loader2 
} from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addBook } from "@/store/bookSlice";
import { motion, AnimatePresence } from "framer-motion";

const BOOK_CATEGORIES = ["Technical", "Mythology", "Hindi", "Historical", "Other"];

const AddBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: 1
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setCoverImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (coverImage) data.append("coverImage", coverImage);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/book/create`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      dispatch(addBook(res.data.book || res.data));
      navigate("/all-book");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 lg:py-20 relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/40 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <div className="mb-12 flex flex-col gap-4">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Archive Overview
        </button>
        <div className="flex items-center gap-4 border-l-4 border-amber-600 pl-6">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
            Curate New Volume<span className="text-amber-500">.</span>
          </h1>
        </div>
      </div>

      {/* Workspace Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 🔹 Left: Cover Preview (Sticky Workspace) */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
            Physical Representation
          </label>
          
          <div className="relative group aspect-[3/4] w-full">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center p-8 text-center transition-all hover:border-amber-400 cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 mb-4 group-hover:text-amber-500 transition-colors">
                    <Upload size={24} />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Upload Cover</p>
                  <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG up to 10MB</p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
                >
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="h-12 w-12 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 🔹 Right: Metadata Fields */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-zinc-100 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <StyledInput 
              icon={<BookOpen size={16} />} 
              label="Volume Title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="The Great Gatsby" 
              required 
            />
            <StyledInput 
              icon={<User size={16} />} 
              label="Author Name" 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              placeholder="F. Scott Fitzgerald" 
              required 
            />
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <Tag size={14} /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-full bg-zinc-50 border border-zinc-100 px-6 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none appearance-none transition-all"
              >
                <option value="" disabled>Select Genre</option>
                {BOOK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <StyledInput 
              icon={<Hash size={16} />} 
              label="Total Copies" 
              name="totalCopies" 
              type="number" 
              min={1}
              value={formData.totalCopies} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="space-y-3 mb-12">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <AlignLeft size={14} /> Narrative Summary
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe the significance of this volume..."
              className="w-full rounded-3xl bg-zinc-50 border border-zinc-100 px-8 py-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-zinc-50">
            <button
              type="button"
              onClick={() => navigate("/all-book")}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-3 rounded-full bg-zinc-900 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-amber-400 shadow-xl shadow-zinc-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Commit to Archive
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* 🔹 Styled Input Component */
const StyledInput = ({ label, icon, ...props }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors group-focus-within:text-amber-600">
      {icon} {label}
    </label>
    <input
      {...props}
      className="w-full rounded-full bg-zinc-50 border border-zinc-100 px-6 py-3.5 text-sm font-bold placeholder:text-zinc-300 transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none"
    />
  </div>
);

export default AddBook;