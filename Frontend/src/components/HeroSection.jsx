import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 sm:px-10 py-15 lg:py-15 overflow-hidden flex flex-col items-center">
      
      {/* 🔹 Animated Floating Background Accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-amber-50/60 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-zinc-100/50 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* 🔹 Pulsing "New" Badge */}
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-10 shadow-2xl"
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles size={12} className="text-amber-500" />
          </motion.span>
          <span>Curated Docs v2.0 is live</span>
        </motion.div>

        {/* 🔹 Modern Architectural Heading */}
        <motion.h1 
          variants={fadeInUp}
          className="max-w-5xl text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.9] mb-8"
        >
          DISCOVER THE <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-[length:200%_auto] animate-shimmer">
            SILENT ARCHIVE
          </span>
          <span className="text-amber-600">.</span>
        </motion.h1>

        {/* 🔹 Animated Description */}
        <motion.p 
          variants={fadeInUp}
          className="max-w-xl mx-auto text-sm md:text-base font-medium text-zinc-500 leading-relaxed mb-12"
        >
          Aethel is a sanctuary for the curious. A minimalist archive 
          engineered for deep work, technical mastery, and the pursuit of 
          knowledge without distraction.
        </motion.p>

        {/* 🔹 Animated Action Area */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/books"
            className="group relative overflow-hidden bg-zinc-900 text-white px-10 py-4 rounded-full text-sm font-bold transition-all hover:pr-12 active:scale-95 shadow-xl shadow-zinc-200"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse Collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
            {/* Hover Shine Effect */}
            <motion.div 
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"
            />
          </Link>
          
          <Link
            to="/about"
            className="text-sm font-bold text-zinc-500 transition-colors hover:text-zinc-900 relative group"
          >
            The Philosophy
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 transition-all group-hover:w-full" />
          </Link>
        </motion.div>

        {/* 🔹 Animated Numbers (Stats) */}
        <motion.div 
          variants={fadeInUp}
          className="mt-24 grid grid-cols-3 gap-8 md:gap-24 border-t border-zinc-100 pt-16"
        >
          {[
            { label: "Daily Users", value: "2.4k" },
            { label: "Curated Books", value: "12k+" },
            { label: "Active Access", value: "24/7" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 + (i * 0.1) }}
                className="text-xl md:text-3xl font-black text-zinc-900"
              >
                {stat.value}
              </motion.span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;