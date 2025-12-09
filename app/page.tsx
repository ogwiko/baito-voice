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

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="mx-auto mb-2" />
        データの取得に失敗しました
      </div>
    );
  }

  return (
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
  );
}
