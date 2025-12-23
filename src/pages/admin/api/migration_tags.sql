
-- Add tags to contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add target_tags to campaigns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_tags text[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
