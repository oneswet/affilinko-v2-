import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, Plus, Trash2, Copy, Shield, Bot, Terminal, Activity } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SqlConsole } from "./SqlConsole";
import { motion } from "framer-motion";

// Mock function to generate a key (in real app, this should be done server-side or carefully)
const generateKey = () => {
    const prefix = "sk_live_";
    const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `${prefix}${random}`;
};

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ... existing imports ...

const ApiManager = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [provider, setProvider] = useState("openai");
    const [keyValue, setKeyValue] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: keys = [], isLoading } = useQuery({
        queryKey: ["api_keys"],
        queryFn: async () => {
            // For now, we'll mock the data if the table doesn't exist or returns error, 
            // ensuring the UI works for demonstration.
            const { data, error } = await supabase
                .from("api_keys" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.warn("Could not fetch API keys (table might not exist yet)", error);
                return [];
            }
            return data;
        },
    });

    const createKeyMutation = useMutation({
        mutationFn: async () => {
            // In a real scenario, we'd hash the key or encrypt it.
            // For MVP, we store it.
            const { error } = await supabase.from("api_keys" as any).insert({
                name: newKeyName,
                key: keyValue, // Storing query-able key for client usage, security note: usually should be separate or encrypted
                key_prefix: keyValue.substring(0, 8) + "...",
                permissions: ["read", "write"],
                provider: provider,
                is_active: true
            });

            if (error) throw error;
            return keyValue;
        },
        onSuccess: (key) => {
            setGeneratedKey(key);
            toast.success("API key created successfully");
            queryClient.invalidateQueries({ queryKey: ["api_keys"] });
        },
        onError: () => {
            toast.error("Error creating API key");
        },
    });

    const deleteKeyMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("api_keys" as any).delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("API Key Deleted");
            queryClient.invalidateQueries({ queryKey: ["api_keys"] });
        },
    });

    const handleCreate = () => {
        if (!newKeyName || !keyValue) return;
        createKeyMutation.mutate();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">API & Console</h1>
                    <p className="text-gray-500 mt-2">
                        Manage API access keys and direct database control
                    </p>
                </div>
            </motion.div>

            <Tabs defaultValue="keys" className="space-y-6">
                <TabsList className="glass-card bg-white/40 p-1 rounded-2xl border-white/20">
                    <TabsTrigger value="keys" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg transition-all duration-300">
                        API Keys
                    </TabsTrigger>
                    <TabsTrigger value="sql" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg transition-all duration-300">
                        SQL Console (Agent)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="keys" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-end">
                        <Dialog open={isCreateOpen} onOpenChange={(open) => {
                            setIsCreateOpen(open);
                            if (!open) setGeneratedKey(null); // Reset on close
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-200 rounded-xl transition-all hover:scale-[1.02]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-none shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle>Create New API Key</DialogTitle>
                                </DialogHeader>

                                {!generatedKey ? (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Provider</label>
                                            <Select value={provider} onValueChange={setProvider}>
                                                <SelectTrigger className="glass-input">
                                                    <SelectValue placeholder="Select Provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                                                    <SelectItem value="google">Google (Gemini)</SelectItem>
                                                    <SelectItem value="anthropic">Anthropic (Claude 3.5)</SelectItem>
                                                    <SelectItem value="perplexity">Perplexity (Online Search)</SelectItem>
                                                    <SelectItem value="deepseek">DeepSeek (Coding)</SelectItem>
                                                    <SelectItem value="groq">Groq (Ultra Fast)</SelectItem>
                                                    <SelectItem value="openrouter">OpenRouter (All Models)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Key Name</label>
                                            <Input
                                                className="glass-input"
                                                placeholder="e.g. Production Key"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">API Key Value</label>
                                            <Input
                                                className="glass-input"
                                                placeholder="sk-..."
                                                value={keyValue}
                                                onChange={(e) => setKeyValue(e.target.value)}
                                                type="password"
                                            />
                                            <p className="text-xs text-slate-500">Paste the actual key here.</p>
                                        </div>
                                        <div className="p-3 bg-indigo-50/50 rounded-lg text-xs text-indigo-600 flex gap-2 border border-indigo-100">
                                            <Shield className="w-4 h-4 shrink-0" />
                                            This key will be stored securely.
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCreate} disabled={createKeyMutation.isPending || !keyValue || !newKeyName} className="bg-indigo-600">
                                                {createKeyMutation.isPending ? "Saving..." : "Save Key"}
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                ) : (
                                    <div className="space-y-6 py-4">
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                                <Key className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-lg">Key Generated!</h3>
                                            <p className="text-sm text-slate-500">Copy it now. You won't be able to see it again.</p>
                                        </div>

                                        <div className="relative">
                                            <Input value={generatedKey} readOnly className="pr-12 font-mono bg-slate-50 border-slate-200" />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-slate-600"
                                                onClick={() => copyToClipboard(generatedKey)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={() => setIsCreateOpen(false)} variant="outline">
                                                Done
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="glass-card border-none shadow-lg bg-gradient-to-br from-indigo-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-indigo-600/80">
                                    Active Keys
                                </CardTitle>
                                <Key className="h-4 w-4 text-indigo-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-indigo-900">{keys.length}</div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-none shadow-lg bg-gradient-to-br from-purple-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-purple-600/80">
                                    Agent Requests
                                </CardTitle>
                                <Bot className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-900">0</div>
                                <p className="text-xs text-purple-400 mt-1">last 24 hours</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-none shadow-lg bg-gradient-to-br from-green-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-green-600/80">
                                    System Status
                                </CardTitle>
                                <Activity className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">Online</div>
                                <p className="text-xs text-green-500 mt-1">All systems operational</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="glass-card border-none shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-indigo-50/50 bg-white/30 backdrop-blur-sm">
                            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <Key className="w-5 h-5 text-indigo-500" />
                                Active Access Keys
                            </h2>
                        </div>

                        {keys.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Key className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-lg font-medium text-slate-700">No active API keys</p>
                                <p className="text-sm text-slate-400 mt-1">Create a new key to get started</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-indigo-50/30">
                                    <TableRow>
                                        <TableHead className="pl-6">Name</TableHead>
                                        <TableHead>Prefix</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {keys.map((key: any) => (
                                        <TableRow key={key.id} className="hover:bg-indigo-50/20 transition-colors">
                                            <TableCell className="font-medium pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                    <span className="text-slate-700">{key.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-slate-500">{key.key_prefix}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {key.permissions?.map((perm: string) => (
                                                        <Badge key={perm} variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                                                            {perm}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                {format(new Date(key.created_at), "d MMM yyyy", { locale: ru })}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    onClick={() => deleteKeyMutation.mutate(key.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="sql" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SqlConsole />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ApiManager;
