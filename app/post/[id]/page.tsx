import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Star, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Post, Shop } from '@/types';
import ConfidentialContent from '@/components/features/ConfidentialContent';
import { MOCK_POSTS } from '@/lib/mockData';
import type { Metadata } from 'next';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baito-voice-rdps.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const mockPost = MOCK_POSTS.find((p) => p.id === id);
  let shopName = mockPost?.shop_name || 'バイト口コミ';
  let content = mockPost?.filtered_content || '';

  if (!mockPost) {
    try {
      const { data } = await supabase
        .from('posts')
        .select('shop_name, filtered_content')
        .eq('id', id)
        .single();
      if (data) {
        shopName = data.shop_name;
        content = data.filtered_content;
      }
    } catch {}
  }

  const title = `${shopName}のバイト口コミ | Baito Voice`;
  const description = content.slice(0, 100) + (content.length > 100 ? '…' : '');
  const url = `${siteUrl}/post/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Baito Voice',
      locale: 'ja_JP',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@baito_voice',
    },
  };
}

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    let post: any = null;
    let dbError = false;

    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              shops (
                id,
                name,
                location,
                average_rating
              )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        post = data;
    } catch (e) {
        console.error('Error fetching post:', e);
        dbError = true;
    }

    if (!post || dbError) {
        post = MOCK_POSTS.find(p => p.id === id);
    }

    if (!post) {
        notFound();
    }

    const shop = post.shops as unknown as Shop;

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                一覧に戻る
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                            <div className="flex items-center text-gray-500 gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {shop.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                                <Star size={20} className="text-yellow-400 fill-yellow-400 mr-1.5" />
                                <span className="font-bold text-yellow-700 text-lg">{post.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">評価</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                みんなへの公開内容
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                {post.tone_type === 'business' && 'ビジネス変換'}
                                {post.tone_type === 'mild' && 'マイルド変換'}
                                {post.tone_type === 'humor' && 'ユーモア変換'}
                            </span>
                        </div>
                        <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 text-gray-800 leading-relaxed text-lg">
                            {post.filtered_content}
                        </div>
                    </section>

                    <section className="opacity-90">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gray-300 rounded-full"></span>
                                元の心の声
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                非公開情報
                            </span>
                        </div>
                        <ConfidentialContent content={post.original_content} />
                    </section>
                </div>
            </div>
        </div>
    );
}
