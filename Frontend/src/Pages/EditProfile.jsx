import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  User, 
  Phone, 
  FileText, 
  Lock, 
  KeyRound, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    about: user.about || "",
    currentPassword: "",
    newPassword: ""
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (file) data.append("file", file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/students/update-profile`,
        data,
        { withCredentials: true }
      );

      dispatch(updateUser(res.data.user));
      navigate("/profile"); // Navigate back to view profile
    } catch (err) {
      setError(err.response?.data?.message || "Internal Archive Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-12 lg:py-20">
      {/* 🔹 Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="border-l-4 border-amber-600 pl-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-amber-600 transition-all mb-4"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Discard Changes
          </button>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
            Revise Credentials<span className="text-amber-600">.</span>
          </h1>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
           <ShieldCheck size={14} className="text-amber-500" />
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure Update Node</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🔹 Left: Image Management (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 text-center shadow-xl shadow-zinc-100">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Digital Portrait</label>
            
            <div className="relative inline-block group">
              <img
                src={preview || `https://ui-avatars.com/api/?name=${user.name}&background=18181b&color=fff&bold=true`}
                alt="preview"
                className="h-40 w-40 rounded-full object-cover border-8 border-zinc-50 shadow-inner group-hover:brightness-75 transition-all"
              />
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <p className="mt-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Click photo to replace</p>
          </div>
        </div>

        {/* 🔹 Right: Information Matrix (Col 8) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-zinc-100 p-8 sm:p-12 shadow-sm">
            
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <StyledInput icon={<User size={16} />} label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <StyledInput icon={<Phone size={16} />} label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="space-y-3 mb-12">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <FileText size={14} /> Personal Abstract
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your institutional role..."
                className="w-full rounded-3xl bg-zinc-50/50 border border-zinc-100 px-6 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Password Section */}
            <div className="border-t border-zinc-50 pt-10 mb-10">
              <div className="flex items-center gap-3 mb-8">
                <Lock size={18} className="text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Security Override</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StyledInput 
                  type="password" icon={<KeyRound size={16} />} label="Current Password" 
                  name="currentPassword" value={formData.currentPassword} onChange={handleChange} 
                  placeholder="••••••••" 
                />
                <StyledInput 
                  type="password" icon={<KeyRound size={16} />} label="New Password" 
                  name="newPassword" value={formData.newPassword} onChange={handleChange} 
                  placeholder="Enter new phrase" 
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl mb-8 border border-rose-100"
                >
                  <AlertCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
               <button
                 type="button"
                 onClick={() => navigate(-1)}
                 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors"
               >
                 Cancel Revision
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full sm:w-auto bg-zinc-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
               >
                 {loading ? "Syncing..." : (
                   <>
                     Commit Changes
                     <Save size={16} />
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

/* 🔹 Reusable Styled Input */
const StyledInput = ({ label, icon, ...props }) => (
  <div className="space-y-3 group">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-focus-within:text-amber-600 transition-colors">
      {icon} {label}
    </label>
    <input
      {...props}
      className="w-full rounded-full bg-zinc-50 border border-zinc-100 px-6 py-3.5 text-sm font-bold placeholder:text-zinc-300 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all"
    />
  </div>
);

export default EditProfile;