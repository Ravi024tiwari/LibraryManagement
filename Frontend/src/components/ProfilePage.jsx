import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Pencil, 
  Phone, 
  MapPin, 
  Fingerprint,
  Calendar,
  Sparkles
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate =useNavigate();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 sm:px-10 py-12 lg:py-20 relative">
      
      {/* 🔹 Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-zinc-100/50 rounded-full blur-[100px] -z-10" />

      {/* 🔹 Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 border-l-4 border-amber-500 pl-6"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-2">Member Identity</p>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
          Profile Archive<span className="text-amber-500">.</span>
        </h1>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🔹 Left Column: Primary Identity (Col 4) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="relative group overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-10 shadow-2xl shadow-zinc-200/50 text-center">
             {/* Profile Image with Pulse */}
             <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=18181b&color=fff&bold=true`}
                  alt={user.name}
                  className="relative h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl z-10"
                />
             </div>
             
             <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase mb-1">
                {user.name}
             </h2>
             
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                <ShieldCheck size={12} className="text-amber-500" />
                {user.role} Member
             </div>

             <button onClick ={()=>navigate("/edit/profile")} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-zinc-100 text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-95 group">
                <Pencil size={14} className="group-hover:rotate-12 transition-transform" />
                Modify Identity
             </button>
          </div>

          {/* Quick Stats/Metadata */}
          <div className="rounded-[2rem] bg-zinc-900 p-8 text-white">
             <div className="flex items-center gap-3 mb-6">
                <Fingerprint size={20} className="text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest">Digital Stamp</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                   <span>Member Since</span>
                   <span className="text-zinc-300">JAN 2026</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                   <span>Access Level</span>
                   <span className="text-amber-500">{user.role === 'ADMIN' ? 'UNRESTRICTED' : 'STANDARD'}</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* 🔹 Right Column: Details & Narrative (Col 8) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white rounded-[3rem] border border-zinc-100 p-8 sm:p-12 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
             <ProfileInfoItem 
               icon={<Mail size={18} />} 
               label="Electronic Mail" 
               value={user.email} 
               delay={0.1}
             />
             <ProfileInfoItem 
               icon={<UserIcon size={18} />} 
               label="Member Classification" 
               value={user.role} 
               delay={0.2}
             />
             <ProfileInfoItem 
               icon={<Phone size={18} />} 
               label="Contact Wire" 
               value={user.phone || "+91 • Unregistered"} 
               delay={0.3}
             />
             <ProfileInfoItem 
               icon={<MapPin size={18} />} 
               label="Institutional Wing" 
               value="Main Archive Block B" 
               delay={0.4}
             />
          </div>

          {/* About / Bio Section */}
          <div className="pt-10 border-t border-zinc-100">
             <div className="flex items-center gap-3 mb-6">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Personal Narrative</h3>
             </div>
             <p className="text-sm leading-relaxed text-zinc-500 font-medium italic">
                {user.about || "The member has not provided a biographical narrative for the archive yet. Please update profile details to include institutional specialization."}
             </p>
          </div>

          {/* Footer Detail */}
          <div className="mt-12 pt-8 flex items-center justify-between opacity-30 select-none">
             <span className="text-[40px] font-black tracking-tighter text-zinc-200 uppercase">AETHEL</span>
             <Calendar size={40} className="text-zinc-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Info Item with Micro-Interaction */
const ProfileInfoItem = ({ icon, label, value, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group"
  >
    <div className="flex items-center gap-3 mb-2">
       <div className="text-zinc-300 group-hover:text-amber-500 transition-colors">
          {icon}
       </div>
       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
          {label}
       </span>
    </div>
    <div className="pl-[30px]">
       <p className="text-sm font-bold text-zinc-900 truncate tracking-tight uppercase">
          {value}
       </p>
    </div>
  </motion.div>
);

export default ProfilePage;