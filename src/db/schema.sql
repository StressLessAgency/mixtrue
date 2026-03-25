-- mixtrue AI — Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Users / Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  analyses_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analysis Sessions (metadata only — no audio)
CREATE TABLE analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  track_name TEXT,
  file_format TEXT,
  file_size_mb NUMERIC,
  genre_mode TEXT,
  analysis_mode TEXT CHECK (analysis_mode IN ('mixdown', 'master', 'both')),
  overall_score INTEGER,
  mixdown_score INTEGER,
  club_score INTEGER,
  master_score INTEGER,
  report_data JSONB,
  deletion_confirmed_at TIMESTAMPTZ,
  deletion_receipt_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Settings
CREATE TABLE admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  api_endpoint_url TEXT,
  api_key_masked TEXT,
  max_file_size_mb INTEGER DEFAULT 200,
  session_timeout_minutes INTEGER DEFAULT 10,
  analysis_queue_limit INTEGER DEFAULT 50,
  lufs_targets JSONB,
  codec_simulation_enabled BOOLEAN DEFAULT true,
  reference_track_enabled BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stripe Events (webhook log)
CREATE TABLE stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE,
  event_type TEXT,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can read their own sessions
CREATE POLICY "Users can view own sessions"
  ON analysis_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON analysis_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read everything
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view all sessions"
  ON analysis_sessions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage settings"
  ON admin_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
