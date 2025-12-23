
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Bot, Key, ShieldCheck, Loader2 } from "lucide-react";

interface AiConfig {
    openai_key?: string;
    gemini_key?: string;
    anthropic_key?: string;
    perplexity_key?: string;
    deepseek_key?: string;
    groq_key?: string;
    openrouter_key?: string;
    image_model?: "dall-e-3" | "midjourney" | "stable-diffusion";
}

export const AiSettings = () => {
    const [config, setConfig] = useState<AiConfig>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "ai_config")
                .single();

            if (data) {
                setConfig(data.value as AiConfig);
            }
        } catch (err) {
            console.error("Error loading AI config:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({
                    key: "ai_config",
                    value: config as any,
                    description: "AI Provider API Keys and Settings"
                });

            if (error) throw error;
            toast.success("AI настройки сохранены");
        } catch (err) {
            toast.error("Ошибка при сохранении");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (key: keyof AiConfig, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Загрузка настроек...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Bot className="w-6 h-6 text-indigo-600" />
                        AI Providers & Keys
                    </h2>
                    <p className="text-slate-500">Настройте ключи API для различных нейросетей</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Сохранить настройки
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm shadow-sm border-indigo-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            Top Tier Models
                        </CardTitle>
                        <CardDescription>Основные провайдеры для генерации статей</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>OpenAI API Key (ChatGPT-4o)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="sk-..."
                                    value={config.openai_key || ""}
                                    onChange={(e) => handleChange("openai_key", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Google Gemini API Key</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="AIza..."
                                    value={config.gemini_key || ""}
                                    onChange={(e) => handleChange("gemini_key", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Anthropic API Key (Claude 3.5)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="sk-ant..."
                                    value={config.anthropic_key || ""}
                                    onChange={(e) => handleChange("anthropic_key", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm shadow-sm border-indigo-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className="w-5 h-5 text-purple-600" />
                            Specialized Models
                        </CardTitle>
                        <CardDescription>Скоростные и поисковые модели</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>OpenRouter API Key (All-in-One)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="sk-or-v1..."
                                    value={config.openrouter_key || ""}
                                    onChange={(e) => handleChange("openrouter_key", e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500">Access Gemini, Claude, Llama via one key.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Perplexity API Key (Online Search)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="pplx-..."
                                    value={config.perplexity_key || ""}
                                    onChange={(e) => handleChange("perplexity_key", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>DeepSeek API Key (Coding & Logic)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="sk-..."
                                    value={config.deepseek_key || ""}
                                    onChange={(e) => handleChange("deepseek_key", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Groq API Key (Ultra Fast)</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    className="pl-9"
                                    placeholder="gsk_..."
                                    value={config.groq_key || ""}
                                    onChange={(e) => handleChange("groq_key", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
