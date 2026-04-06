-- FCM Support — Insurance Audit Tables
-- Run this in Supabase SQL Editor or via migration
-- Project: dykudrjpcliuyahjuiag (fcm-intelligence, EU-West-1)

-- Table 1: Completed audit submissions
CREATE TABLE IF NOT EXISTS support_audit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  branch_name TEXT,
  fad_code TEXT,
  renewal_bucket TEXT NOT NULL CHECK (renewal_bucket IN ('0_3m', '3_6m', '6_12m', '12m_plus', 'unsure')),
  answers JSONB NOT NULL,
  cover_type TEXT,
  critical_count SMALLINT NOT NULL DEFAULT 0,
  important_count SMALLINT NOT NULL DEFAULT 0,
  worth_reviewing_count SMALLINT NOT NULL DEFAULT 0,
  warning_count SMALLINT NOT NULL DEFAULT 0,
  user_agent TEXT
);

-- Indexes for support_audit_submissions
CREATE INDEX idx_support_audit_submissions_email ON support_audit_submissions(email);
CREATE INDEX idx_support_audit_submissions_fad_code ON support_audit_submissions(fad_code) WHERE fad_code IS NOT NULL;
CREATE INDEX idx_support_audit_submissions_renewal_bucket ON support_audit_submissions(renewal_bucket);
CREATE INDEX idx_support_audit_submissions_created_at ON support_audit_submissions(created_at DESC);

-- Table 2: PDF requests (policy-check bouncers)
CREATE TABLE IF NOT EXISTS support_audit_pdf_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  branch_name TEXT,
  pdf_sent_at TIMESTAMPTZ,
  follow_up_sent_at TIMESTAMPTZ,
  converted_to_submission BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for support_audit_pdf_requests
CREATE INDEX idx_support_audit_pdf_requests_email ON support_audit_pdf_requests(email);
CREATE INDEX idx_support_audit_pdf_requests_created_at ON support_audit_pdf_requests(created_at DESC);
CREATE INDEX idx_support_audit_pdf_requests_follow_up_pending ON support_audit_pdf_requests(follow_up_sent_at) WHERE follow_up_sent_at IS NULL;

-- RLS policies (standard pattern — API route inserts via service role key, no public read)
ALTER TABLE support_audit_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_audit_pdf_requests ENABLE ROW LEVEL SECURITY;

-- No public SELECT policies — data is internal only
-- API routes use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- Grant permissions to service role (should already exist, but explicit for clarity)
GRANT ALL ON support_audit_submissions TO service_role;
GRANT ALL ON support_audit_pdf_requests TO service_role;

-- Comments for documentation
COMMENT ON TABLE support_audit_submissions IS 'FCM Support insurance audit completed submissions';
COMMENT ON TABLE support_audit_pdf_requests IS 'FCM Support insurance audit PDF email requests (policy-check bouncers)';
COMMENT ON COLUMN support_audit_submissions.renewal_bucket IS 'When the user''s policy is due for renewal (0_3m, 3_6m, 6_12m, 12m_plus, unsure)';
COMMENT ON COLUMN support_audit_submissions.answers IS 'Full 17-answer object with all storage keys from the survey';
COMMENT ON COLUMN support_audit_pdf_requests.converted_to_submission IS 'Set to TRUE if this email later appears in support_audit_submissions (dedup tracking)';
