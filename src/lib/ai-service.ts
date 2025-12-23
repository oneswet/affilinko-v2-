
import { supabase } from "@/integrations/supabase/client";

export interface AiConfig {
    openai_key?: string;
    gemini_key?: string;
    anthropic_key?: string;
    perplexity_key?: string;
    deepseek_key?: string;
    groq_key?: string;
    openrouter_key?: string;
}

export const getAiConfig = async (): Promise<AiConfig | null> => {
    try {
        const { data: settingsData } = await supabase
            .from("site_settings" as any)
            .select("value")
            .eq("key", "ai_config")
            .single();

        const baseConfig = (settingsData as any)?.value || {} as AiConfig;

        const { data: keysData } = await supabase
            .from("api_keys" as any)
            .select("provider, key")
            .eq("is_active", true);

        if (keysData && keysData.length > 0) {
            keysData.forEach((k: any) => {
                if (k.provider === 'openai') baseConfig.openai_key = k.key;
                if (k.provider === 'google') baseConfig.gemini_key = k.key;
                if (k.provider === 'anthropic') baseConfig.anthropic_key = k.key;
                if (k.provider === 'perplexity') baseConfig.perplexity_key = k.key;
                if (k.provider === 'deepseek') baseConfig.deepseek_key = k.key;
                if (k.provider === 'groq') baseConfig.groq_key = k.key;
                if (k.provider === 'openrouter') baseConfig.openrouter_key = k.key;
            });
        }

        return baseConfig;
    } catch (error) {
        console.error("Error in getAiConfig:", error);
        return null;
    }
};

export const getApiKeyForProvider = (config: AiConfig | null, provider: string): string | null => {
    if (!config) return null;
    switch (provider) {
        case "openai": return config.openai_key || null;
        case "google": return config.gemini_key || null;
        case "anthropic": return config.anthropic_key || null;
        case "perplexity": return config.perplexity_key || null;
        case "deepseek": return config.deepseek_key || null;
        case "groq": return config.groq_key || null;
        case "openrouter": return config.openrouter_key || null;
        default: return null;
    }
};

interface GenerateOptions {
    provider: string;
    model: string;
    prompt: string;
    systemPrompt?: string;
    apiKey: string;
}

export const generateContent = async ({ provider, model, prompt, systemPrompt, apiKey }: GenerateOptions): Promise<string> => {
    let response;
    let generatedText = "";

    const userPrompt = prompt;
    const systemPromptContent = systemPrompt || "You are a helpful assistant.";

    try {
        if (provider === "openai") {
            response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "system", content: systemPromptContent }, { role: "user", content: userPrompt }],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            generatedText = data.choices?.[0]?.message?.content || "";

        } else if (provider === "google") {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userPrompt }] }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        } else if (provider === "perplexity") {
            response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "system", content: systemPromptContent }, { role: "user", content: userPrompt }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            generatedText = data.choices?.[0]?.message?.content || "";
        } else if (provider === "openrouter") {
            response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "system", content: systemPromptContent }, { role: "user", content: userPrompt }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            generatedText = data.choices?.[0]?.message?.content || "";
        }

        return generatedText;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

export const generateImage = async (prompt: string, apiKey: string): Promise<string> => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                response_format: "url"
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.data[0].url;
    } catch (error) {
        console.error("Image Generation Error:", error);
        throw error;
    }
};
