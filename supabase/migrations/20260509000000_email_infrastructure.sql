-- Email audit log — every sent email is recorded here.
-- Only the service role can read or write this table (no client access).
CREATE TABLE public.email_log (
  id                  UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email     TEXT          NOT NULL,
  email_type          TEXT          NOT NULL,
  resend_message_id   TEXT,
  status              TEXT          NOT NULL DEFAULT 'sent',
  sent_at             TIMESTAMPTZ   NOT NULL DEFAULT now(),
  user_id             UUID          REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

-- No client-side access. The API layer uses the service role key.
CREATE POLICY "No direct client access"
  ON public.email_log
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Indexes for common queries
CREATE INDEX email_log_recipient_idx ON public.email_log (recipient_email);
CREATE INDEX email_log_type_idx      ON public.email_log (email_type);
CREATE INDEX email_log_sent_at_idx   ON public.email_log (sent_at DESC);


-- Extend waitlist_signups with consent + unsubscribe tracking
ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS marketing_consent  BOOLEAN     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS unsubscribed_at    TIMESTAMPTZ;
