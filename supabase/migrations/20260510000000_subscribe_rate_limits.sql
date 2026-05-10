-- Rate-limit table for the /subscribe endpoint.
-- One row per (ip, hour window). The API atomically increments the counter
-- and rejects the request if it exceeds the threshold.
-- Old windows are pruned by the API on each request (DELETE WHERE window_start < now() - 24h).

CREATE TABLE IF NOT EXISTS public.subscribe_rate_limits (
  ip           TEXT        NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count        INTEGER     NOT NULL DEFAULT 1,
  PRIMARY KEY (ip, window_start)
);

ALTER TABLE public.subscribe_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct client access — only the service-role API can touch this table.
CREATE POLICY "No direct client access"
  ON public.subscribe_rate_limits
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE INDEX IF NOT EXISTS subscribe_rate_limits_window_idx
  ON public.subscribe_rate_limits (window_start);
