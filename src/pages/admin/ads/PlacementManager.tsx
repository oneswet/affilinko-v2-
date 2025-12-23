
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash, Save, Monitor } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const PlacementManager = () => {
    const [placements, setPlacements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [newPlacement, setNewPlacement] = useState({
        name: "",
        description: "",
        width: "",
        height: ""
    });

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("ad_placements")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setPlacements(data || []);
        setIsLoading(false);
    };

    const handleCreate = async () => {
        if (!newPlacement.name) {
            toast({ title: "Error", description: "Name is required", variant: "destructive" });
            return;
        }

        const payload = {
            name: newPlacement.name,
            description: newPlacement.description,
            width: newPlacement.width ? parseInt(newPlacement.width) : null,
            height: newPlacement.height ? parseInt(newPlacement.height) : null,
        };

        const { error } = await supabase.from("ad_placements").insert(payload);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Placement created" });
            setNewPlacement({ name: "", description: "", width: "", height: "" });
            fetchPlacements();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this placement?")) return;
        const { error } = await supabase.from("ad_placements").delete().eq("id", id);
        if (!error) {
            toast({ title: "Success", description: "Placement deleted" });
            fetchPlacements();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Ad Placements</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm md:col-span-1">
                    <CardHeader>
                        <CardTitle>New Placement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name (Unique Identifier)</Label>
                            <Input
                                placeholder="e.g. home_hero"
                                value={newPlacement.name}
                                onChange={(e) => setNewPlacement(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Where does this appear?"
                                value={newPlacement.description}
                                onChange={(e) => setNewPlacement(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label>Width (px)</Label>
                                <Input
                                    type="number"
                                    placeholder="728"
                                    value={newPlacement.width}
                                    onChange={(e) => setNewPlacement(prev => ({ ...prev, width: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Height (px)</Label>
                                <Input
                                    type="number"
                                    placeholder="90"
                                    value={newPlacement.height}
                                    onChange={(e) => setNewPlacement(prev => ({ ...prev, height: e.target.value }))}
                                />
                            </div>
                        </div>
                        <Button onClick={handleCreate} className="w-full bg-purple-600 hover:bg-purple-700">
                            <Plus className="mr-2 h-4 w-4" /> Create Placement
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm md:col-span-2">
                    <CardHeader>
                        <CardTitle>Existing Placements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Dimensions</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {placements.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-mono font-medium text-xs">{p.name}</TableCell>
                                        <TableCell>{p.width}x{p.height}</TableCell>
                                        <TableCell className="text-gray-500">{p.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PlacementManager;
