
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Posts from "./pages/Posts";
import Cases from "./pages/Cases";
import Networks from "./pages/Networks";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";

// Feature Modules Imports
import ProviderManager from "./pages/admin/providers";
import ProviderEditor from "./pages/admin/providers/ProviderEditor";
import BlogManager from "./pages/admin/blog";
import PostEditor from "./pages/admin/blog/PostEditor";
import AdsManager from "./pages/admin/ads";
import AdEditor from "./pages/admin/ads/AdEditor";
import PlacementManager from "./pages/admin/ads/PlacementManager";
import AdUnits from "@/pages/admin/ads/AdUnits";
import Contacts from "./pages/admin/contacts";
import SmtpManager from "./pages/admin/contacts/SmtpManager";
import CampaignManager from "./pages/admin/contacts/CampaignManager";
import SeoManager from "./pages/admin/seo";
import ApiManager from "./pages/admin/api";
import AiDashboard from "./pages/admin/ai";
import NewsScraper from "./pages/admin/ai/NewsScraper";
import AdminModulePlaceholder from "./components/admin/AdminModulePlaceholder";

import { SiteConfigProvider } from "./context/SiteConfigContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteConfigProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/networks" element={<Networks />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/events" element={<Events />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="crm" element={<Contacts />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="blog/new" element={<PostEditor />} />
              <Route path="blog/edit/:id" element={<PostEditor />} />
              <Route path="blog/:id" element={<PostEditor />} />

              {/* Ads & Offers */}
              <Route path="ads" element={<AdsManager />} />
              <Route path="ads/new" element={<AdEditor />} />
              <Route path="ads/edit/:id" element={<AdEditor />} />
              <Route path="ad-units" element={<AdUnits />} />
              <Route path="placements" element={<PlacementManager />} />

              {/* Contacts & Mail */}
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/campaigns" element={<CampaignManager />} />
              <Route path="contacts/smtp" element={<SmtpManager />} />

              {/* Feature Modules */}
              <Route path="networks" element={<ProviderManager />} />
              <Route path="networks/edit/:id" element={<ProviderEditor />} />
              <Route path="networks/new" element={<ProviderEditor />} />

              {/* SEO & API & AI */}
              <Route path="seo" element={<SeoManager />} />
              <Route path="api" element={<ApiManager />} />
              <Route path="ai-writer" element={<AiDashboard />} />
              <Route path="news-scraper" element={<NewsScraper />} />

              {/* Placeholders for future modules */}
              <Route path="cases" element={<AdminModulePlaceholder title="Case Studies Manager" description="Manage your success stories and case studies." />} />
              <Route path="edu" element={<AdminModulePlaceholder title="Education Module" description="Create and manage educational courses and content." />} />
              <Route path="services" element={<AdminModulePlaceholder title="Service Manager" description="Configure your service offerings and pricing packages." />} />
              <Route path="events" element={<AdminModulePlaceholder title="Events Manager" description="Schedule and manage webinars, conferences, and meetups." />} />
              <Route path="offers" element={<AdminModulePlaceholder title="Offers Manager" description="Manage special offers, discounts, and promotional campaigns." />} />

            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
