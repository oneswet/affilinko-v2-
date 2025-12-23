
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

interface PartnerCardProps {
  id: number;
  name: string;
  description: string;
  logo: string;
  rating: number;
  index?: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => ( // Simplified to 5 stars for cleaner look
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(rating / 2) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"
            }`}
        />
      ))}
    </div>
  );
};

export const PartnerCard = ({
  id,
  name,
  description,
  logo,
  rating,
  index = 0,
}: PartnerCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg shadow-indigo-100/40 hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Decorative background blob */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors" />

      <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center">
        {/* Logo Section */}
        <div className="w-full md:w-32 h-20 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center p-3 group-hover:border-indigo-200 transition-colors">
          <img
            src={logo}
            alt={name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{name}</h3>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Trusted
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 pt-1">
            <StarRating rating={rating} />
            <span className="text-sm font-bold text-slate-700">{rating} / 10</span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-3 min-w-[140px]">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 rounded-xl" asChild>
            <Link to={`/networks/${id}`}>
              Обзор
            </Link>
          </Button>
          <Button variant="outline" className="w-full border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-xl group/btn" asChild>
            <a href="#" target="_blank" rel="nofollow">
              Сайт
              <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
};
