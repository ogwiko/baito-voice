import SearchFilter from '@/components/features/SearchFilter';
import PostCard from '@/components/features/PostCard';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Post, Shop } from '@/types';
import MapWrapper from '@/components/features/MapWrapper';
import SortSelect from '@/components/features/SortSelect';
import AdBanner from '@/components/ads/AdBanner';
import React from 'react';

// Revalidate data every 0 seconds (dynamic) or use a specific interval
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = (await searchParams) || {};
  const area = typeof params.area === 'string' ? params.area : undefined;
  const keyword = typeof params.keyword === 'string' ? params.keyword : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';

  let query = supabase
    .from('posts')
    .select(`
      *,
      shops!inner (
        id,
        name,
        location,
        average_rating
      )
    `);

  // Apply filters
  if (area) {
    // Handle multiple keywords (e.g., "北海道 東北")
    const areas = area.split(' ').filter(Boolean);
    if (areas.length > 1) {
      // Create an OR filter for multiple areas
      // format: shop_name.ilike.%A%,shop_name.ilike.%B%... but for shops.location
      // Since we are filtering on a joined table 'shops', we need to be careful.
      // Supabase query builder 'or' with foreign tables can be tricky.
      // However, we can use the inner join filtering syntax.
      // But 'or' usually applies to the main table unless referenced correctly.
      // A simpler way for joined column OR is to use the filter string format:
      // shops.location.ilike.%A%,shops.location.ilike.%B%
      const orCondition = areas.map(a => `shops.location.ilike.%${a}%`).join(',');
      query = query.or(orCondition);
    } else {
      query = query.ilike('shops.location', `%${area}%`);
    }
  }

  if (keyword) {
    query = query.or(`shop_name.ilike.%${keyword}%,filtered_content.ilike.%${keyword}%,original_content.ilike.%${keyword}%`);
  }

  // Apply sorting
  if (sort === 'rating_desc') {
    query = query.order('rating', { ascending: false });
  } else if (sort === 'rating_asc') {
    query = query.order('rating', { ascending: true });
  } else {
    // Default: newest
    query = query.order('created_at', { ascending: false });
  }

  const MOCK_POSTS = [
    {
      id: "mock-1",
      created_at: new Date().toISOString(),
      shop_name: "渋谷カフェ・ラテ",
      rating: 4,
      tone_type: "mild",
      wage: 1200,
      tags: ["#楽", "#まかない有"],
      filtered_content: "シフトの融通が利きやすく、スタッフの皆さんもとても親切で働きやすい環境です。美味しいまかないもいただけます！",
      original_content: "店長がめっちゃ優しくてシフト超自由！まかないのパスタが美味しすぎるから実質食費浮いて最高です。",
      shops: { id: "shop-1", name: "渋谷カフェ・ラテ", location: "東京都渋谷区神南1-2-3", average_rating: 4, lat: 35.6580, lng: 139.7016 }
    },
    {
      id: "mock-2",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      shop_name: "新宿コンビニ24",
      rating: 2,
      tone_type: "business",
      wage: 1050,
      tags: ["#激務"],
      filtered_content: "深夜時間帯は比較的業務量が多く、マルチタスク能力が求められるため、非常に鍛えられる環境です。",
      original_content: "夜勤ワンオペで品出しとレジと掃除全部やらされてマジで地獄。忙しすぎて死ぬ。",
      shops: { id: "shop-2", name: "新宿コンビニ24", location: "東京都新宿区歌舞伎町2-3-4", average_rating: 2, lat: 35.6896, lng: 139.6993 }
    },
    {
      id: "mock-3",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      shop_name: "梅田居酒屋・のれん",
      rating: 5,
      tone_type: "humor",
      wage: 1500,
      tags: ["#人間関係良", "#まかない有"],
      filtered_content: "活気あふれる職場で、まるで毎日がフェスティバルのようです。店長のギャグ線が高く、笑いの絶えない職場です！",
      original_content: "みんな仲良すぎてバイト終わりの飲み会が楽しすぎる！店長が面白くて最高です。時給も良し！",
      shops: { id: "shop-3", name: "梅田居酒屋・のれん", location: "大阪府大阪市北区梅田1-1-1", average_rating: 5, lat: 34.7024, lng: 135.4959 }
    }
  ];

  let posts: any[] = [];
  let isDemo = false;
  const { data, error } = await query;

  if (error || !data) {
    console.error('Error fetching posts:', error);
    isDemo = true;
    posts = MOCK_POSTS;
  } else {
    posts = data;
  }

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <span><span className="font-bold">デモモードで動作中:</span> サンプルデータを表示しています。</span>
        </div>
      )}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-8 space-y-6">
        <header className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">最新の投稿</h1>
            <p className="text-gray-500 text-sm mt-1">
              みんなのバイト体験談を見てみよう
            </p>
          </div>

          {/* Sort Dropdown */}
          <SortSelect />
        </header>

        <div className="space-y-6">
          {/* Top Ad */}
          <AdBanner type="feed" />

          {posts && posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <React.Fragment key={post.id}>
                <PostCard
                  post={post}
                  shop={post.shops as Shop}
                />
                {/* Insert Ad every 5 posts */}
                {(index + 1) % 5 === 0 && <AdBanner type="feed" />}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">まだ投稿がありません</p>
              <p className="text-sm text-gray-400 mt-1">
                最初の投稿者になりませんか？
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="lg:col-span-4 space-y-6">
        <SearchFilter />

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 h-64 overflow-hidden relative z-0">
          <MapWrapper />
        </div>
      </div>
    </div>
    </div>
  );
}
