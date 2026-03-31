-- Migration: Add clarification gate fields to orders table
-- Run this against your Supabase project via SQL Editor or psql

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS clarification_questions JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS clarification_responses JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS clarification_sent_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS clarification_responded_at TIMESTAMPTZ DEFAULT NULL;

-- Index for quick lookups of orders awaiting clarification
CREATE INDEX IF NOT EXISTS idx_orders_clarification_sent
  ON orders (clarification_sent_at)
  WHERE clarification_sent_at IS NOT NULL AND clarification_responded_at IS NULL;

COMMENT ON COLUMN orders.clarification_questions IS 'Array of question strings sent to customer';
COMMENT ON COLUMN orders.clarification_responses IS 'Array of {question, answer, skipped} objects from customer';
COMMENT ON COLUMN orders.clarification_sent_at IS 'When clarification email was sent';
COMMENT ON COLUMN orders.clarification_responded_at IS 'When customer submitted their answers';
