/*
  # BookNest Library Management System Schema

  1. New Tables
    - `member`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `created_at` (timestamptz)
    
    - `membership`
      - `id` (uuid, primary key)
      - `member_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `collection`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)
    
    - `category`
      - `id` (uuid, primary key)
      - `name` (text)
      - `sub_name` (text)
      - `created_at` (timestamptz)
    
    - `book`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category_id` (uuid, foreign key)
      - `collection_id` (uuid, foreign key)
      - `launch_date` (timestamptz)
      - `publisher` (text)
      - `created_at` (timestamptz)
    
    - `issuance`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `member_id` (uuid, foreign key)
      - `issued_by` (uuid, foreign key)
      - `issue_date` (timestamptz)
      - `return_date` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create member table
CREATE TABLE IF NOT EXISTS member (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create membership table
CREATE TABLE IF NOT EXISTS membership (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid REFERENCES member(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('active', 'expired', 'suspended')),
  created_at timestamptz DEFAULT now()
);

-- Create collection table
CREATE TABLE IF NOT EXISTS collection (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create category table
CREATE TABLE IF NOT EXISTS category (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sub_name text,
  created_at timestamptz DEFAULT now()
);

-- Create book table
CREATE TABLE IF NOT EXISTS book (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category_id uuid REFERENCES category(id) ON DELETE SET NULL,
  collection_id uuid REFERENCES collection(id) ON DELETE SET NULL,
  launch_date timestamptz,
  publisher text,
  created_at timestamptz DEFAULT now()
);

-- Create issuance table
CREATE TABLE IF NOT EXISTS issuance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid REFERENCES book(id) ON DELETE CASCADE,
  member_id uuid REFERENCES member(id) ON DELETE CASCADE,
  issued_by uuid REFERENCES auth.users(id),
  issue_date timestamptz DEFAULT now(),
  return_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'returned', 'overdue')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE member ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE category ENABLE ROW LEVEL SECURITY;
ALTER TABLE book ENABLE ROW LEVEL SECURITY;
ALTER TABLE issuance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON member
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON membership
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON collection
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON category
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON book
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON issuance
  FOR SELECT TO authenticated USING (true);

-- Create helpful views
CREATE VIEW pending_returns AS
SELECT 
  i.id as issuance_id,
  b.name as book_name,
  m.name as member_name,
  m.email as member_email,
  i.issue_date,
  i.return_date,
  i.status
FROM issuance i
JOIN book b ON b.id = i.book_id
JOIN member m ON m.id = i.member_id
WHERE i.status = 'pending'
AND i.return_date <= CURRENT_DATE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_issuance_status ON issuance(status);
CREATE INDEX IF NOT EXISTS idx_issuance_return_date ON issuance(return_date);
CREATE INDEX IF NOT EXISTS idx_book_name ON book(name);
CREATE INDEX IF NOT EXISTS idx_member_email ON member(email);