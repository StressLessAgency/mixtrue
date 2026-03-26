-- Migration 001: Add comp system + legendary tier
-- Run this in Supabase SQL Editor if you already have the base schema

-- 1. Add legendary to plan check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'pro', 'legendary'));

-- 2. Add comp fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS comp_type TEXT DEFAULT 'none'
    CHECK (comp_type IN ('none', 'lifetime', 'timed')),
  ADD COLUMN IF NOT EXISTS comp_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS comp_granted_by UUID REFERENCES auth.users;

-- 3. Admin can update all profiles (for comping)
CREATE POLICY IF NOT EXISTS "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Comp account RPC
CREATE OR REPLACE FUNCTION comp_account(
  target_user_id UUID,
  new_plan TEXT,
  new_comp_type TEXT,
  new_comp_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can comp accounts';
  END IF;

  IF new_plan NOT IN ('free', 'pro', 'legendary') THEN
    RAISE EXCEPTION 'Invalid plan: %', new_plan;
  END IF;

  IF new_comp_type NOT IN ('none', 'lifetime', 'timed') THEN
    RAISE EXCEPTION 'Invalid comp type: %', new_comp_type;
  END IF;

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

-- 5. Expire timed comps (daily cron)
CREATE OR REPLACE FUNCTION expire_timed_comps()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET plan = 'free', comp_type = 'none', comp_expires_at = NULL, comp_granted_by = NULL
  WHERE comp_type = 'timed' AND comp_expires_at IS NOT NULL AND comp_expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Reset monthly analysis counts (1st of month cron)
CREATE OR REPLACE FUNCTION reset_monthly_analyses()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET analyses_this_month = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Schedule crons (requires pg_cron extension enabled)
-- Enable pg_cron: Supabase Dashboard > Database > Extensions > pg_cron
-- Then uncomment and run:
-- SELECT cron.schedule('expire-timed-comps', '0 0 * * *', 'SELECT expire_timed_comps()');
-- SELECT cron.schedule('reset-monthly-analyses', '0 0 1 * *', 'SELECT reset_monthly_analyses()');
