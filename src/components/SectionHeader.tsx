
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  icon?: string;
  title: string;
  showMore?: boolean;
  moreLink?: string;
  moreText?: string;
  className?: string;
  subtitle?: string;
}

export const SectionHeader = ({
  icon,
  title,
  showMore = false,
  moreLink = "/",
  moreText = "Показать еще",
  className = "",
  subtitle,
}: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {icon ? (
              <span className="text-2xl md:text-3xl filter drop-shadow-lg">{icon}</span>
            ) : (
              <Sparkles className="w-6 h-6 text-indigo-500" />
            )}
            {/* Decorative dot */}
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900">
              {title}
            </span>
          </h2>
        </div>

        {showMore && (
          <Link
            to={moreLink}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100/50 hover:bg-indigo-100"
          >
            <span>{moreText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {subtitle && (
        <p className="text-slate-500 font-medium ml-10 md:ml-12 max-w-2xl">
          {subtitle}
        </p>
      )}

      <div className="h-[2px] w-full mt-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent rounded-full" />
    </div>
  );
};
