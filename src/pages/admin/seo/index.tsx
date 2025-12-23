
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, Search, Save, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SeoManager = () => {
    const [metaList, setMetaList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [editingMeta, setEditingMeta] = useState({
        id: "",
        page_path: "",
        title: "",
        description: "",
        keywords: "",
        og_image: ""
    });

    useEffect(() => {
        fetchMeta();
    }, []);

    const fetchMeta = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("seo_meta")
            .select("*")
            .order("page_path", { ascending: true });

        if (!error) setMetaList(data || []);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!editingMeta.page_path) {
            toast({ title: "Error", description: "Page Path is required", variant: "destructive" });
            return;
        }

        const payload: any = {
            page_path: editingMeta.page_path,
            title: editingMeta.title,
            description: editingMeta.description,
            keywords: editingMeta.keywords ? editingMeta.keywords.split(',').map(k => k.trim()) : [],
            og_image: editingMeta.og_image
        };

        let result;
        if (editingMeta.id) {
            result = await supabase.from("seo_meta").update(payload).eq("id", editingMeta.id);
        } else {
            result = await supabase.from("seo_meta").insert(payload);
        }

        const { error } = result;

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({
                title: "Success",
                description: `SEO settings ${editingMeta.id ? "updated" : "created"} for ${editingMeta.page_path}`
            });
            setIsEditOpen(false);
            setEditingMeta({ id: "", page_path: "", title: "", description: "", keywords: "", og_image: "" });
            fetchMeta();
        }
    };

    const handleEdit = (meta: any) => {
        setEditingMeta({
            id: meta.id,
            page_path: meta.page_path,
            title: meta.title || "",
            description: meta.description || "",
            keywords: meta.keywords ? meta.keywords.join(", ") : "",
            og_image: meta.og_image || ""
        });
        setIsEditOpen(true);
    };

    const handleNew = () => {
        setEditingMeta({ id: "", page_path: "/", title: "", description: "", keywords: "", og_image: "" });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete these SEO settings?")) return;
        const { error } = await supabase.from("seo_meta").delete().eq("id", id);
        if (!error) fetchMeta();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 tracking-tight">SEO Manager</h2>
                    <p className="text-slate-500 font-medium">Optimize your meta tags and social preview</p>
                </div>
                <Button onClick={handleNew} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-pink-200 text-white rounded-xl px-6 transition-all hover:scale-105 active:scale-95">
                    <Plus className="mr-2 h-5 w-5" /> Add Page SEO
                </Button>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-xl bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800">{editingMeta.id ? "Edit SEO Meta" : "Add Page SEO"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold">Page Path</Label>
                            <Input
                                className="bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-200 transition-all rounded-xl"
                                value={editingMeta.page_path}
                                onChange={(e) => setEditingMeta(prev => ({ ...prev, page_path: e.target.value }))}
                                placeholder="/path"
                            />
                            <p className="text-xs text-slate-400">Example: /about or / (for homepage)</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold">Meta Title</Label>
                            <Input
                                className="bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-200 transition-all rounded-xl"
                                value={editingMeta.title}
                                onChange={(e) => setEditingMeta(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold">Meta Description</Label>
                            <Textarea
                                className="bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-200 transition-all rounded-xl resize-none min-h-[100px]"
                                value={editingMeta.description}
                                onChange={(e) => setEditingMeta(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold">Keywords</Label>
                            <Input
                                className="bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-200 transition-all rounded-xl"
                                value={editingMeta.keywords}
                                onChange={(e) => setEditingMeta(prev => ({ ...prev, keywords: e.target.value }))}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold">OG Image URL</Label>
                            <Input
                                className="bg-white/50 border-slate-200 focus:border-pink-500 focus:ring-pink-200 transition-all rounded-xl"
                                value={editingMeta.og_image}
                                onChange={(e) => setEditingMeta(prev => ({ ...prev, og_image: e.target.value }))}
                            />
                        </div>
                        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-200 rounded-xl">
                            Save SEO Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Card className="border-none shadow-xl shadow-gray-100/20 bg-white/70 backdrop-blur-xl border-white/40">
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-xl">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="h-8 w-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <span className="text-slate-500">Loading settings...</span>
                            </div>
                        ) : metaList.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 flex flex-col items-center">
                                <Search className="w-12 h-12 text-slate-200 mb-4" />
                                No custom SEO settings found.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-pink-50/30">
                                    <TableRow className="hover:bg-transparent border-pink-100">
                                        <TableHead className="font-semibold text-slate-700">Path</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Title</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Description</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metaList.map((meta) => (
                                        <TableRow key={meta.id} className="hover:bg-pink-50/20 transition-colors border-pink-50">
                                            <TableCell>
                                                <span className="font-mono bg-white border border-slate-200 rounded px-2 py-1 text-xs text-pink-600 font-medium">{meta.page_path}</span>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate text-slate-800">{meta.title}</TableCell>
                                            <TableCell className="text-slate-500 max-w-[300px] truncate">{meta.description}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 text-slate-200">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-white"
                                                        onClick={() => handleEdit(meta)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-white"
                                                        onClick={() => handleDelete(meta.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SeoManager;
