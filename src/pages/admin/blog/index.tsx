
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash, FileText, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const PostList = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch posts",
                variant: "destructive",
            });
        } else {
            setPosts(data || []);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to delete post",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Post deleted successfully",
            });
            fetchPosts();
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
            case "draft":
                return <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Draft</Badge>;
            case "archived":
                return <Badge variant="destructive">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 tracking-tight">Blog Posts</h2>
                    <p className="text-slate-500 font-medium">Manage your articles and content</p>
                </div>
                <Link to="new">
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-200 rounded-xl px-6 transition-all hover:scale-105 active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </Link>
            </div>

            <Card className="border-none shadow-xl shadow-gray-100/20 bg-white/70 backdrop-blur-xl border-white/40">
                <CardContent className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 bg-white/50 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-orange-200 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex justify-center">
                            <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 bg-white/30 rounded-xl border border-dashed border-gray-200">
                            No posts found.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <Table>
                                <TableHeader className="bg-orange-50/30">
                                    <TableRow className="hover:bg-transparent border-orange-100">
                                        <TableHead className="font-semibold text-slate-700">Title</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Published Date</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.map((post) => (
                                        <TableRow key={post.id} className="hover:bg-orange-50/20 transition-colors border-gray-50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-4">
                                                    {post.featured_image ? (
                                                        <img src={post.featured_image} alt={post.title} className="h-12 w-20 object-cover rounded-lg shadow-sm" />
                                                    ) : (
                                                        <div className="h-12 w-20 bg-slate-100 rounded-lg flex items-center justify-center shadow-inner">
                                                            <FileText className="h-6 w-6 text-slate-300" />
                                                        </div>
                                                    )}
                                                    <span className="truncate max-w-[300px] font-semibold text-slate-800" title={post.title}>{post.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(post.status)}</TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`edit/${post.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                                                        onClick={() => handleDelete(post.id)}
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
        </div>
    );
};

export default PostList;
