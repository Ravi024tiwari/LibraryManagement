import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { persistor } from "@/store/store";
import { useState, useEffect } from "react";
import { 
  Search, LogOut, LayoutDashboard, User, 
  ChevronDown, Menu, X, Command 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔹 Fake Search Functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    // Fake Logic: Log the query and navigate
    console.log("Searching the Archive for:", search);
    
    // Redirect to a books page with the search query in the URL
    navigate(`/books?search=${encodeURIComponent(search)}`);
    
    // UI Cleanup
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Scroll lock for mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-xl lg:text-sm font-black lg:font-bold transition-all ${
      isActive ? "text-zinc-900" : "text-zinc-400 lg:text-zinc-500 hover:text-zinc-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* 🔹 Brand Logo */}
          <Link to="/" className="group flex items-center gap-3 shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
              <div className="absolute inset-0 rotate-45 border border-zinc-200 transition-transform duration-500 group-hover:rotate-[135deg] group-hover:border-amber-500" />
              <div className="h-2.5 w-2.5 bg-zinc-900 group-hover:bg-amber-600 transition-colors" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl font-black tracking-tighter text-zinc-900 leading-none">AETHEL.</span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">Archive</span>
            </div>
          </Link>

          {/* 🧭 Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/all-book" className={navLinkClass}>Books</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
          </div>

          {/* 🔍 Desktop Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-xs lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-zinc-50 border border-transparent px-10 py-2 text-sm focus:bg-white focus:border-zinc-200 focus:outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-[10px] font-bold text-zinc-300">
               <Command size={10} /> K
            </div>
          </form>

          {/* 👤 Actions Section */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link to="/login" className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95 transition-transform">Join</Link>
            ) : (
              <div className="relative flex items-center gap-2 sm:gap-3">
                <span className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                  user.role === "ADMIN" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                }`}>
                  {user.role}
                </span>

                <button 
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-zinc-200 bg-white shadow-sm hover:border-amber-500 active:scale-90 transition-all"
                >
                  <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=18181b&color=fff&bold=true`}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="fixed inset-0 z-[60] bg-black/5 backdrop-blur-sm" />
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="fixed sm:absolute right-6 left-6 sm:left-auto sm:right-0 top-24 sm:top-14 z-[70] w-auto sm:w-64 rounded-[28px] bg-white border border-zinc-100 p-4 shadow-2xl">
                        <div className="mb-4 p-4 rounded-2xl bg-zinc-50">
                           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{user.role}</p>
                           <p className="text-sm font-bold text-zinc-900 truncate">{user.name}</p>
                           <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <MenuOption icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => {navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/student"); setIsProfileOpen(false)}} />
                        <MenuOption icon={<User size={18} />} label="My Profile" onClick={() => {navigate("/profile"); setIsProfileOpen(false)}} />
                        <div className="my-2 border-t border-zinc-100" />
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50"><LogOut size={18} />Logout</button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <button onClick={() => { setIsMobileMenuOpen(true); setIsProfileOpen(false); }} className="lg:hidden p-2.5 rounded-xl bg-zinc-900 text-white active:scale-90 transition-transform">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[280px] z-[101] bg-white lg:hidden flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-900 hover:bg-zinc-100"><X size={18} /></button>
              </div>

              <div className="flex-1 px-8 flex flex-col justify-center gap-10">
                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
                <NavLink to="/all-book" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Books</NavLink>
                <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>About</NavLink>
              </div>

              {/* 🔍 Mobile Search Form inside Drawer */}
              <div className="p-8 border-t border-zinc-100">
                 <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                      type="text" 
                      placeholder="Find documents..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl bg-zinc-50 px-10 py-3 text-sm focus:outline-none border border-zinc-100 focus:bg-white focus:border-zinc-200 transition-all"
                    />
                 </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MenuOption = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"><span className="text-zinc-400">{icon}</span> {label}</button>
);

export default Navbar;