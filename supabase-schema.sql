-- Migration: Create OAuth tokens and monitoring tables
-- This file contains all the database schema needed for MVP

-- 1. User OAuth Tokens Table
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_provider ON user_tokens(user_id, provider);

-- 2. Playlists Table (monitors renamed)
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id TEXT NOT NULL,
  playlist_url TEXT NOT NULL,
  title TEXT,
  thumbnail TEXT,
  channel_name TEXT,
  video_count INT DEFAULT 0,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_playlist_id ON playlists(playlist_id);

-- 3. Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT,
  duration TEXT,
  published_at TIMESTAMPTZ,
  channel_name TEXT,
  view_count BIGINT,
  is_new BOOLEAN DEFAULT TRUE,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_playlist_id ON videos(playlist_id);
CREATE INDEX IF NOT EXISTS idx_videos_video_id ON videos(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_is_new ON videos(is_new);

-- 4. Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_chat_id TEXT,
  telegram_enabled BOOLEAN DEFAULT FALSE,
  whatsapp_number TEXT,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  email_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- user_tokens policies
CREATE POLICY "Users can view own tokens" ON user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON user_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON user_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens" ON user_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- playlists policies
CREATE POLICY "Users can view own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists" ON playlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists" ON playlists
  FOR DELETE USING (auth.uid() = user_id);

-- videos policies (users can see videos from their playlists)
CREATE POLICY "Users can view videos from own playlists" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = videos.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage videos" ON videos
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- notification_settings policies
CREATE POLICY "Users can view own settings" ON notification_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON notification_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
