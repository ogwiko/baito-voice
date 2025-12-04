-- 既存のポリシーを削除（エラー回避のため）
DROP POLICY IF EXISTS "Public shops are viewable by everyone" ON shops;
DROP POLICY IF EXISTS "Anyone can insert shops" ON shops;
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;

-- RLSを確実に有効化
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- shopsテーブルのポリシー再作成
CREATE POLICY "Public shops are viewable by everyone" ON shops FOR SELECT USING (true);
CREATE POLICY "Anyone can insert shops" ON shops FOR INSERT WITH CHECK (true);

-- postsテーブルのポリシー再作成
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
