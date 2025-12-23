
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const navLinks = [
  { href: "/posts", label: "Статьи" },
  { href: "/cases", label: "Кейсы" },
  { href: "/networks", label: "Рейтинг партнерок" },
  { href: "/services", label: "Сервисы" },
  { href: "/blogs", label: "Блоги" },
  { href: "/events", label: "Конференции" },
];

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "h-[70px] bg-white/70 backdrop-blur-2xl border-b border-indigo-100 shadow-lg shadow-indigo-500/5"
          : "h-[80px] bg-white/50 backdrop-blur-md border-b border-white/20"
      )}
    >
      {/* Animated Flow Border for Scrolled State */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      )}

      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-slate-400 hover:text-white" title="Open Menu" aria-label="Open Menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-indigo-100 bg-white/95 backdrop-blur-xl p-0">
              <div className="p-6 border-b border-gray-100">
                <Logo />
              </div>
              <nav className="p-4 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center p-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  "relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md shadow-indigo-200"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ width: isSearchOpen ? 240 : 40 }}
            className={clsx(
              "flex items-center overflow-hidden bg-white/50 border border-indigo-100 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300",
              isSearchOpen ? "px-3" : "justify-center"
            )}
          >
            <div
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-10 w-10 flex items-center justify-center cursor-pointer text-slate-500 hover:text-indigo-600"
            >
              <Search className="w-4 h-4" />
            </div>
            <input
              className={clsx(
                "bg-transparent border-none outline-none text-sm placeholder:text-slate-400 w-full text-slate-700",
                !isSearchOpen && "hidden"
              )}
              placeholder="Поиск по сайту..."
              autoFocus={isSearchOpen}
            />
            {isSearchOpen && (
              <X
                className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500 ml-2"
                onClick={() => setIsSearchOpen(false)}
              />
            )}
          </motion.div>

          <Link to="/admin">
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-medium text-sm hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95">
              <span>Войти</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};
