
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";

export const HeroBanner = () => {
  return (
    <div className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            No. 1 Media for Affiliates
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-tight mb-6"
        >
          МЕДИА ПРО <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
            АРБИТРАЖ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium"
        >
          Все о манимейкинге, трафике и CPA сетях. <br className="hidden sm:block" />
          Читайте кейсы, выбирайте партнерки и зарабатывайте больше.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/posts">
            <Button className="h-14 px-8 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300">
              Читать статьи
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-slate-700 font-bold text-lg hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Смотреть видео
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 hidden lg:block"
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-12 border border-white/50 backdrop-blur-sm">
          🚀
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-10 hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-pink-100 flex items-center justify-center text-5xl transform rotate-12 border border-white/50 backdrop-blur-sm">
          💸
        </div>
      </motion.div>
    </div>
  );
};
