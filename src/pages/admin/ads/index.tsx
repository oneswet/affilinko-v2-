
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, Monitor, Layout, Megaphone, MoreHorizontal, Eye, MousePointerClick } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdsManager = () => {
    const [ads, setAds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("ads")
            .select("*, ad_placements(name)")
            .order("created_at", { ascending: false });

        if (!error) setAds(data || []);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this ad?")) return;
        const { error } = await supabase.from("ads").delete().eq("id", id);
        if (!error) {
            toast({ title: "Success", description: "Ad deleted" });
            fetchAds();
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Ads Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your advertisements and placements</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/admin/placements">
                        <Button variant="outline" className="glass-card bg-white/50 border-white/50 hover:bg-white/80">
                            <Monitor className="mr-2 h-4 w-4 text-purple-600" />
                            Placements
                        </Button>
                    </Link>
                    <Link to="new">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity border-0 shadow-lg shadow-purple-200">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Ad
                        </Button>
                    </Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none shadow-xl bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Active Ads</CardDescription>
                        <CardTitle className="text-4xl text-purple-700">
                            {ads.filter(a => a.is_active).length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-purple-400">
                            Out of {ads.length} created
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-xl bg-gradient-to-br from-pink-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Impressions</CardDescription>
                        <CardTitle className="text-4xl text-pink-700">
                            {ads.reduce((acc, curr) => acc + (curr.impressions || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-pink-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> All time views
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-xl bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Clicks</CardDescription>
                        <CardTitle className="text-4xl text-indigo-700">
                            {ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-indigo-400 flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> All time clicks
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card border-none shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <p>Loading your campaigns...</p>
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                                <Megaphone className="w-8 h-8 text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">No ads created yet</h3>
                                <p className="text-sm mt-1">Get started by creating your first advertisement campaign.</p>
                            </div>
                            <Link to="new">
                                <Button className="mt-2">Create Ad</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="pl-6">Creative</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Performance</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ads.map((ad) => (
                                    <TableRow key={ad.id} className="hover:bg-purple-50/30 transition-colors">
                                        <TableCell className="pl-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                {ad.image_url ? (
                                                    <img src={ad.image_url} alt="Preview" className="h-10 w-16 object-cover rounded-md border border-gray-100 shadow-sm" />
                                                ) : (
                                                    <div className="h-10 w-16 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-mono">
                                                        CODE
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700">{ad.title}</span>
                                                    {ad.destination_url && (
                                                        <span className="text-xs text-gray-400 truncate max-w-[150px]">{ad.destination_url}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-purple-100 text-purple-700">
                                                {ad.ad_placements?.name || "Unassigned"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="capitalize text-sm text-gray-600">{ad.type}</TableCell>
                                        <TableCell>
                                            {ad.is_active ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-gray-100 text-gray-500">Paused</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs space-y-1">
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <Eye className="w-3 h-3" /> {ad.impressions?.toLocaleString() || 0}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <MousePointerClick className="w-3 h-3" /> {ad.clicks?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-50">
                                                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px] glass-card border-white/20">
                                                    <Link to={`edit/${ad.id}`}>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                        onClick={() => handleDelete(ad.id)}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdsManager;
