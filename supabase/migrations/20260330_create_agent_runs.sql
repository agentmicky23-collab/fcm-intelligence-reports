-- Agent Runs Tracking Table
-- Records every agent invocation for live Mission Control metrics
-- Created: 2026-03-30

CREATE TABLE IF NOT EXISTS agent_runs (
  id SERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  agent_id TEXT NOT NULL CHECK (agent_id IN ('scout', 'sage', 'sentinel', 'oracle')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'timeout')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  tokens_used INTEGER,
  cost_usd NUMERIC(10,4),
  error_message TEXT,
  output_summary JSONB
);

-- Indexes for Mission Control queries
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_started_at ON agent_runs(started_at DESC);
CREATE INDEX idx_agent_runs_order_id ON agent_runs(order_id);

-- Composite index for "ops today" query
CREATE INDEX idx_agent_runs_started_status ON agent_runs(started_at, status);

COMMENT ON TABLE agent_runs IS 'Tracks every agent invocation for live Mission Control metrics';
COMMENT ON COLUMN agent_runs.agent_id IS 'Which agent: scout, sage, sentinel, oracle';
COMMENT ON COLUMN agent_runs.cost_usd IS 'Estimated API cost for this run based on token usage';
COMMENT ON COLUMN agent_runs.output_summary IS 'Agent-specific output metadata (sections written, issues found, etc)';
