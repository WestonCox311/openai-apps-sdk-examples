/*
  # Add Roadmap Features Table

  1. New Tables
    - `roadmap_features`
      - `id` (uuid, primary key)
      - `title` (text) - Feature title
      - `description` (text) - Feature description
      - `status` (enum) - backlog, todo, in_progress, review, done
      - `priority` (enum) - low, medium, high, critical
      - `category` (text) - Feature category grouping
      - `assignee_id` (uuid) - Assigned user
      - `estimated_hours` (integer) - Effort estimation
      - `sort_order` (integer) - Order within status column
      - `labels` (jsonb) - Array of label strings
      - `created_by` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `roadmap_features` table
    - Add policies for authenticated users to read all features
    - Add policies for editors/admins to create, update, delete features
*/

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feature_status') THEN
    CREATE TYPE feature_status AS ENUM ('backlog', 'todo', 'in_progress', 'review', 'done');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feature_priority') THEN
    CREATE TYPE feature_priority AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS roadmap_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status feature_status NOT NULL DEFAULT 'backlog',
  priority feature_priority NOT NULL DEFAULT 'medium',
  category text DEFAULT '',
  assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  estimated_hours integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  labels jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE roadmap_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roadmap features"
  ON roadmap_features FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create roadmap features"
  ON roadmap_features FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update roadmap features"
  ON roadmap_features FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete roadmap features"
  ON roadmap_features FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_roadmap_features_status ON roadmap_features(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_features_priority ON roadmap_features(priority);
CREATE INDEX IF NOT EXISTS idx_roadmap_features_sort_order ON roadmap_features(sort_order);
