/*
  # Create profiles table and related features

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `name` (text) - user's display name
      - `email` (text) - user's email
      - `user_type` (enum) - type of user (child, guardian, teacher, admin)
      - `avatar_url` (text) - URL to user's avatar image
      - `bio` (text) - user's biography
      - `created_at` (timestamptz) - when profile was created
      - `updated_at` (timestamptz) - when profile was last updated

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Users can read their own profile
      - Users can update their own profile
      - Admins can read and update all profiles
*/

-- Create enum for user types
CREATE TYPE user_type AS ENUM ('child', 'guardian', 'teacher', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  user_type user_type NOT NULL DEFAULT 'child',
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );