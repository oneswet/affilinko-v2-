import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Zap, Settings, Globe } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clsx } from "clsx";
import { useSiteConfig, ICON_MAP } from "@/context/SiteConfigContext";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { menuItems, isLoading } = useSiteConfig();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/admin/login");
                return;
            }

            // Check if profile is admin
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (profile?.role !== "admin") {
                toast.error("Доступ запрещен");
                navigate("/");
                return;
            }

            setUserEmail(session.user.email || "");
            setUserRole(profile.role || "admin");
            setIsAuthenticated(true);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) navigate("/admin/login");
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    if (isAuthenticated === null || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex admin-bg">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 glass shadow-xl transition-transform duration-300 lg:transform-none flex flex-col h-screen",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 border-b border-indigo-100/50 flex items-center justify-between">
                    <Link to="/" className="block">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 group">
                            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                                <Zap className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span>Affilinko</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-indigo-600"
                        title="Close Menu"
                        aria-label="Close Menu"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-2">
                        Menu
                    </div>

                    {menuItems.map((item) => {
                        const IconComponent = ICON_MAP[item.icon] || Settings; // Fallback icon
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "text-white shadow-lg shadow-indigo-500/30"
                                        : "text-slate-600 hover:bg-white hover:shadow-md hover:text-indigo-600"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10" />
                                )}
                                <IconComponent className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                <span className="font-medium">{item.title}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-100/50 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-all hover:shadow-sm"
                    >
                        <Globe className="w-5 h-5 group-hover:text-indigo-600" />
                        <span className="font-medium">На сайт</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                        </div>
                        <span className="font-medium">Выйти</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={clsx(
                    "flex-1 min-h-screen transition-all duration-300 ease-in-out p-6 lg:p-10",
                    isMobileMenuOpen ? "ml-0" : "lg:ml-64" // Adjust ml based on sidebar width
                )}
            >
                {/* Topbar */}
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                            {menuItems.find(i => i.path === location.pathname)?.title || "Dashboard"}
                        </h1>
                        <p className="text-slate-400 mt-1 font-medium">
                            Welcome back, {userEmail.split('@')[0]}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                            title="Notifications"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700">{userEmail}</p>
                                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{userRole}</p>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-indigo-100 cursor-pointer transition-transform hover:scale-105">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                                    {userEmail[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Page Content with Transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[calc(100vh-200px)]"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Toaster />
        </div>
    );
};

export default AdminLayout;
