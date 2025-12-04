-- Reset: Drop existing tables if they exist
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS shops;

-- 1. Create shops table
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_name TEXT NOT NULL,
  shop_id UUID REFERENCES shops(id),
  original_content TEXT NOT NULL,
  filtered_content TEXT NOT NULL,
  tone_type TEXT NOT NULL CHECK (tone_type IN ('business', 'mild', 'humor')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Shops: Allow read and insert for everyone
CREATE POLICY "Public shops are viewable by everyone" ON shops FOR SELECT USING (true);
CREATE POLICY "Anyone can insert shops" ON shops FOR INSERT WITH CHECK (true);

-- Posts: Allow read and insert for everyone
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
