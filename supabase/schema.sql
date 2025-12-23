
-- Enable necessary extensions if not valid (Supabase default usually has these)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DEPRECATED: We are not using a separate role table, but rather a role column on profiles
-- Ensure public.profiles exists and has the correct schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers Table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  rating DECIMAL(3, 1),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id),
  category_id UUID REFERENCES public.categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Placements
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., 'home_hero', 'sidebar_top'
  description TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ads
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'html', 'native')),
  placement_id UUID REFERENCES public.ad_placements(id),
  image_url TEXT,
  destination_url TEXT,
  html_content TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts / Subscribers
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  tags TEXT[], -- Array of strings for tagging
  is_subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMTP Configurations
CREATE TABLE IF NOT EXISTS public.smtp_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., 'Marketing Mailer', 'Support'
  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL, -- In real app, encrypt this!
  encryption TEXT DEFAULT 'tls', -- ssl, tls, none
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML content
  smtp_config_id UUID REFERENCES public.smtp_configs(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Meta
CREATE TABLE IF NOT EXISTS public.seo_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL, -- e.g., '/', '/blog', '/providers/PROVIDER_SLUG'
  title TEXT,
  description TEXT,
  keywords TEXT[],
  og_image TEXT,
  no_index BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Note: In a real migration, we might want to drop existing policies to ensure no conflicts, 
-- but for now we will use DO blocks or just assume clean slate/replace.

-- Profiles: Public read (for bios), Admin write
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Providers: Public read, Admin write
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;
CREATE POLICY "Providers are viewable by everyone" ON public.providers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage providers" ON public.providers;
CREATE POLICY "Admins can manage providers" ON public.providers FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Posts: Public read (published), Admin write
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.posts;
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' OR role = 'editor'))
);

-- Categories: Public read, Admin write
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' OR role = 'editor'))
);

-- Ads/Placements: Public read (active), Admin write
DROP POLICY IF EXISTS "Active ads are viewable by everyone" ON public.ads;
CREATE POLICY "Active ads are viewable by everyone" ON public.ads FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;
CREATE POLICY "Admins can manage ads" ON public.ads FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Placements are viewable by everyone" ON public.ad_placements;
CREATE POLICY "Placements are viewable by everyone" ON public.ad_placements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage placements" ON public.ad_placements;
CREATE POLICY "Admins can manage placements" ON public.ad_placements FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- SEO: Public read, Admin write
DROP POLICY IF EXISTS "SEO is viewable by everyone" ON public.seo_meta;
CREATE POLICY "SEO is viewable by everyone" ON public.seo_meta FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage seo" ON public.seo_meta;
CREATE POLICY "Admins can manage seo" ON public.seo_meta FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' OR role = 'editor'))
);

-- Contacts/SMTP/Campaigns: Admin only
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
CREATE POLICY "Admins can manage contacts" ON public.contacts FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Admins can manage smtp" ON public.smtp_configs;
CREATE POLICY "Admins can manage smtp" ON public.smtp_configs FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Functions for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()    
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

DROP TRIGGER IF EXISTS on_providers_updated ON public.providers;
CREATE TRIGGER on_providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

DROP TRIGGER IF EXISTS on_posts_updated ON public.posts;
CREATE TRIGGER on_posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

DROP TRIGGER IF EXISTS on_ads_updated ON public.ads;
CREATE TRIGGER on_ads_updated BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

DROP TRIGGER IF EXISTS on_campaigns_updated ON public.campaigns;
CREATE TRIGGER on_campaigns_updated BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

DROP TRIGGER IF EXISTS on_seo_meta_updated ON public.seo_meta;
CREATE TRIGGER on_seo_meta_updated BEFORE UPDATE ON public.seo_meta FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
