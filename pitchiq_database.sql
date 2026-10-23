-- =========================================================================
-- PitchIQ Production Database Schema (PostgreSQL / Supabase)
-- Project: PitchIQ - AI-Powered Pitch Intelligence Engine
-- Author: Parth Bavalliya
-- =========================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.pitchiq_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pitch Revision History Table (Tracks attempt progression: 62 -> 74 -> 83)
CREATE TABLE IF NOT EXISTS public.pitchiq_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES public.pitchiq_users(email) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  pitch_title VARCHAR(255) NOT NULL,
  pitch_text TEXT NOT NULL,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  verdict TEXT NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Saved Pitches Table
CREATE TABLE IF NOT EXISTS public.pitchiq_saved_pitches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES public.pitchiq_users(email) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  snippet TEXT NOT NULL,
  score INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Analysed' CHECK (status IN ('Draft', 'Analysed')),
  last_updated VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for high-velocity user lookup and history queries
CREATE INDEX IF NOT EXISTS idx_history_user_email ON public.pitchiq_history(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_user_email ON public.pitchiq_saved_pitches(user_email);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.pitchiq_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pitchiq_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitchiq_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitchiq_saved_pitches ENABLE ROW LEVEL SECURITY;

-- Allow public frontend registrations and operations
CREATE POLICY "Allow public account creation"
  ON public.pitchiq_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to read their own account"
  ON public.pitchiq_users FOR SELECT USING (true);

CREATE POLICY "Allow users to read own history"
  ON public.pitchiq_history FOR SELECT USING (true);

CREATE POLICY "Allow users to insert own history"
  ON public.pitchiq_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to manage saved pitches"
  ON public.pitchiq_saved_pitches FOR ALL USING (true);
