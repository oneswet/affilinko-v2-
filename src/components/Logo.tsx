
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      {/* Premium Logo Icon */}
      <div className="relative w-8 h-8 lg:w-9 lg:h-9">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-lg transform rotate-6 opacity-75 blur-[2px] group-hover:blur-[4px] transition-all duration-300"></div>
        <div className="relative w-full h-full bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20"></div>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col -space-y-1">
        <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 transition-all duration-300">
          AFFILINKO
        </span>
        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase pl-0.5">
          Media
        </span>
      </div>
    </Link>
  );
};
