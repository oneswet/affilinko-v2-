
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, MousePointerClick, TrendingUp, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { clsx } from "clsx";

const Dashboard = () => {
    const [stats, setStats] = useState({
        providers: 0,
        posts: 0,
        subscribers: 0,
        activeAds: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: providersCount } = await supabase.from("providers").select("*", { count: "exact", head: true });
            const { count: postsCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
            const { count: subscribersCount } = await supabase.from("contacts").select("*", { count: "exact", head: true });
            const { count: adsCount } = await supabase.from("ads").select("*", { count: "exact", head: true }).eq("is_active", true);

            setStats({
                providers: providersCount || 0,
                posts: postsCount || 0,
                subscribers: subscribersCount || 0,
                activeAds: adsCount || 0
            });
        };

        fetchStats();
    }, []);

    const chartData = [
        { name: 'Jan', visits: 4000, clicks: 2400 },
        { name: 'Feb', visits: 3000, clicks: 1398 },
        { name: 'Mar', visits: 2000, clicks: 9800 },
        { name: 'Apr', visits: 2780, clicks: 3908 },
        { name: 'May', visits: 1890, clicks: 4800 },
        { name: 'Jun', visits: 2390, clicks: 3800 },
        { name: 'Jul', visits: 3490, clicks: 4300 },
    ];

    const cards = [
        {
            title: "Total Providers",
            value: stats.providers,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-100/50",
            gradient: "from-indigo-600 to-blue-600",
            trend: "+12%"
        },
        {
            title: "Published Articles",
            value: stats.posts,
            icon: FileText,
            color: "text-emerald-600",
            bg: "bg-emerald-100/50",
            gradient: "from-emerald-600 to-teal-600",
            trend: "+4.5%"
        },
        {
            title: "Subscribers",
            value: stats.subscribers,
            icon: Activity,
            color: "text-purple-600",
            bg: "bg-purple-100/50",
            gradient: "from-purple-600 to-pink-600",
            trend: "+8%"
        },
        {
            title: "Active Ads",
            value: stats.activeAds,
            icon: MousePointerClick,
            color: "text-amber-600",
            bg: "bg-amber-100/50",
            gradient: "from-amber-600 to-orange-600",
            trend: "+2%"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 animate-fade-in"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
                    Overview
                </h1>
                <p className="text-slate-500">
                    Welcome back to your Affilinko control center.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <motion.div variants={itemVariants} key={index}>
                        <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-300 group overflow-hidden relative">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    {card.title}
                                </CardTitle>
                                <div className={clsx(`rounded-xl p-2 transition-transform group-hover:scale-110`, card.bg)}>
                                    <card.icon className={clsx(`h-5 w-5`, card.color)} />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black text-slate-800 tracking-tight">{card.value}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={clsx("flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-gradient-to-r group-hover:text-white transition-all duration-300", card.gradient)}>
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        {card.trend}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">vs last month</span>
                                </div>
                            </CardContent>
                            <div className={clsx("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-20 transition-opacity", card.gradient)} />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-3">
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 h-full p-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp className="text-indigo-600 w-5 h-5" />
                                Traffic Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                fontFamily: 'inherit'
                                            }}
                                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <Area type="monotone" dataKey="visits" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                        <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-1">
                    <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 h-full p-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Wallet className="text-amber-500 w-5 h-5" />
                                Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        <Bar dataKey="clicks" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f59e0b" />
                                                <stop offset="100%" stopColor="#d97706" />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity Mockup */}
            <motion.div variants={itemVariants}>
                <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 p-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-blue-500 w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-start gap-4 pb-6 border-b border-indigo-50 last:border-0 last:pb-0 hover:bg-slate-50/50 p-3 rounded-xl transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-blue-200">
                                        JS
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">New Subscriber Joined</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            john.smith{i}@example.com subscribed to the newsletter via homepage.
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">2 min ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
