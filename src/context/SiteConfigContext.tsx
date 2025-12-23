
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    LayoutDashboard, Users, FileText, Megaphone, Briefcase,
    Mail, Globe, Trophy, GraduationCap, Zap, Calendar, Search,
    Bot, Settings, Menu, LayoutTemplate, Monitor, Newspaper
} from "lucide-react";

// Map string icon names to actual components
export const ICON_MAP: Record<string, any> = {
    LayoutDashboard, Users, FileText, Megaphone, Briefcase,
    Mail, Globe, Trophy, GraduationCap, Zap, Calendar, Search,
    Bot, Settings, Menu, LayoutTemplate, Monitor, Newspaper
};

interface ThemeConfig {
    primary: string;
    secondary: string;
    radius: string;
    font: string;
}

export interface MenuItem {
    title: string;
    path: string;
    icon: string;
}

interface SiteConfigContextType {
    theme: ThemeConfig | null;
    menuItems: MenuItem[];
    isLoading: boolean;
    refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeConfig | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const { data, error } = await (supabase
                .from("site_settings" as any)
                .select("*") as any);

            if (error) {
                console.warn("Could not fetch site settings:", error);
                return;
            }

            // Parse settings
            data?.forEach((setting: any) => {
                if (setting.key === "theme") {
                    const themeVal = setting.value as ThemeConfig;
                    setTheme(themeVal);
                    // Apply to root for runtime theming
                    document.documentElement.style.setProperty("--primary", themeVal.primary);
                    document.documentElement.style.setProperty("--radius", themeVal.radius);
                    // (You would convert hex to HSL here if your tailwind config expects HSL, 
                    // but for now we assume values are handled or we set direct properties if modified config)
                }
                if (setting.key === "admin_menu") {
                    // Force default menu items for stability as per user request
                    // const menu = setting.value as MenuItem[];
                    // if (menu && menu.length > 0) {
                    //     setMenuItems(menu);
                    // }
                }
            });
        } catch (err) {
            console.error("Error loading site config:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const DEFAULT_MENU_ITEMS: MenuItem[] = [
        { title: "Dashboard", path: "/admin", icon: "LayoutDashboard" },
        { title: "Providers", path: "/admin/networks", icon: "Globe" },
        { title: "Blog Posts", path: "/admin/blog", icon: "FileText" },
        { title: "Ads Manager", path: "/admin/ads", icon: "Megaphone" },
        { title: "Ad Units", path: "/admin/ad-units", icon: "LayoutTemplate" },
        { title: "Placements", path: "/admin/placements", icon: "Monitor" },
        { title: "AI Writer", path: "/admin/ai-writer", icon: "Bot" },
        { title: "News Scraper", path: "/admin/news-scraper", icon: "Newspaper" },
        { title: "Contacts", path: "/admin/contacts", icon: "Mail" },
        { title: "SEO", path: "/admin/seo", icon: "Search" },
        { title: "API Keys", path: "/admin/api", icon: "Settings" },
        // Placeholder / Future Modules
        { title: "Services", path: "/admin/services", icon: "Zap" },
        { title: "Events", path: "/admin/events", icon: "Calendar" },
        { title: "Cases", path: "/admin/cases", icon: "Briefcase" },
        { title: "Education", path: "/admin/edu", icon: "GraduationCap" },
        { title: "Offers", path: "/admin/offers", icon: "Trophy" }
    ];

    useEffect(() => {
        fetchConfig();
        // Fallback for immediate render if needed or initial state
        if (menuItems.length === 0) {
            setMenuItems(DEFAULT_MENU_ITEMS);
        }

        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'site_settings',
                },
                () => {
                    console.log('Settings changed, reloading...');
                    fetchConfig();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);



    return (
        <SiteConfigContext.Provider value={{ theme, menuItems, isLoading, refreshConfig: fetchConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (context === undefined) {
        throw new Error("useSiteConfig must be used within a SiteConfigProvider");
    }
    return context;
};
