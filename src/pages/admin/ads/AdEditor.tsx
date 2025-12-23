
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const AdEditor = () => {
    const { id } = useParams();
    const isNew = !id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [placements, setPlacements] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        type: "image", // image, html, native
        placement_id: "",
        image_url: "",
        destination_url: "",
        html_content: "",
        is_active: true
    });

    useEffect(() => {
        fetchPlacements();
        if (!isNew && id) {
            fetchAd(id);
        }
    }, [id, isNew]);

    const fetchPlacements = async () => {
        const { data } = await supabase.from("ad_placements").select("*");
        setPlacements(data || []);
    };

    const fetchAd = async (adId: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("ads")
            .select("*")
            .eq("id", adId)
            .single();

        if (error) {
            toast({ title: "Error", description: "Failed to fetch ad", variant: "destructive" });
            navigate("/admin/ads");
        } else if (data) {
            setFormData({
                title: data.title,
                type: data.type,
                placement_id: data.placement_id || "",
                image_url: data.image_url || "",
                destination_url: data.destination_url || "",
                html_content: data.html_content || "",
                is_active: data.is_active || false
            });
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload: any = { ...formData };
        if (payload.placement_id === "") payload.placement_id = null; // Handle unselected

        let result;
        if (isNew) {
            result = await supabase.from("ads").insert(payload);
        } else {
            result = await supabase.from("ads").update(payload).eq("id", id);
        }

        const { error } = result;

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: `Ad ${isNew ? "created" : "updated"} successfully` });
            navigate("/admin/ads");
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/ads")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isNew ? "Create Ad" : "Edit Ad"}
                </h2>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Ad Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Ad Title (Internal Reference)</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Ad Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image">Image Banner</SelectItem>
                                        <SelectItem value="html">HTML / JS Code</SelectItem>
                                        {/* <SelectItem value="native">Native Style</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Placement</Label>
                                <Select
                                    value={formData.placement_id}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, placement_id: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select spot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {placements.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.width}x{p.height})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {formData.type === "image" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="image_url">Image URL</Label>
                                    <Input
                                        id="image_url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="destination_url">Destination URL (Click Link)</Label>
                                    <Input
                                        id="destination_url"
                                        value={formData.destination_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, destination_url: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                                {formData.image_url && (
                                    <div className="p-4 border rounded bg-gray-50 flex items-center justify-center">
                                        <img src={formData.image_url} alt="Preview" className="max-h-48" />
                                    </div>
                                )}
                            </>
                        )}

                        {formData.type === "html" && (
                            <div className="space-y-2">
                                <Label htmlFor="html_content">HTML / JS Code</Label>
                                <Textarea
                                    id="html_content"
                                    rows={8}
                                    value={formData.html_content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                                    className="font-mono text-xs"
                                    placeholder="<script>...</script>"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-4">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                            />
                            <Label htmlFor="is_active">Active (Visible)</Label>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Ad
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdEditor;
