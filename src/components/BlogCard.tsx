
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, MessageCircle, ArrowUpRight, Sparkles } from "lucide-react";

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  views: number;
  comments: number;
  index?: number;
}

export const BlogCard = ({
  id,
  title,
  excerpt,
  image,
  author,
  tags,
  views,
  comments,
  index = 0,
}: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.01 }}
      className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500"
    >
      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl p-4 overflow-hidden relative">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] -z-0 pointer-events-none group-hover:bg-pink-500/10 transition-colors" />

        {/* Image */}
        <Link
          to={`/blogs/${id}`}
          className="relative overflow-hidden h-52 md:h-auto w-full md:w-[280px] shrink-0 rounded-xl group/img"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/img:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />

          {/* Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col relative z-10 py-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-pink-600 transition-colors leading-tight">
            <Link to={`/blogs/${id}`}>
              {title}
            </Link>
          </h3>

          <p className="text-slate-500 leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">
            {excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Автор</span>
                <span className="text-sm font-bold text-slate-700">{author.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-default">
                <Eye className="w-4 h-4" />
                <span>{views}</span>
              </span>
              <span className="flex items-center gap-1.5 hover:text-purple-500 transition-colors cursor-default">
                <MessageCircle className="w-4 h-4" />
                <span>{comments}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
