
-- Create a table for global site settings (theme, menu, etc.)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Policies:
-- 1. Everyone can read settings (needed for public site theme)
create policy "Public settings are viewable by everyone" 
  on public.site_settings for select 
  using (true);

-- 2. Only admins can insert/update/delete
create policy "Admins can manage settings" 
  on public.site_settings for all 
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Initial Data: Default Theme and Admin Menu
insert into public.site_settings (key, value, description)
values 
  ('theme', '{
    "primary": "#4F46E5", 
    "secondary": "#9333EA",
    "radius": "0.75rem",
    "font": "Inter"
  }'::jsonb, 'Global visual theme configuration'),
  
  ('admin_menu', '[
    {"title": "Дашборд", "path": "/admin", "icon": "LayoutDashboard"},
    {"title": "CRM & Лиды", "path": "/admin/crm", "icon": "Users"},
    {"title": "Посты и Блог", "path": "/admin/blog", "icon": "FileText"},
    {"title": "Реклама (Ads)", "path": "/admin/ads", "icon": "Megaphone"},
    {"title": "Офферы (CPA)", "path": "/admin/offers", "icon": "Briefcase"},
    {"title": "Рассылки", "path": "/admin/contacts", "icon": "Mail"},
    {"title": "Сети (Networks)", "path": "/admin/networks", "icon": "Globe"},
    {"title": "Кейсы и PRO", "path": "/admin/cases", "icon": "Trophy"},
    {"title": "Обучение", "path": "/admin/edu", "icon": "GraduationCap"},
    {"title": "Услуги", "path": "/admin/services", "icon": "Zap"},
    {"title": "События", "path": "/admin/events", "icon": "Calendar"},
    {"title": "SEO & Indexing", "path": "/admin/seo", "icon": "Search"},
    {"title": "API & Агенты", "path": "/admin/api", "icon": "Bot"}
  ]'::jsonb, 'Dynamic Admin Sidebar Menu Structure')
on conflict (key) do nothing;
