
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  id: number;
  title: string;
  image: string;
  tags: string[];
  index?: number;
}

export const ArticleCard = ({
  id,
  title,
  image,
  tags,
  index = 0,
}: ArticleCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/posts/${id}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-2xl bg-white border border-indigo-50 shadow-sm shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-200/40 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Overlay Tags */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                {title}
              </h3>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-auto pt-2 flex items-center text-xs font-medium text-slate-400">
              <span>5 мин чтения</span>
              <span className="mx-2">•</span>
              <span>Сегодня</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
