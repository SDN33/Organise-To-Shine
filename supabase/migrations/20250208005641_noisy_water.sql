/*
  # Add auto-generation logging table

  1. New Tables
    - `auto_generation_log`
      - `id` (uuid, primary key)
      - `generated_at` (timestamp)
      - `articles_count` (integer)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS auto_generation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at timestamptz DEFAULT now(),
  articles_count integer NOT NULL
);

ALTER TABLE auto_generation_log ENABLE ROW LEVEL SECURITY;

-- Only allow admin to insert and read logs
CREATE POLICY "Admin can manage auto generation logs"
  ON auto_generation_log
  FOR ALL
  TO authenticated
  USING (auth.email() LIKE '%stillinovagency93%')
  WITH CHECK (auth.email() LIKE '%stillinovagency93%');