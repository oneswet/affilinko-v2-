
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiWriter } from "./AiWriter";
import { AiSettings } from "./AiSettings";
import NewsScraper from "./NewsScraper";
import { Newspaper, PenTool, Settings } from "lucide-react";

const AiDashboard = () => {
    return (
        <div className="space-y-4 animate-fade-in h-screen flex flex-col pb-6">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Studio</h1>
                    <p className="text-slate-500">Professional writing suite & automation agent.</p>
                </div>
            </div>

            <Tabs defaultValue="writer" className="flex-1 flex flex-col space-y-6">
                <TabsList className="bg-white/80 backdrop-blur border border-slate-200 p-1 w-fit rounded-full shadow-sm">
                    <TabsTrigger value="writer" className="rounded-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        <PenTool className="w-4 h-4" />
                        Article Writer
                    </TabsTrigger>
                    <TabsTrigger value="news" className="rounded-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        <Newspaper className="w-4 h-4" />
                        News Scraper
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-full px-6 gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        <Settings className="w-4 h-4" />
                        API Keys
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="writer" className="flex-1 outline-none data-[state=inactive]:hidden">
                    <AiWriter />
                </TabsContent>

                <TabsContent value="news" className="flex-1 outline-none data-[state=inactive]:hidden">
                    <NewsScraper />
                </TabsContent>

                <TabsContent value="settings" className="flex-1 outlining-none data-[state=inactive]:hidden">
                    <AiSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AiDashboard;
