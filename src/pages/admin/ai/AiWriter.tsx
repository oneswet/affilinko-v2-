
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAiConfig, generateContent, getApiKeyForProvider, AiConfig, generateImage } from "@/lib/ai-service";
import { Loader2, PenTool, Image as ImageIcon, Sparkles, BarChart, Table as TableIcon, Star, Save, Globe } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export const AiWriter = () => {
    // Core Content State
    const [topic, setTopic] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");

    // UI State
    const [status, setStatus] = useState<"idle" | "generating" | "generated" | "error">("idle");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [config, setConfig] = useState<AiConfig | null>(null);

    // Configuration State
    const [model, setModel] = useState("gpt-4o");
    const [provider, setProvider] = useState("openai");
    const [contentType, setContentType] = useState("article");
    const [tone, setTone] = useState("professional");
    const [length, setLength] = useState("long"); // short, medium, long
    const [language, setLanguage] = useState("english");

    // Toggles
    const [humanize, setHumanize] = useState(true);
    const [seoMode, setSeoMode] = useState(true);
    const [includeFaq, setIncludeFaq] = useState(true);

    // Setup
    useEffect(() => {
        if (model.startsWith("gpt")) setProvider("openai");
        else if (model.startsWith("gemini")) setProvider("google");
        else if (model.startsWith("claude")) setProvider("anthropic");
        else if (model.includes("sonar") && !model.includes("openrouter")) setProvider("perplexity");
        else if (model.startsWith("deepseek")) setProvider("deepseek");
        else if (model.startsWith("llama") || model.startsWith("mixtral") || model.startsWith("gemma")) setProvider("groq");
        else if (model.includes("openrouter")) setProvider("openrouter");
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

    // Cleanup Utility
    const cleanHtml = (text: string) => {
        return text
            .replace(/\[\d+(?:,\s*\d+)*\]/g, "") // Remove [1], [1,2]
            .replace(/```html/g, "")
            .replace(/```/g, "")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/##\s*(.*?)$/gm, "<h2>$1</h2>")
            .trim();
    };

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error("Please enter a topic"); return; }
        if (!apiKey) { toast.error(`No API Key found for ${provider}`); return; }

        setStatus("generating");
        setGeneratedContent("");

        try {
            // Enhanced Prompt for Professional HTML Output
            const systemPrompt = `
                You are a professional Content Director and SEO Specialist.
                Generate high-quality, engaging content formatted in strict HTML.
                
                Formatting Rules:
                - Use <h1> for the main title.
                - Use <h2> for major sections (ensure clear hierarchy).
                - Use <h3> for subsections.
                - Use <h4> for detailed breakdowns.
                - Use <blockquote> for key takeaways or important quotes.
                - Use <table> for data comparisons (style tags will be handled by the editor, just use standard <table>, <thead>, <tbody>, <th>, <tr>, <td>).
                - Use <ul>/<li> for lists.
                - Do NOT use Markdown (no **bold** or ## headers). Use <strong> and <h1>..<h6> tags.
                - Do NOT wrap in \`\`\`html code blocks. Return raw HTML string only.
                - CRITICAL: Remove all citation numbers like [1], [2], [3]. Never output brackets with numbers.
                - CRITICAL: Write the entire response in ${language}.
            `;

            let userPrompt = `Write a ${length} ${tone} ${contentType} about "${topic}".
            
            Key Requirements:
            1. Engagement: Start with a compelling hook.
            2. Structure: Use short paragraphs and clear headings.
            3. Value: Include practical tips or distinct considerations.
            `;

            if (contentType === "review" || contentType === "guide") {
                userPrompt += `
                4. Data: Include a Comparison Table of key features/pros-cons if applicable.
                5. Verdict: End with a clear recommendation.
                `;
            }

            if (includeFaq) {
                userPrompt += `
                6. FAQ: Add a specialized FAQ section with 3-5 common questions at the end.
                `;
            }

            if (seoMode) {
                userPrompt += `
                7. SEO: Optimize for keywords related to "${topic}". Use <strong> for emphasis on keywords.
                `;
            }

            if (humanize) {
                userPrompt += `
                8. Tone: Ensure the writing sounds natural, avoiding repetitive AI patterns.
                `;
            }

            let finalModel = model;
            if (provider === "openrouter") finalModel = model.replace("openrouter/", "");

            const text = await generateContent({
                provider: provider,
                model: finalModel,
                prompt: userPrompt,
                systemPrompt: systemPrompt,
                apiKey
            });

            const cleanText = cleanHtml(text);

            setGeneratedContent(cleanText);
            setStatus("generated");
            toast.success("Content Generated!");

        } catch (error: any) {
            console.error("Generation error:", error);
            setStatus("error");
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleSavePost = async (postStatus: 'draft' | 'published') => {
        if (!generatedContent) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login to save.");
                return;
            }

            // Extract Title from H1
            let title = topic || "Untitled Post";
            const titleMatch = generatedContent.match(/<h1>(.*?)<\/h1>/);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1].replace(/<[^>]*>/g, "");
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
        } catch (e: any) {
            toast.error("Failed to save: " + e.message);
        }
    };

    // --- Magic Tools Logic ---

    const insertHtml = (html: string) => {
        setGeneratedContent(prev => prev + html);
        toast.success("Element added to editor!");
    };

    const addComparisonTable = () => {
        const table = `
            <table class="pro-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>Option A</th>
                        <th>Option B</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Pricing</strong></td>
                        <td>$10/mo</td>
                        <td>$20/mo</td>
                    </tr>
                    <tr>
                        <td><strong>Reliability</strong></td>
                        <td>High (99.9%)</td>
                        <td>Medium (95%)</td>
                    </tr>
                </tbody>
            </table>
            <p><br/></p>
        `;
        insertHtml(table);
    };

    const addRatingBox = () => {
        const box = `
            <div class="rating-box">
                <div class="rating-score">
                    9.5
                    <div class="rating-stars">★★★★★</div>
                </div>
                <div class="rating-content">
                    <div class="rating-title">Editor's Choice Award</div>
                    <p class="rating-desc">Top tier performance and value.</p>
                </div>
            </div>
            <p><br/></p>
        `;
        insertHtml(box);
    };

    const addAnalyticsChart = () => {
        const chart = `
            <div class="chart-container">
                <span class="chart-title">Performance Comparison</span>
                <div class="chart-bar">
                    <span class="chart-label">Metric A</span>
                    <div class="chart-track"><div class="chart-fill" style="width: 80%;"></div></div>
                    <span class="chart-value">80%</span>
                </div>
                <div class="chart-bar">
                    <span class="chart-label">Metric B</span>
                    <div class="chart-track"><div class="chart-fill" style="width: 60%;"></div></div>
                    <span class="chart-value">60%</span>
                </div>
            </div>
            <p><br/></p>
        `;
        insertHtml(chart);
    };

    const generateAiImage = async () => {
        if (!config?.openai_key) {
            toast.error("OpenAI API Key required for Image Generation");
            return;
        }
        setIsGeneratingImage(true);
        try {
            const prompt = `Professional informative blog illustration about: ${topic}. Modern, minimalist, flat vector style.`;
            const imageUrl = await generateImage(prompt, config.openai_key);
            const imgHtml = `<img src="${imageUrl}" alt="${topic}" style="width:100%; max-width:800px; border-radius:12px;" /><p><br/></p>`;
            insertHtml(imgHtml);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const addProsCons = () => {
        const html = `
            <div class="pros-cons-grid">
                <div class="pros-box">
                    <span class="box-title">Pros</span>
                    <ul class="box-list">
                        <li>Advantage 1</li>
                        <li>Advantage 2</li>
                    </ul>
                </div>
                <div class="cons-box">
                    <span class="box-title">Cons</span>
                    <ul class="box-list">
                        <li>Limitation 1</li>
                    </ul>
                </div>
            </div>
            <p><br/></p>
        `;
        insertHtml(html);
    };

    const wordCount = (html: string) => {
        return html.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-8">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <Card className="p-6 glass-card border-none shadow-xl space-y-6">
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-1">AI Writer Suite</h2>
                        <p className="text-sm text-slate-500">Create professional content with magic tools.</p>
                    </div>

                    <div className="space-y-4">
                        <Label className="font-semibold text-slate-700">Topic or Title</Label>
                        <Input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. The Future of AI in 2026..."
                            className="h-12 text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-400">Content Type</Label>
                            <Select value={contentType} onValueChange={setContentType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="article">Blog Article</SelectItem>
                                    <SelectItem value="review">Product Review</SelectItem>
                                    <SelectItem value="guide">How-to Guide</SelectItem>
                                    <SelectItem value="news">News Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-400">Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual / Friendly</SelectItem>
                                    <SelectItem value="journalistic">Journalistic</SelectItem>
                                    <SelectItem value="persuasive">Persuasive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-slate-400">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
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

                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-slate-400">AI Model</Label>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">OpenAI</div>
                                <SelectItem value="gpt-4o">GPT-4o (Best Overall)</SelectItem>
                                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast)</SelectItem>

                                <div className="border-t my-1" />
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Anthropic</div>
                                <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</SelectItem>
                                <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>

                                <div className="border-t my-1" />
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Google</div>
                                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>

                                <div className="border-t my-1" />
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">DeepSeek & Groq</div>
                                <SelectItem value="deepseek-chat">DeepSeek V3</SelectItem>
                                <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                                <SelectItem value="llama3-70b-8192">Llama 3 70B (Groq)</SelectItem>
                                <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</SelectItem>

                                <div className="border-t my-1" />
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Perplexity</div>
                                <SelectItem value="sonar-pro">Sonar Pro (Online)</SelectItem>
                                <SelectItem value="sonar">Sonar (Online)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-600">SEO Optimization</Label>
                            <Switch checked={seoMode} onCheckedChange={setSeoMode} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-600">Humanize (Bypass Detectors)</Label>
                            <Switch checked={humanize} onCheckedChange={setHumanize} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-600">Include FAQ</Label>
                            <Switch checked={includeFaq} onCheckedChange={setIncludeFaq} />
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg"
                        onClick={handleGenerate}
                        disabled={status === "generating"}
                    >
                        {status === "generating" ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Writing...</>
                        ) : (
                            <><PenTool className="w-5 h-5 mr-2" /> Generate Content</>
                        )}
                    </Button>
                </Card>

                {/* Magic Tools Panel */}
                <Card className="p-6 border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-700">Magic Tools</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={addComparisonTable}>
                            <TableIcon className="w-4 h-4 mr-2 text-indigo-500" /> Comparison
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={addRatingBox}>
                            <Star className="w-4 h-4 mr-2 text-amber-500" /> Rating Box
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={addAnalyticsChart}>
                            <BarChart className="w-4 h-4 mr-2 text-emerald-500" /> Chart
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={addProsCons}>
                            <div className="flex gap-0.5 text-xs font-bold mr-2"><span className="text-green-600">✓</span><span className="text-red-500">✕</span></div> Pros/Cons
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-slate-50 border-slate-200 col-span-2"
                            onClick={generateAiImage}
                            disabled={isGeneratingImage}
                        >
                            {isGeneratingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2 text-pink-500" />}
                            Generate AI Image
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Editor Area */}
            <div className="flex-1 h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-indigo-50 bg-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {wordCount(generatedContent)} Words
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSavePost('draft')} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                            <Save className="w-4 h-4 mr-2" /> Save Draft
                        </Button>
                        <Button size="sm" onClick={() => handleSavePost('published')} className="bg-green-600 hover:bg-green-700 text-white shadow-green-200 shadow-md">
                            <Globe className="w-4 h-4 mr-2" /> Publish Directly
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <RichTextEditor
                        value={generatedContent}
                        onChange={setGeneratedContent}
                        className="h-full min-h-full border-none rounded-none bg-transparent"
                        minHeight="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default AiWriter;
