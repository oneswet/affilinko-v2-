
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const ProviderEditor = () => {
    const { id } = useParams();
    const isNew = !id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        logo_url: "",
        website_url: "",
        rating: "0",
        is_featured: false
    });

    useEffect(() => {
        if (!isNew && id) {
            fetchProvider(id);
        }
    }, [id, isNew]);

    const fetchProvider = async (providerId: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("providers")
            .select("*")
            .eq("id", providerId)
            .single();

        if (error) {
            toast({
                title: "Error",
                description: "Failed to fetch provider details",
                variant: "destructive",
            });
            navigate("/admin/providers");
        } else if (data) {
            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || "",
                logo_url: data.logo_url || "",
                website_url: data.website_url || "",
                rating: data.rating?.toString() || "0",
                is_featured: data.is_featured || false
            });
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            rating: parseFloat(formData.rating)
        };

        let result;
        if (isNew) {
            result = await supabase.from("providers").insert(payload);
        } else {
            result = await supabase.from("providers").update(payload).eq("id", id);
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
                description: `Provider ${isNew ? "created" : "updated"} successfully`,
            });
            navigate("/admin/providers");
        }
        setIsLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/providers")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isNew ? "Create Provider" : "Edit Provider"}
                </h2>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Provider Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Provider Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            slug: isNew ? generateSlug(name) : prev.slug
                                        }));
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL Friendly) *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="logo_url">Logo URL</Label>
                                <Input
                                    id="logo_url"
                                    placeholder="https://..."
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    placeholder="https://..."
                                    value={formData.website_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (0-5)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Switch
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                                />
                                <Label htmlFor="is_featured">Featured Provider (Show on Home)</Label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 min-w-[120px]">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Provider
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProviderEditor;
