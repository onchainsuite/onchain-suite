-- Neon (PostgreSQL) schema for OnchainSuite (R3tain-focused)
-- Mirrors Prisma models: waitlist, campaigns, subscribers (contacts)

-- NOTE:
-- - IDs are TEXT to match Prisma String ids (cuid generated at app level)
-- - JSON fields use JSONB
-- - Timestamps use TIMESTAMPTZ
-- - Foreign keys to users/projects are omitted to keep this portable

-- =====================================
-- Waitlist (matches frontend form: email, name, product, mode)
-- =====================================
CREATE TABLE IF NOT EXISTS waitlist (
  id          TEXT PRIMARY KEY,
  product     TEXT NOT NULL,
  mode        TEXT NOT NULL,
  email       TEXT NOT NULL,
  name        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_product_email_unique
  ON waitlist (product, email);

-- =====================================
-- Campaigns
-- =====================================
CREATE TABLE IF NOT EXISTS campaigns (
  id                 TEXT PRIMARY KEY,
  project_id         TEXT NOT NULL,
  user_id            TEXT NOT NULL,
  name               TEXT NOT NULL,
  description        TEXT,
  type               TEXT NOT NULL DEFAULT 'email',
  status             TEXT NOT NULL DEFAULT 'draft',
  content            JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_subscribers  INTEGER NOT NULL DEFAULT 0,
  active_subscribers INTEGER NOT NULL DEFAULT 0,
  conversion_rate    NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  scheduled_at       TIMESTAMP,
  launched_at        TIMESTAMP,
  completed_at       TIMESTAMP,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_project ON campaigns (project_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns (user_id);

-- =====================================
-- Subscribers (contacts)
-- =====================================
CREATE TABLE IF NOT EXISTS subscribers (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL,
  campaign_id     TEXT,
  email           TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  status          TEXT NOT NULL DEFAULT 'active',
  tags            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  custom_fields   JSONB NOT NULL DEFAULT '{}'::jsonb,
  source          TEXT,
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_project_email_unique
  ON subscribers (project_id, email);

CREATE INDEX IF NOT EXISTS idx_subscribers_campaign ON subscribers (campaign_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_project ON subscribers (project_id);

-- =====================================
-- Helpful views (optional)
-- =====================================
 CREATE VIEW r3tain_contacts AS
   SELECT id, project_id, email, first_name, last_name, status, tags, created_at, updated_at
   FROM subscribers;
