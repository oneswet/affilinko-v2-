
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload, Check } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadImage } from "@/lib/upload-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PostEditor = () => {
    const { id } = useParams();
    const isNew = !id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image: "",
        status: "draft",
        seo_title: "",
        seo_description: "",
        seo_keywords: ""
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchPost(id);
        }
    }, [id, isNew]);

    const fetchPost = async (postId: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", postId)
            .single();

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch post details",
                variant: "destructive",
            });
            navigate("/admin/blog");
        } else if (data) {
            setFormData({
                title: data.title,
                slug: data.slug,
                content: data.content || "",
                excerpt: data.excerpt || "",
                featured_image: data.featured_image || "",
                status: data.status || "draft",
                seo_title: data.seo_title || "",
                seo_description: data.seo_description || "",
                seo_keywords: data.seo_keywords ? data.seo_keywords.join(", ") : ""
            });
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const keywordsArray = formData.seo_keywords
            .split(",")
            .map(k => k.trim())
            .filter(k => k.length > 0);

        const payload: any = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            featured_image: formData.featured_image,
            status: formData.status,
            seo_title: formData.seo_title,
            seo_description: formData.seo_description,
            seo_keywords: keywordsArray
        };

        if (formData.status === 'published' && (!isNew || formData.status === 'published')) {
            payload.published_at = new Date().toISOString();
        }

        let result;
        if (isNew) {
            result = await supabase.from("posts").insert(payload);
        } else {
            result = await supabase.from("posts").update(payload).eq("id", id);
        }

        const { error } = result;

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: `Post ${isNew ? "created" : "updated"} successfully`,
            });
            navigate("/admin/blog");
        }
        setIsLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleFeatureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, featured_image: url }));
            toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {isNew ? "Create Post" : "Edit Post"}
                </h2>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-100/50">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <CardTitle className="text-xl text-slate-700">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-base font-semibold text-slate-600">Post Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            title,
                                            slug: isNew ? generateSlug(title) : prev.slug
                                        }));
                                    }}
                                    required
                                    className="text-lg font-medium p-6 border-slate-200 focus:ring-purple-200"
                                    placeholder="Enter an engaging title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold text-slate-600">Content Editor</Label>
                                <div className="border border-slate-200 rounded-lg overflow-hidden min-h-[500px]">
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                        className="min-h-[500px]"
                                        placeholder="Start writing your amazing story..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="font-semibold text-slate-600">Excerpt (Short Summary)</Label>
                                <Textarea
                                    id="excerpt"
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    className="resize-none border-slate-200 focus:ring-purple-200"
                                    placeholder="A brief summary for search results..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-gray-100/50">
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="seo_title">SEO Title</Label>
                                <Input
                                    id="seo_title"
                                    value={formData.seo_title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                                    placeholder={formData.title}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo_description">Meta Description</Label>
                                <Textarea
                                    id="seo_description"
                                    rows={2}
                                    value={formData.seo_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo_keywords">Keywords (Comma separated)</Label>
                                <Input
                                    id="seo_keywords"
                                    value={formData.seo_keywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                                    placeholder="affiliate, marketing, tips"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-100/50">
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg h-11 text-base"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-5 w-5" />
                                )}
                                Save Post
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-gray-100/50">
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="upload" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                    <TabsTrigger value="url">URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload" className="pt-4">
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors relative">
                                        <Input
                                            id="featured-upload"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={handleFeatureImageUpload}
                                            disabled={isUploading}
                                        />
                                        <div className="flex flex-col items-center pointer-events-none">
                                            {isUploading ? (
                                                <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
                                            ) : (
                                                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                            )}
                                            <span className="text-sm font-semibold text-slate-700 text-center">
                                                {isUploading ? "Uploading..." : "Click to Upload Cover"}
                                            </span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="url" className="pt-4">
                                    <Input
                                        id="featured_image"
                                        value={formData.featured_image}
                                        onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </TabsContent>
                            </Tabs>

                            {formData.featured_image && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm group relative">
                                    <img
                                        src={formData.featured_image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, featured_image: "" }))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default PostEditor;
