import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { icon: "🎤", label: "Интервью", href: "/posts?cat=interview" },
  { icon: "📝", label: "Руководства", href: "/posts?cat=guides" },
  { icon: "⭐", label: "Кейсы 2025", href: "/cases" },
  { icon: "📈", label: "Тренды", href: "/posts?cat=trends" },
  { icon: "🔧", label: "Инструменты", href: "/services" },
];

export const CategoryTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-wrap justify-center gap-3 py-6 px-3"
    >
      {categories.map((cat, index) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
        >
          <Link
            to={cat.href}
            className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-secondary border border-border rounded-full transition-all hover:border-primary/50 hover:shadow-green-glow"
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm font-medium text-foreground">{cat.label}</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
