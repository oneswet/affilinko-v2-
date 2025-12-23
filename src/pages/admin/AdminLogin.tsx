
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                checkRole(session.user.id);
            }
        };
        checkSession();
    }, []);

    const checkRole = async (userId: string) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profile && (profile.role === "admin" || profile.role === "editor")) {
            navigate("/admin");
        } else {
            await supabase.auth.signOut();
            toast({
                title: "Unauthorized",
                description: "You do not have admin access.",
                variant: "destructive",
            });
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive",
            });
            setLoading(false);
        } else {
            if (data.user) {
                checkRole(data.user.id);
            }
        }
        // Don't set loading false here immediately to prevent flicker before redirect
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900">
            {/* Animated Background Spheres */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ rotate: 360, x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[120px]"
                />
                <motion.div
                    animate={{ rotate: -360, x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-blue-600/30 blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
                    <CardHeader className="space-y-1 text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-indigo-500/30">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            Admin Portal
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access the secure area
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold h-11 shadow-lg shadow-indigo-500/30"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Secure Sign In"
                                )}
                            </Button>
                        </form>
                        <div className="text-center text-xs text-slate-500 mt-4">
                            Protected by Affilinko Secure Systems
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
