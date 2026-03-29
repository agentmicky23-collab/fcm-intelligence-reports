-- FCM Intelligence — Session 8 Migration
-- Adds: feedback tracking, mid-week alert tracking, feedback influence on matching
-- Run via Supabase SQL editor or CLI

-- 1. Add feedback columns to insider_matches
ALTER TABLE insider_matches
  ADD COLUMN IF NOT EXISTS feedback TEXT CHECK (feedback IN ('up', 'down')),
  ADD COLUMN IF NOT EXISTS feedback_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS alert_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS alert_sent_at TIMESTAMPTZ;

-- 2. Feedback summary table (aggregated per subscriber for fast lookups)
CREATE TABLE IF NOT EXISTS insider_feedback_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES insider_subscribers(id) ON DELETE CASCADE,

  -- Learned preferences from thumbs up/down patterns
  preferred_regions JSONB DEFAULT '[]'::jsonb,
  avoided_regions JSONB DEFAULT '[]'::jsonb,
  preferred_price_min INTEGER,
  preferred_price_max INTEGER,
  preferred_tenure TEXT,
  preferred_business_types JSONB DEFAULT '[]'::jsonb,
  avoided_business_types JSONB DEFAULT '[]'::jsonb,

  -- Stats
  total_thumbs_up INTEGER DEFAULT 0,
  total_thumbs_down INTEGER DEFAULT 0,
  last_feedback_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(subscriber_id)
);

-- 3. Enable RLS
ALTER TABLE insider_feedback_signals ENABLE ROW LEVEL SECURITY;

-- Service role policy (matches existing pattern)
CREATE POLICY "Service role full access on insider_feedback_signals"
  ON insider_feedback_signals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Add last_alert_sent_at to subscribers for rate-limiting mid-week alerts
ALTER TABLE insider_subscribers
  ADD COLUMN IF NOT EXISTS last_alert_sent_at TIMESTAMPTZ;

-- 5. Index for fast mid-week alert queries
CREATE INDEX IF NOT EXISTS idx_insider_matches_alert
  ON insider_matches (alert_sent, match_score DESC)
  WHERE alert_sent = false;

CREATE INDEX IF NOT EXISTS idx_insider_matches_feedback
  ON insider_matches (subscriber_id, feedback)
  WHERE feedback IS NOT NULL;
