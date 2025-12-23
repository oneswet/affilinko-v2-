
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Globe, Loader2, Newspaper, Search, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getAiConfig, getApiKeyForProvider, generateContent, AiConfig } from "@/lib/ai-service";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const NewsScraper = () => {
    // Search State
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [generatedContent, setGeneratedContent] = useState("");

    // Configuration State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [config, setConfig] = useState<AiConfig | null>(null);

    // Settings
    const [model, setModel] = useState("sonar-pro");
    const [provider, setProvider] = useState("perplexity");
    const [includeTable, setIncludeTable] = useState(true);
    const [seoOptimize, setSeoOptimize] = useState(true);
    const [language, setLanguage] = useState("english");

    useEffect(() => {
        // Auto-detect provider based on model
        if (model.includes("openrouter")) setProvider("openrouter");
        else if (model.includes("gemini")) setProvider("google");
        else if (model.includes("deepseek")) setProvider("deepseek");
        else setProvider("perplexity"); // default for sonar
    }, [model]);

    useEffect(() => {
        const loadConfig = async () => {
            const aiConfig = await getAiConfig();
            setConfig(aiConfig);
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (config) {
            const key = getApiKeyForProvider(config, provider);
            setApiKey(key);
        }
    }, [config, provider]);

    const handleSearch = async () => {
        if (!query.trim()) { toast.error("Please enter a topic"); return; }
        if (!apiKey) {
            toast.error(`No API Key found for ${provider}. Please add one in AI Settings.`);
            return;
        }

        setIsSearching(true);
        setGeneratedContent("");

        try {
            // Specialized Prompt for Professional News Report
            const systemPrompt = `
                You are a Senior Chief Editor and SEO Specialist. 
                Your task is to conduct deep research and write a highly professional, comprehensive news report.
                Format the output strictly as HTML suitable for a rich text editor.
                Use <h1> for the Main Title.
                Use <h2> for Section Headers.
                Use <h3> for Sub-sections.
                Use <h4> for Breaks.
                Use <p> for paragraphs.
                Use <ul>/<li> for lists.
                Do NOT use Markdown backticks. Return RAW HTML.
                CRITICAL: Remove all citation numbers like [1], [2], [3]. Never output brackets with numbers.
                CRITICAL: Write the entire report in ${language}. Translate any findings if necessary.
            `;

            let userPrompt = `Research and write a comprehensive news report on: "${query}".
            
            Structure Constraints:
            1. Title: Engaging, SEO-optimized Headline (H1).
            2. Executive Summary: A concise professional summary of the latest events (H2 + p).
            3. Key Developments: Detailed analysis of the situation (H2 + H3s).
            4. SEO Optimization: Use bolding (<strong>) for key entities/names.
            `;

            if (includeTable) {
                userPrompt += `
                5. Data/Sources: Create a standard HTML Table (<table><thead>...</thead><tbody>...</tbody></table>) summarizing Key Facts or Sources found. Do not add inline styles, simply use standard tags.
                `;
            }

            userPrompt += `
            Date Context: ${(new Date()).toDateString()}.
            Tone: Objective, Authoritative, Journalistic.
            Length: Comprehensive (at least 800-1200 words).
            `;

            let finalModel = model;
            if (provider === "openrouter") {
                finalModel = model.replace("openrouter/", "");
            }

            const text = await generateContent({
                provider: provider,
                model: finalModel,
                prompt: userPrompt,
                systemPrompt: systemPrompt,
                apiKey
            });

            // Clean any potential markdown fencing or citations
            let cleanHtml = text
                .replace(/\[\d+(?:,\s*\d+)*\]/g, "")
                .replace(/```html/g, "")
                .replace(/```/g, "")
                .trim();

            // Basic fallback formatting if model fails to give HTML (rare with instructions)
            if (!cleanHtml.includes("<h")) {
                cleanHtml = `<h1>Latest News: ${query}</h1><p>${cleanHtml.replace(/\n\n/g, "</p><p>")}</p>`;
            }

            setGeneratedContent(cleanHtml);
            toast.success("News Report Generated!");

        } catch (error: any) {
            console.error("Search error:", error);
            toast.error(`Failed to fetch news: ${error.message}`);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSavePost = async (postStatus: 'draft' | 'published') => {
        if (!generatedContent) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login.");
                return;
            }

            // Extract title from H1 if possible, else use query
            let title = `News: ${query}`;
            const titleMatch = generatedContent.match(/<h1>(.*?)<\/h1>/);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1].replace(/<[^>]*>/g, ""); // strip inner tags if any
            }

            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) + `-${Date.now().toString().slice(-4)}`;

            const { error } = await supabase.from("posts").insert({
                title: title,
                slug: slug,
                content: generatedContent,
                status: postStatus,
                author_id: user.id
            });

            if (error) throw error;
            toast.success(postStatus === 'published' ? "Published successfully!" : "Saved to Drafts!");

        } catch (e) {
            toast.error("Failed to save post.");
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Professional News Scraper</h1>
                    <p className="text-gray-500 mt-2">
                        Real-time research & automated report generation.
                    </p>
                </div>
                {!apiKey && (
                    <Badge variant="destructive" className="px-4 py-2 text-sm">
                        API Key Missing for {provider}
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
                {/* SETTINGS SIDEBAR */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <Card className="p-6 glass-card border-none shadow-xl space-y-6">
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold text-slate-700">Topic of Interest</Label>
                            <Input
                                placeholder="e.g. AI Regulation in EU, Bitcoin Price Action..."
                                className="glass-input text-lg py-6"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <Label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Search Engine (Model)</Label>
                            <Select value={model} onValueChange={setModel}>
                                <SelectTrigger className="bg-white/50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Perplexity (Best for Search)</div>
                                    <SelectItem value="sonar-pro">Sonar Pro (Deep Research)</SelectItem>
                                    <SelectItem value="sonar">Sonar (Fast)</SelectItem>

                                    <div className="border-t my-1" />
                                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Google</div>
                                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>

                                    <div className="border-t my-1" />
                                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Advanced Research</div>
                                    <SelectItem value="deepseek-chat">DeepSeek V3 (Fast)</SelectItem>
                                    <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Language</Label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="bg-white/50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English (US)</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                    <SelectItem value="french">French</SelectItem>
                                    <SelectItem value="german">German</SelectItem>
                                    <SelectItem value="italian">Italian</SelectItem>
                                    <SelectItem value="portuguese">Portuguese</SelectItem>
                                    <SelectItem value="russian">Russian</SelectItem>
                                    <SelectItem value="arabic">Arabic</SelectItem>
                                    <SelectItem value="chinese">Chinese</SelectItem>
                                    <SelectItem value="japanese">Japanese</SelectItem>
                                    <SelectItem value="dutch">Dutch</SelectItem>
                                    <SelectItem value="hindi">Hindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-slate-600">Include Data Table</Label>
                                <Switch checked={includeTable} onCheckedChange={setIncludeTable} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-slate-600">SEO Keyword Highlight</Label>
                                <Switch checked={seoOptimize} onCheckedChange={setSeoOptimize} />
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            {isSearching ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                            Start Research
                        </Button>
                    </Card>
                </div>

                {/* EDITOR AREA */}
                <div className="lg:col-span-8 h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-indigo-50 bg-white/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                {isSearching ? "Searching..." : "Ready"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSavePost('draft')} disabled={!generatedContent}>
                                <Save className="w-4 h-4 mr-2" /> Save Draft
                            </Button>
                            <Button size="sm" onClick={() => handleSavePost('published')} className="bg-green-600 hover:bg-green-700 text-white" disabled={!generatedContent}>
                                <Globe className="w-4 h-4 mr-2" /> Publish Now
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <RichTextEditor
                            value={generatedContent}
                            onChange={setGeneratedContent}
                            className="h-full min-h-full border-none rounded-none bg-transparent"
                            placeholder="Research results will appear here..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsScraper;
