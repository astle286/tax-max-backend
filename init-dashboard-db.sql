-- Only needed if you want to manually create user and DB
-- If POSTGRES_USER and POSTGRES_DB are already set in docker-compose, this is optional

-- Connect to default postgres DB
\c postgres

-- Create user (optional if already created by env vars)
CREATE USER dashboard_user WITH PASSWORD 'dashboard_pass';

-- Create DB and assign ownership
CREATE DATABASE dashboard_db OWNER dashboard_user;

-- Connect to dashboard_db
\c dashboard_db

-- Create table and seed data
CREATE TABLE dashboard_metrics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dashboard_metrics (metric_name, metric_value)
VALUES
  ('total_users', 123),
  ('tax_filings', 87),
  ('pending_approvals', 14),
  ('revenue_collected', 1200000);
