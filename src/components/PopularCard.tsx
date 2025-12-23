
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface PopularCardProps {
  id: number;
  title: string;
  image: string;
  tags: string[];
  author?: string;
  isLarge?: boolean;
  index?: number;
}

export const PopularCard = ({
  id,
  title,
  image,
  tags,
  author,
  isLarge = false,
  index = 0,
}: PopularCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative rounded-2xl overflow-hidden ${isLarge ? "col-span-1 md:col-span-2 row-span-2" : "col-span-1"
        }`}
    >
      <Link to={`/posts/${id}`} className="block h-full relative z-10">
        {/* Animated Flow Border Container */}
        <div className="absolute inset-0 p-[2px] rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-white rounded-2xl" />
        </div>

        {/* Card Content Container */}
        <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white border border-slate-100 group-hover:border-transparent transition-colors duration-300">
          {/* Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />

          {/* Premium Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent ${isLarge ? 'opacity-80' : 'opacity-70'} group-hover:opacity-60 transition-opacity duration-300`} />

          {/* Flow Color Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

          <div className="relative h-full flex flex-col justify-end p-5 md:p-6 min-h-[240px]">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className={`font-bold text-white leading-tight mb-2 group-hover:text-indigo-100 transition-colors line-clamp-3 ${isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
              }`}>
              {title}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
              {author && (
                <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-[10px] text-white font-bold">
                    {author.charAt(0)}
                  </div>
                  <span>{author}</span>
                </div>
              )}

              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
