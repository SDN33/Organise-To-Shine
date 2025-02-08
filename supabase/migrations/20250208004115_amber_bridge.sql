/*
  # Create articles table for the blog

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `status` (text) - can be 'draft', 'published'
      - `slug` (text, unique)

  2. Security
    - Enable RLS on `articles` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text DEFAULT 'draft',
  slug text UNIQUE NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published'))
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow users to read published articles
CREATE POLICY "Anyone can read published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users to create articles
CREATE POLICY "Authenticated users can create articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own articles
CREATE POLICY "Users can update own articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own articles
CREATE POLICY "Users can delete own articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);