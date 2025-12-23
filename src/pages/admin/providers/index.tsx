
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash, Star, ExternalLink, Globe, LayoutGrid } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ProviderList = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("providers")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch providers",
                variant: "destructive",
            });
        } else {
            setProviders(data || []);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this provider?")) return;

        const { error } = await supabase.from("providers").delete().eq("id", id);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to delete provider",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Provider deleted successfully",
            });
            fetchProviders();
        }
    };

    const filteredProviders = providers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fade-in"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Providers</h2>
                    <p className="text-slate-500 mt-1">Manage your affiliate networks and partnerships.</p>
                </div>
                <Link to="new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 text-white rounded-xl px-6 transition-all hover:scale-[1.02]">
                        <Plus className="mr-2 h-4 w-4" /> New Provider
                    </Button>
                </Link>
            </div>

            <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 overflow-hidden">
                <CardHeader className="border-b border-indigo-50/50 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <LayoutGrid className="h-5 w-5 text-indigo-500" />
                        Network List
                        <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 rounded-full">{providers.length}</Badge>
                    </CardTitle>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search networks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 bg-white/50 border-indigo-100 focus:bg-white focus:border-indigo-500 focus:ring-indigo-200 rounded-xl transition-all"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-12 flex justify-center">
                            <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProviders.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                <Globe className="w-8 h-8 text-slate-300" />
                            </div>
                            <p>No providers found matching your search.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-indigo-50/30">
                                    <TableRow className="hover:bg-transparent border-indigo-100">
                                        <TableHead className="pl-6 font-semibold text-slate-700">Provider Information</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Rating</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProviders.map((provider) => (
                                        <TableRow key={provider.id} className="group hover:bg-slate-50/50 transition-colors border-indigo-50">
                                            <TableCell className="font-medium pl-6">
                                                <div className="flex items-center gap-4">
                                                    {provider.logo_url ? (
                                                        <div className="h-12 w-12 rounded-xl border border-indigo-50 p-1 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={provider.logo_url}
                                                                alt={provider.name}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                            {provider.name[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-base">{provider.name}</div>
                                                        <a
                                                            href={provider.website_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                                        >
                                                            {provider.website_url} <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-full w-fit border border-amber-100/50">
                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                    {provider.rating}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {provider.is_featured ? (
                                                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm border-0 px-2.5 py-0.5">Featured</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50">Standard</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`${provider.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        onClick={() => handleDelete(provider.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProviderList;
