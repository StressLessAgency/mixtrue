-- mixtrue — Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Users / Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'legendary')),
  comp_type TEXT DEFAULT 'none' CHECK (comp_type IN ('none', 'lifetime', 'timed')),
  comp_expires_at TIMESTAMPTZ,
  comp_granted_by UUID REFERENCES auth.users,
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

-- ========== RLS Policies ==========
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

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
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

-- ========== Auto-create profile on signup ==========
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

-- ========== Admin: Comp Account RPC ==========
-- Call from frontend: supabase.rpc('comp_account', { ... })
CREATE OR REPLACE FUNCTION comp_account(
  target_user_id UUID,
  new_plan TEXT,
  new_comp_type TEXT,
  new_comp_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can comp accounts';
  END IF;

  -- Validate plan
  IF new_plan NOT IN ('free', 'pro', 'legendary') THEN
    RAISE EXCEPTION 'Invalid plan: %', new_plan;
  END IF;

  -- Validate comp type
  IF new_comp_type NOT IN ('none', 'lifetime', 'timed') THEN
    RAISE EXCEPTION 'Invalid comp type: %', new_comp_type;
  END IF;

  -- Timed comps require an expiry date
  IF new_comp_type = 'timed' AND new_comp_expires_at IS NULL THEN
    RAISE EXCEPTION 'Timed comps require an expiry date';
  END IF;

  UPDATE profiles
  SET
    plan = new_plan,
    comp_type = new_comp_type,
    comp_expires_at = new_comp_expires_at,
    comp_granted_by = auth.uid()
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========== Cron: Expire timed comps ==========
-- Runs daily, downgrades expired timed comps back to free
-- Requires pg_cron extension (enable in Supabase Dashboard > Database > Extensions)
CREATE OR REPLACE FUNCTION expire_timed_comps()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET
    plan = 'free',
    comp_type = 'none',
    comp_expires_at = NULL,
    comp_granted_by = NULL
  WHERE
    comp_type = 'timed'
    AND comp_expires_at IS NOT NULL
    AND comp_expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule it to run daily at midnight UTC
-- Run this AFTER enabling pg_cron extension:
-- SELECT cron.schedule('expire-timed-comps', '0 0 * * *', 'SELECT expire_timed_comps()');

-- ========== Cron: Reset monthly analysis counts ==========
-- Runs on the 1st of each month at midnight UTC
CREATE OR REPLACE FUNCTION reset_monthly_analyses()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET analyses_this_month = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run this AFTER enabling pg_cron extension:
-- SELECT cron.schedule('reset-monthly-analyses', '0 0 1 * *', 'SELECT reset_monthly_analyses()');

-- ========== Promote user to admin (legendary lifetime) ==========
-- Run this to make a user an admin with legendary lifetime status.
-- Replace 'your@email.com' with the actual admin email.
--
-- UPDATE profiles
-- SET role = 'admin', plan = 'legendary', comp_type = 'lifetime', comp_expires_at = NULL
-- WHERE email = 'your@email.com';

-- ========== Ensure admins always have legendary access ==========
-- Trigger: when role is set to 'admin', auto-set plan to legendary lifetime
CREATE OR REPLACE FUNCTION ensure_admin_legendary()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' AND (NEW.plan != 'legendary' OR NEW.comp_type != 'lifetime') THEN
    NEW.plan := 'legendary';
    NEW.comp_type := 'lifetime';
    NEW.comp_expires_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_admin_update
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION ensure_admin_legendary();
